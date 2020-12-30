<template>
  <div class="mine">
    <div
      class="header"
      :style="
        userInfo.photo + '' === ''
          ? `background: url('http://anonymous.lodidc.cn/question_static/data/image/moren.jpg')`
          : 'background:url(' + userInfo.photo + ')'
      "
    >
      <div>
        <div
          v-if="!$route.query.id || $route.query.id == localId"
          @click="$router.push('/')"
        >
          ＜首页
        </div>
      </div>

      <div class="userInfo">
        <div class="detail">
          <div><img :src="userInfo.avatarUrl" /></div>
          <div>{{ userInfo.nickName }}</div>
        </div>
        <div class="num">
          收到提问 {{ userInfo.question_num }} | 回答{{ answerList.length }}
        </div>
      </div>
    </div>

    <div class="content">
      <div class="autograph">
        <div>
          {{
            userInfo.introduce + "" === ""
              ? "这是一条系统赠送的签名"
              : userInfo.introduce
          }}
        </div>
      </div>

      <div
        class="btn_container"
        v-if="$route.query.id && $route.query.id !== localId"
      >
        <div @click="$router.push('/')">我也要玩</div>
        <div
          @click="
            $router.push({
              path: '/AskQuestion',
              query: { id: $route.query.id },
            })
          "
        >
          向Ta提问
        </div>
      </div>

      <div class="share_btn" @click="showTip = true" v-else>邀请好友提问</div>

      <div class="questionDetail">
        <div class="title">
          {{ userInfo.nickName }} 回答的问题 {{ answerList.length }}
        </div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-if="answerList.length > 0">
            <div class="item" v-for="(item, index) in answerList" :key="index">
              <div>匿名提问</div>
              <div>{{ item.text }}</div>
              <div><span>答</span>{{ item.answer }}</div>
            </div>
          </div>
          <img v-else src="@/assets/v2_qkcfa2.png" />
        </van-list>
      </div>
    </div>

    <div class="footer">
      <div><img src="@/assets/201215165630.png" /> 更多好玩</div>
      <div>
        <span>朋友默契测试</span>
        <span>朋友圈红包</span>
        <span>匿名提问箱</span>
      </div>
    </div>

    <div class="dialog" v-show="showTip" @click="showTip = false">
      <div><img src="@/assets/v2_qkci10.png" /></div>
      <div>点击右上角，分享到朋友圈 <br />就可以接受好友向您提问啦</div>
      <div class="topright"><img src="@/assets/v2_qkci9d.png" /></div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { getBox, getConfig, login, registerVisitor } from "@/api/api";
import { getUrlCode } from "@/utils/index.js";
export default {
  data() {
    return {
      isSelf: false,
      answerList: [],
      userInfo: {},
      appId: "",
      showTip: false,
      finished: false,
      loading: false,
      page_index: 0,
      localId: "",
    };
  },

  async mounted() {
    let code = getUrlCode().code; //返回url中的code
    //localstorage中也没有session 首次进入
    if (
      !localStorage.getItem("question_session") ||
      localStorage.getItem("question_session") === undefined
    ) {
      //已经通过非静默授权重定向过来
      if (code) {
        login(code).then(async (result) => {
          //设置uid和session到localstorage并用返回到的session继续请求
          localStorage.setItem("question_session", result.data.session);
          localStorage.setItem("question_uid", result.data.uid);
          localStorage.setItem("first_login", result.data.first_login);
          await this.getAnswerList(result.data.session);
          this.getWxConfig(result.data.session);
        });
        return; //return掉 不再走授权
      }
      //非静默授权
      var url = encodeURIComponent(window.location.href);
      var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd817698fa2b73670&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = getCodeUrl;
    } else {
      // 已经有session,用localstorage的session来请求 别的业务逻辑
      this.localId = localStorage.getItem("question_uid");

      await this.getAnswerList(localStorage.getItem("question_session"));
      this.getWxConfig(localStorage.getItem("question_session"));
    }
  },

  async created() {
    let data = {
      visitor_uid: this.$route.query.id,
      session: localStorage.getItem('question_session'),
    };
    await registerVisitor(data);
  },

  methods: {
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
          console.log("成功");
          wx.hideMenuItems({
            menuList: ["menuItem:share:appMessage"], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          });
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

    async getAnswerList(session) {
      let queryId = this.$route.query.id;
      let data = {
        session: session,
        uid: queryId ? queryId : localStorage.getItem("question_uid"), // 回答的问题请求用带的Id,如果不是用自己的id
        page_index: this.page_index,
      };
      const res = await getBox(data);
      if (res.data.nickName) {
        this.userInfo = {
          introduce: res.data.introduce,
          nickName: res.data.nickName,
          question_num: res.data.question_num,
          photo: res.data.photo,
          avatarUrl: res.data.avatarUrl,
        };
      }
      if (res.data.list.length <= 0) {
        this.finished = true;
      }
      this.answerList = res.data.list;
    },

    // van-list的上拉加载
    async onLoad() {
      if (!localStorage.getItem("question_session")) return; //如果localstroage中没有session,return,避免出现session undefined
      let queryId = this.$route.query.id;
      let data = {
        session: localStorage.getItem("question_session"),
        uid: queryId ? queryId : localStorage.getItem("question_uid"), // 回答的问题请求用带的Id,如果不是用自己的id
        page_index: this.page_index + 1,
      };
      const res = await getBox(data);
      if (res.data.nickName) {
        this.userInfo = {
          introduce: res.data.introduce,
          nickName: res.data.nickName,
          question_num: res.data.question_num,
          photo: res.data.photo,
          avatarUrl: res.data.avatarUrl,
        };
      }
      this.page_index = this.page_index + 1;
      this.loading = false;
      if (res.data.list.length <= 0) {
        this.finished = true;
      } else {
        //如果下一页有长度，push到数组
        this.answerList = this.answerList.push(...res.data.list);
      }
    },

    getUrlCode() {
      // 截取url中的code方法
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
  },
};
</script>

<style lang="less" scoped>
.mine {
  .dialog {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    font-size: 15px;
    z-index: 999;
    & > div:nth-child(1) {
      border-radius: 8px;
      width: 75px;
      height: 75px;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      img {
        width: 35px;
        height: 35px;
      }
    }
    & > .topright {
      position: absolute;
      top: 15px;
      right: 15px;
      img {
        height: 50px;
        width: 50px;
      }
    }
  }
  .header {
    height: 200px;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    padding: 20px 20px 0;
    position: relative;
    & > div:nth-child(1) {
      display: flex;
      font-size: 13px;
      justify-content: space-between;
      & > div:nth-child(1) {
        width: 65px;
        height: 30px;
        line-height: 30px;
        border-radius: 20px;
        background-color: rgba(16, 16, 16, 100);
        color: rgba(247, 247, 247, 100);
        text-align: center;
      }
    }
    .userInfo {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      transform: translateY(20px);
      .detail {
        display: flex;
        & > div:nth-child(1) {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          margin-right: 15px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        & > div:nth-child(2) {
          color: rgba(16, 16, 16, 100);
          font-size: 18px;
          font-weight: bold;
          margin-top: 14px;
        }
      }
      .num {
        margin-top: 15px;
        color: rgba(16, 16, 16, 0.5);
        font-size: 13px;
      }
    }
  }
  .content {
    .autograph {
      margin: 0 20px;

      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
      img {
        height: 20px;
        width: 20px;
      }
    }
    .btn_container {
      padding: 25px 0 30px;
      display: flex;
      justify-content: center;
      & > div {
        font-size: 15px;
        width: 160px;
        height: 55px;
        text-align: center;
        line-height: 55px;
        border-radius: 100px;
        margin: 0 15px;
      }
      & > div:nth-child(1) {
        background-color: rgba(16, 16, 16, 100);
        color: rgba(255, 255, 255, 100);
      }
      & > div:nth-child(2) {
        background-color: rgba(249, 213, 126, 100);
        color: rgba(16, 16, 16, 100);
      }
    }
    .share_btn {
      width: 335px;
      height: 80px;
      line-height: 80px;
      border-radius: 8px;
      background-color: rgba(249, 213, 126, 100);
      color: rgba(16, 16, 16, 100);
      font-size: 15px;
      text-align: center;
      margin: 25px auto 30px;
      font-weight: bold;
    }
    .questionDetail {
      background: #f7f7f7;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 25px 0 100px;
      img {
        height: 115px;
        width: 115px;
      }
      .title {
        margin-bottom: 20px;
        color: rgba(16, 16, 16, 100);
        font-size: 15px;
        font-weight: bold;
      }
      .item {
        background: white;
        width: 305px;
        // height: 152px;
        border-radius: 6px;
        padding: 15px 20px 20px;
        margin-bottom: 15px;
        & > div:nth-child(1) {
          color: rgba(16, 16, 16, 0.35);
          font-size: 14px;
          margin-bottom: 20px;
        }
        & > div:nth-child(2) {
          color: rgba(16, 16, 16, 100);
          font-size: 15px;
          margin-bottom: 15px;
          display: -webkit-box;
          word-break: break-all;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        & > div:nth-child(3) {
          border-top: 1px solid rgba(244, 245, 245, 100);
          color: rgba(16, 16, 16, 100);
          font-size: 14px;
          padding-top: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          & > span {
            padding: 4px;
            border-radius: 3px;
            background-color: rgba(249, 213, 126, 100);
            color: rgba(16, 16, 16, 100);
            font-size: 12px;
            text-align: center;
            margin-right: 8px;
          }
        }
      }
    }
  }
  & > .footer {
    padding: 15px;
    display: flex;
    align-items: center;
    font-size: 13px;
    border-top: 1px dashed rgba(16, 16, 16, 0.15);
    & > div:nth-child(1) {
      display: flex;
      align-items: center;
      margin-right: 35px;
      img {
        height: 16px;
        width: 16px;
        margin-right: 5px;
      }
    }
    & > div:nth-child(2) {
      flex: 1;
      display: flex;
      justify-content: space-between;
      color: #4c78d5;
    }
  }
}
</style>