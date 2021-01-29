<template>
  <div class="detail" @click="showBox = false">
    <div class="header">
      <div class="top" v-if="isShare === false">
        <div @click="$router.go(-1)">返回</div>
        <div>
          <img @click.stop="showBox = !showBox" src="@/assets/v2_qkcc81.png" />
          <div v-if="showBox">
            <div class="box">
              <li
                @click="$router.push({ path: '/Poster', query: { id: qid ,isHidden:isHidden } })"
              >
                分享
              </li>
              <li @click.stop="(dialogValue = 'del'), (showBox = false)">
                删除
              </li>
              <li @click.stop="(dialogValue = 'block'), (showBox = false)">
                屏蔽该用户
              </li>
              <li @click.stop="$router.push('/report')">举报</li>
            </div>
            <div class="triangle"></div>
          </div>
        </div>
      </div>

      <div v-else><img src="@/assets/v2_qkaufe.png" /></div>

      <div class="bottom">
        <div class="tit" v-if="isHidden == 1">
          {{detailData.is_open ?   detailData.from_user.nickName  :'匿名' }}提问
        </div>
        <div class="tit" v-else>
          向 <img :src="detailData.to_user.avatarUrl"/> {{detailData.to_user.nickName}}
          {{detailData.is_open ? ''  :'匿名' }}提问
        </div>

        <!-- <div class="tit">{{detailData.is_open && isHidden ==1 ?  detailData.from_user.nickName : '匿名'}}提问</div> -->
        <div class="content">
          {{ detailData.text }}
        </div>
      </div>
    </div>

    <div class="userInfo">
      <div class="avatar"><img :src="detailData.to_user.avatarUrl" /></div>
      <div>{{ detailData.to_user.nickName }}的回答：</div>
    </div>

    <div class="container">
      <div v-if="detailData.answer + '' === '' && !isShare && $route.query.isHidden ==1" >
        <textarea  v-model="content" placeholder="输入回答内容..." />
      </div>
      <div v-else>{{ detailData.answer ? detailData.answer : "暂无回答" }}</div>

      <div
        v-show="!detailData.have_answer && isShare === false && $route.query.isHidden ==1"
        class="commit"
        @click="commit()"
      >
        确定
      </div>
      <div class="time" v-if="detailData.answer + '' !== ''" >编辑于 {{ detailData.answer_time }}</div>
    </div>

    <!-- <div class="container">
      <div></div>
      <div></div>
      <div></div>
    </div> -->

    <div class="shareContainer" v-if="isShare">
      <div @click="$router.push('/')">我也要玩</div>
      <div
        @click="
          $router.push({
            path: '/QuestionBox',
            query: { id: detailData.to_uid },
          })
        "
      >
        Ta的提问箱
      </div>
    </div>

    <div class="blockDialog dialog" v-show="dialogValue === 'block'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>
          <div>是否屏蔽当前用户</div>
          <div>屏蔽后对方将无法给您留言</div>
        </div>
        <div>
          <div @click="dialogValue = false">取消</div>
          <div @click="block()">确定</div>
        </div>
      </div>
    </div>

    <div class="delDialog dialog" v-show="dialogValue === 'del'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>是否删除这封来信</div>
        <div>
          <div @click="dialogValue = false">取消</div>
          <div @click="delQuestion()">确定</div>
        </div>
      </div>
    </div>

    <div class="isblockDialog dialog" v-show="dialogValue === 'isblock'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>
          <span>已屏蔽用户</span>
          <span>可进入“我的-屏蔽列表”查看</span>
        </div>
        <div>3s后 返回首页</div>
      </div>
    </div>

    <div class="replayDialog dialog" v-show="dialogValue === 'replay'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>
          <div>每封来信只能回复一次</div>
          <div>是否确定发送</div>
        </div>
        <div>
          <div @click="dialogValue = false">取消</div>
          <div @click="replyletter()">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlCode } from "@/utils/index.js";
import wx from "weixin-js-sdk";

import {
  getDetail,
  deleteQuestion,
  blockUser,
  postAnswer,
  registerVisitor,
  read,
  login,
  getConfig
} from "@/api/api";
export default {
  name: "detail",
  data() {
    return {
      showBox: false,
      dialogValue: "",
      detailData: {},
      qid: "",
      content: "",
      isHidden: "",
      isShare: "",
    };
  },
  async created() {},

  mounted() {
    let code = this.getUrlCode().code; //返回url中的code
    //localstorage中也没有session 首次进入
    if (
      !localStorage.getItem("question_session") ||
      localStorage.getItem("question_session") === undefined
    ) {
      if (code) {
        //已经通过非静默授权重定向过来
        login(code).then((result) => {
          //设置uid和session到localstorage并用返回到的session继续请求
          localStorage.setItem("question_session", result.data.session);
          localStorage.setItem("question_uid", result.data.uid);
          localStorage.setItem("question_first_login", result.data.first_login);
          this.getDataDetail(this.$route.query.qid, result.data.session);
          this.readLetter(result.data.session);
          this.getWxConfig(result.data.session);
        });
        return; //return掉 不再走授权
      }
      //非静默授权
      var url = encodeURIComponent(window.location.href);
      var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfc6cc44785e79f4a&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = getCodeUrl;
    } else {
      // 已经有session,用localstorage的session来请求 别的业务逻辑
      this.getDataDetail(
        this.$route.query.qid,
        localStorage.getItem("question_session")
      );
      this.readLetter(localStorage.getItem("question_session"));
      this.getWxConfig(localStorage.getItem("question_session"));
    }
  },

  methods: {
    //如果是本人，记录阅读，如果是访客，添加访客记录
    async readLetter(session) {
      this.qid = this.$route.query.qid;
      this.isHidden = this.$route.query.isHidden;
      console.log(this.isHidden)
      if (this.$route.query.isHidden) {
        //url中有isHidden，是本人
        this.isShare = false;
        if (
          this.$store.state.activeTabbarIndex === 0 ||
          this.$store.state.activeTabbarIndex === 2
        ) {
          let parama = {
            session: session,
            qid: this.$route.query.qid,
            is_read_question:
              this.$store.state.activeTabbarIndex === 0
                ? true
                : this.$store.state.activeTabbarIndex === 2
                ? false
                : "",
          };
          read(parama);
        }
      } else {
        //访客url中没有isHidden
        this.isShare = true;
        let data = {
          visitor_uid: this.$route.query.qid,
          session: session,
        };
        await registerVisitor(data);
      }
    },

    //获取微信config配置
    getWxConfig(session) {
      let that = this;
      let data = {
        wechaturl: window.location.href,
        session: session,
      };
      getConfig(data).then((res) => {
        (that.appId = res.data.appId),
          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: [
              "chooseWXPay",
              "updateTimelineShareData",
              "hideMenuItems",
            ],
            openTagList: ["wx-open-launch-weapp"],
          });
        wx.ready(function () {
          wx.hideMenuItems({
            menuList: ["menuItem:share:appMessage","menuItem:share:timeline"], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          });
          console.log("成功");
          wx.updateTimelineShareData({
            title:
              that.userInfo.nickName +
              "开了匿名提问箱，有什么想问的不用憋着啦~", // 分享标题
            link:
              "http://anonymous.lodidc.cn/niming_question/QuestionBox?id=" +
              localStorage.getItem("question_uid"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: that.userInfo.avatarUrl, // 分享图标
            success: function () {
              console.log("设置成功");
              // 设置成功
            },
          });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
        });
        wx.error(function (res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        });
      });
    },

    // 截取url中的code方法
    getUrlCode() {
      var url = location.search;
      console.log(url);
      this.winUrl = url;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },

    // 提交回复内容
    async commit() {
      if (this.content + "" === "") {
        this.$Notify({ type: "warning", message: "请输入内容" });
      } else {
        let data = {
          session: localStorage.getItem("question_session"),
          content: this.content,
          qid: this.qid,
          from_uid: this.detailData.from_uid,
        };
        const res = await postAnswer(data);
        if (res.err_code === 0) {
          this.$Notify({ type: "success", message: "回答成功" });
          this.$router.go(-1);
        }
      }
    },

    async getDataDetail(id, session) {
      let data = {
        session: session,
        qid: id,
        is_send: this.isHidden === 2 ? true :false
      };
      const res = await getDetail(data);
      this.detailData = res.data;
    },

    async delQuestion() {
      let data = {
        session: localStorage.getItem("question_session"),
        qid: this.qid,
        is_to_hidden: this.isHidden == 1 ? true : false,
      };
      const res = await deleteQuestion(data);
      if (res.err_code === 0) {
        this.$Notify({ type: "success", message: "删除成功" });
        this.dialogValue = "";
        this.$router.go(-1);
      }
    },

    async block() {
      let data = {
        session: localStorage.getItem("question_session"),
        qid: this.detailData.qid,
        block_uid: this.detailData.from_uid,
      };
      const res = await blockUser(data);
      if (res.err_code === 0) {
        this.dialogValue = "isblock";
        setTimeout(() => {
          this.$router.go(-1);
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.detail {
  // & > div {
  //   padding: 20px;
  // }
  .header {
    background: #f8dd9d;
    padding: 20px;
    img {
      width: 98px;
      height: 35px;
    }
    & > .top {
      display: flex;
      justify-content: space-between;
      & > div:nth-child(1) {
        width: 55px;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        background-color: rgba(16, 16, 16, 100);
        color: rgba(247, 247, 247, 100);
        font-size: 13px;
        text-align: center;
      }
      & > div:nth-child(2) {
        position: relative;
        img {
          width: 20px;
          height: 20px;
        }
        .box {
          bottom: -10px;
          right: -11px;
          transform: translateY(100%);
          position: absolute;
          background: #404040;
          padding: 5px 10px;
          color: rgba(244, 244, 244, 100);
          font-size: 13px;
          width: 75px;
          border-radius: 8px;
          li {
            list-style: none;
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(94, 94, 94, 100);
          }
          li:last-child {
            border: 0;
          }
        }

        .triangle {
          position: absolute;
          bottom: -10px;
          right: 0;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid #404040;
        }
      }
    }
    & > .bottom {
      width: 275px;
      height: 128px;
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 100);
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px 30px;
      & > .tit {
        color: rgba(16, 16, 16, 0.5);
        font-size: 14px;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        img{
          height:20px;
          width: 20px;
          border-radius: 50%;
          margin:0 5px;
        }
      }
      & > .content {
        flex: 1;
        color: rgba(61, 61, 61, 1);
        font-size: 15px;
      }
    }
  }
  & > .userInfo {
    padding: 20px 20px 0;
    font-size: 14px;
    display: flex;
    align-items: center;
    .avatar {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 8px;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  & > .container {
    padding: 20px;
    font-size: 15px;

    & > div:nth-child(1) {
      background-color: rgba(250, 250, 251, 100);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 10px;
      textarea {
        width: 100%;
        height: 150px;
        line-height: 20px;
        border: 0;
        font-size: 15px;
        background-color: rgba(250, 250, 251, 100);
      }
    }
    & > .commit {
      width: 335px;
      height: 44px;
      line-height: 40px;
      border-radius: 5px;
      background-color: rgba(16, 16, 16, 100);
      color: rgba(255, 255, 255, 100);
      font-size: 14px;
      text-align: center;
    }
    & > .time {
      color: rgba(16, 16, 16, 0.35);
      font-size: 12px;
      margin-top: 10px;
      text-align: right;
    }
  }
  & > .shareContainer {
    padding: 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    & > div {
      width: 160px;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      text-align: center;
      border-radius: 25px;
    }
    & > div:nth-child(1) {
      background-color: rgba(249, 213, 126, 100);
      color: rgba(16, 16, 16, 100);
    }
    & > div:nth-child(2) {
      background-color: rgba(16, 16, 16, 100);
      color: rgba(255, 255, 255, 100);
    }
  }
  & .replayDialog {
    & > .content {
      & > div:nth-child(1) {
        font-size: 14px;
        & > div:nth-child(2) {
          font-weight: bolder;
          margin-top: 10px;
        }
      }
      & > div:nth-child(2) {
        display: flex;
        & > div:nth-child(1) {
          background-color: rgba(221, 221, 221, 100);
          color: rgba(16, 16, 16, 100);
        }
        div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 14px;
          border-radius: 5px;
          margin: 0 5px;
        }
      }
    }
  }

  & .delDialog {
    & > .content {
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 16px;
        font-weight: bolder;
      }
      & > div:nth-child(2) {
        display: flex;
        div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 14px;
          border-radius: 5px;
          margin: 0 5px;
        }
        & > div:nth-child(1) {
          background-color: rgba(221, 221, 221, 100);
          color: rgba(16, 16, 16, 100);
        }
      }
    }
  }

  & .blockDialog {
    & > .content {
      & > div:nth-child(1) {
        font-size: 14px;
        & > div:nth-child(1) {
          font-weight: bolder;
          margin-bottom: 10px;
        }
      }
      & > div:nth-child(2) {
        display: flex;
        & > div:nth-child(1) {
          background-color: rgba(221, 221, 221, 100);
          color: rgba(16, 16, 16, 100);
        }
        div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 14px;
          border-radius: 5px;
          margin: 0 5px;
        }
      }
    }
  }

  & .isblockDialog {
    & > .content {
      & > div:nth-child(1) {
        span {
          display: block;
        }
        & > span:nth-child(1) {
          color: rgba(16, 16, 16, 100);
          font-size: 16px;
          margin-bottom: 20px;
          font-weight: bolder;
        }
        & > span:nth-child(2) {
          color: rgba(16, 16, 16, 50);
          font-size: 13px;
          opacity: 0.5;
        }
      }
      & > div:nth-child(2) {
        width: 145px;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        background-color: rgba(16, 16, 16, 100);
        color: rgba(255, 255, 255, 100);
        font-size: 14px;
      }
    }
  }

  & > .dialog {
    position: fixed !important;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: 0 !important;
    & > .dialog_bg {
      background: black !important;
      height: 100%;
      width: 100%;
      opacity: 0.6 !important;
    }
    & > .content {
      margin: 0 !important;
      z-index: 999 !important;
      background: white;
      opacity: 1 !important;
      width: 285px;
      height: 220px;
      border-radius: 8px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>