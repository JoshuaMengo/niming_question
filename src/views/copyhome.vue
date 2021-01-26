<template>
  <div class="home" @click.stop="showDialog = true">
    <!-- 头部分享，tabbar -->
    <div class="header">
      <div class="top">
        <div><img src="@/assets/v2_qkaufe.png" /></div>
        <div>
          <div>
            我的
            <!-- <div class="avatarBox">
              <img :src="userInfo ? userInfo.avatarUrl : ''" />
            </div> -->
          </div>
        </div>
      </div>
      <div class="tabbar">
        <div
          v-for="(item, index) in tabbarList"
          :key="index"
          :class="
            $store.state.activeTabbarIndex === index ? 'activeTabbar' : ''
          "
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="container" v-if="list.length > 0">
      <!-- <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      > -->
      <div class="item" v-for="(item, index) in list" :key="index">
        <div
          class="red"
          v-show="
            ($store.state.activeTabbarIndex === 0 && !item.from_have_read) ||
            ($store.state.activeTabbarIndex === 2 && !item.to_have_read)
          "
        ></div>
        <div
          class="title"
          v-if="
            $store.state.activeTabbarIndex === 2 ||
            $store.state.activeTabbarIndex === 3
          "
        >
          <span>向</span>
          <img :src="item.user ? item.user.avatarUrl : ''" />
          <span
            >{{ item.user ? item.user.nickName : ""
            }}{{ item.is_open ? "" : "匿名" }}提问</span
          >
        </div>
        <div class="title" v-else>
          {{ item.user ? item.user.nickName : "匿名" }}提问
        </div>

        <div class="content">{{ item.text }}</div>
        <!-- <div class="status">未回答</div> -->
        <div class="status" v-if="$store.state.activeTabbarIndex === 0">
          <div class="haveAnswer" v-if="item.have_answer">
            <span>答</span>{{ item.answer }}
          </div>
          <div v-else class="noAnswer">
            <div>未回答</div>
            <div>去回答</div>
          </div>
        </div>

        <div class="status" v-if="$store.state.activeTabbarIndex === 1">
          <div class="haveAnswer"><span>答</span>{{ item.answer }}</div>
        </div>

        <div class="status" v-if="$store.state.activeTabbarIndex === 2">
          <div class="haveAnswer" v-if="item.have_answer">
            <span>答</span>{{ item.answer ? item.answer : "" }}
          </div>
          <div class="noAnswer" v-else>
            <div>未收到回答</div>
          </div>
        </div>

        <div class="status" v-if="$store.state.activeTabbarIndex === 3">
          <div class="haveAnswer"><span>答</span>{{ item.answer }}</div>
        </div>
      </div>
      <!-- </van-list> -->
    </div>

    <div class="nothing" v-else>
      <img src="@/assets/v2_qkcfa2.png" />
    </div>

    <!-- 底部分享按钮 -->
    <div class="footerBtn">
      <div :class="closeShare ? 'closeShare' : ''" @click="showDialog = 'code'">
        <img @click.stop="closeShare = false" src="@/assets/v2_qkceif.png" />
        <div
          :style="
            closeShare
              ? 'width:0;opacity: 0;'
              : 'opacity:1;transition: all .6s;'
          "
          class="text"
        >
          <p>邀请好友提问</p>
        </div>
        <div
          v-show="!closeShare"
          @click.stop="closeShare = !closeShare"
          class="right"
        >
          <img src="@/assets/v2_qkchd3.png" />
        </div>
      </div>
    </div>

    <div
      class="dialog codeDialog"
      @click="showDialog = ''"
      v-show="showDialog === 'code'"
    >
      <div class="code" @click.stop="">
        <img src="@/assets/v2_qmescr.jpg" />
      </div>
      <div>长按关注即可开启通知<br />若已关注无须重复操作</div>
    </div>

    <!-- <div class="dialog" v-show="showDialog == 'tip'" @click="showTip = ''">
      <div><img src="@/assets/v2_qkci10.png" /></div>
      <div>点击右上角，分享到朋友圈 <br />就可以接受好友向您提问啦</div>
      <div class="topright"><img src="@/assets/v2_qkci9d.png" /></div>
    </div> -->

    <!-- 分享提示弹唱 -->
    <div class="shareTips_Dialog"></div>

    <!-- 入场加载动画 -->
    <!-- <div class="loading" v-show="$store.state.showLoading">
      <div>
        <img src="@/assets/v2_qkyqr7.gif" />
      </div>
      <div>
        <img src="@/assets/v2_qkaufe.png" />
      </div>
    </div> -->

    <div class="dialog" @click.stop="showDialog = false" v-show="showDialog">
      <div class="content" @click.stop="">
        <div>请在微信中打开</div>
        <div class="item">
          <div class="title">方式一 <br />保存下方二维码，扫码进入</div>
          <img src="@/assets/v2_qmi97e.png" />
        </div>
        <div class="item">
          <div class="title">方式二 <br />保存下方二维码，扫码进入</div>
          <div class="link">
            <span ref="copyContainer"
              >http://anonymous.taodaibuy.com/niming_question</span
            >
          </div>
          <div
            @click="onCopy"
            style="color: #3e7dff; font-size: 14px; text-align: center"
          >
            一键复制
          </div>
        </div>

        <div class="item">
          <div class="title">方式三 <br />搜索公众号“朋友提问箱Pro”获取入口</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import wx from "weixin-js-sdk";
import { getUrlCode } from "@/utils/index.js";
import {
  getReceiveQuestion,
  querySendAnswer,
  querySendQuestion,
  queryReceiveAnswer,
  getConfig,
  login,
  getUser,
} from "@/api/api";

export default {
  name: "Home",
  data() {
    return {
      firstloading: true,
      tabbarList: [
        { name: "收到的提问", type: "recevieQ" },
        { name: "我的回答", type: "sendA" },
        { name: "我的提问", type: "sendQ" },
        { name: "收到的回答", type: "recevieA" },
      ],
      activeTabbarIndex: 0,
      list: [
        {
          text: "假设你有3次实现新年愿望的机会，你会用来实现什么愿望？",
          user: {
            nickName: "官方",
          },
        },
      ],
      closeShare: false,
      tabbarType: "recevieQ",
      loading: false,
      finished: false,
      page_index: 0,
      // showDialog: "",
      showDialog: false,
    };
  },

  // async mounted() {
  //   //获取路由中的code
  //   //如果没有路由中没有code，localstorage中也没有session，就进行非静默授权，在路由拦截进行请求
  //   // let session = localStorage.getItem("question_session");
  //   let that = this;
  //   let code = that.getUrlCode().code;
  //   if (
  //     !localStorage.getItem("question_session") ||
  //     localStorage.getItem("question_session") === undefined
  //   ) {
  //     //已经通过非静默授权重定向过来
  //     if (code) {
  //       login(code).then(async (result) => {
  //         //设置uid和session到localstorage并用返回到的session继续请求
  //         localStorage.setItem("question_session", result.data.session);
  //         localStorage.setItem("question_uid", result.data.uid);
  //         localStorage.setItem("first_login", result.data.first_login);
  //         if (that.$store.state.showLoading) {
  //           setTimeout(() => {
  //             that.getDataList(
  //               that.tabbarList[that.$store.state.activeTabbarIndex].type,
  //               result.data.session
  //             );
  //             that.$store.commit("changeShowLoading");
  //           }, 1000);
  //         } else {
  //           that.getDataList(
  //             that.tabbarList[that.$store.state.activeTabbarIndex].type,
  //             result.data.session
  //           );
  //         }
  //         await that.getUserInfo(result.data.session);

  //         that.getWxConfig(result.data.session);
  //       });
  //       return; //return掉 不再走授权
  //     }
  //     //非静默授权
  //     var url = encodeURIComponent(window.location.href);
  //     var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd817698fa2b73670&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  //     window.location.href = getCodeUrl;
  //   } else {
  //     // 别的业务逻辑
  //     if (that.$store.state.showLoading) {
  //       setTimeout(() => {
  //         that.getDataList(
  //           that.tabbarList[that.$store.state.activeTabbarIndex].type,
  //           localStorage.getItem("question_session")
  //         );
  //         that.$store.commit("changeShowLoading");
  //       }, 1000);
  //     } else {
  //       that.getDataList(
  //         that.tabbarList[that.$store.state.activeTabbarIndex].type,
  //         localStorage.getItem("question_session")
  //       );
  //     }
  //     await that.getUserInfo(localStorage.getItem("question_session"));
  //     that.getWxConfig(localStorage.getItem("question_session"));
  //   }
  // },

  async created() {
    //根据store的状态判断是否第一次进入，首次进入显示入场动画
  },

  methods: {
    onCopy() {
      let container = this.$refs.copyContainer;
      this.$copyText(
        "http://anonymous.taodaibuy.com/niming_question",
        container
      );
      this.$Notify({ type: "success", message: "复制成功" });
    },
    async getUserInfo(session) {
      const res = await getUser(session);
      this.userInfo = res.data;
    },

    //获取微信config配置
    getWxConfig(session) {
      let that = this;
      // let url = encodeURIComponent(window.location.href);
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
            menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
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

    changeIndex(index, item) {
      this.page_index = 0;
      (this.loading = false),
        (this.finished = false),
        this.$store.commit("changeTabbarIndex", index);
      this.getDataList(item.type, localStorage.getItem("question_session"));
    },

    async getDataList(type, session) {
      let res;
      let data = {
        session: session,
        page_index: 0,
      };
      this.tabbarType = type;
      switch (type) {
        case "recevieQ":
          res = await getReceiveQuestion(data);
          break;
        case "sendA":
          res = await querySendAnswer(data);
          break;
        case "sendQ":
          res = await querySendQuestion(data);
          break;
        case "recevieA":
          res = await queryReceiveAnswer(data);
          break;
      }
      // this.loading = false
      this.list = res.data.list;
      console.log(this.list);
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

    // van-list的上拉加载
    // async onLoad() {
    //   let res;
    //   let data = {
    //     session: localStorage.getItem("question_session"),
    //     page_index: this.page_index + 1,
    //   };
    //   switch (this.tabbarList[this.$store.state.activeTabbarIndex].type) {
    //     case "recevieQ":
    //       res = await getReceiveQuestion(data);
    //       break;
    //     case "sendA":
    //       res = await querySendAnswer(data);
    //       break;
    //     case "sendQ":
    //       res = await querySendQuestion(data);
    //       break;
    //     case "recevieA":
    //       res = await queryReceiveAnswer(data);
    //       break;
    //   }
    //   this.page_index = this.page_index + 1;
    //   this.loading = false;
    //   if (res.data.list.length <= 0) {
    //     this.finished = true;
    //   } else {
    //     this.list.push(...res.data.list);
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
.home {
  background: #f7f7f7;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .codeDialog {
    display: flex;
    flex-direction: column;
    color:white & > .code {
      height: 175px;
      width: 175px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
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
    & > .code {
      height: 175px;
      width: 175px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      color: black;
      background: white;
      width: 305px;
      height: 511px;
      border-radius: 10px;
      & > div:nth-child(1) {
        font-size: 15px;
        font-weight: bold;
        height: 66px;
        line-height: 66px;
        text-align: center;
        border-bottom: 1px solid rgba(244, 245, 245, 100);
      }
      & > .item {
        margin-top: 20px;
        line-height: 22px;
        & .title {
          font-size: 14px;
          text-align: center;
          margin-bottom: 15px;
        }
        & .link {
          padding: 10px;
          width: 235px;
          background: #f4f5f5;
          word-break: break-all;
          color: #3e7dff;
          border-radius: 5px;
          margin: 0 auto 5px;
          overflow: hidden;
          font-size: 12px;
        }
        & img {
          display: block;
          margin: 0 auto;
          height: 105px;
          width: 105px;
        }
      }
    }
  }
  .header {
    background: white;
    .top {
      display: flex;
      justify-content: space-between;
      padding: 25px 20px 30px;
      align-items: center;
      & > div:nth-child(1) {
        img {
          width: 98px;
          height: 35px;
        }
      }
      & > div:nth-child(2) {
        div {
          display: flex;
          align-items: center;
        }
      }
      .avatarBox {
        height: 30px;
        width: 30px;
        overflow: hidden;
        border-radius: 50%;
        margin-left: 5px;
        img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .tabbar {
      display: flex;
      justify-content: space-around;
      & > div {
        width: 75px;
        padding: 7px 0;
        text-align: center;
        font-size: 14px;
      }
      & > .activeTabbar {
        border-bottom: 2px solid #f9d57e;
        font-weight: bolder;
      }
    }
  }
  .nothing {
    height: 115px;
    width: 115px;
    margin: 96px auto 0;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .container {
    flex: 1;
    padding: 25px 15px 100px;
    overflow: auto;
    & .item {
      border-radius: 3px;
      background: white;
      padding: 15px 20px;
      margin-bottom: 15px;
      position: relative;
      & > .red {
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background: red;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
      }
      & > .title {
        color: rgba(16, 16, 16, 0.35);
        font-size: 14px;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin: 0 5px;
        }
      }
      & > .content {
        color: rgba(16, 16, 16, 100);
        font-size: 15px;
        margin: 10px 0 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      & > .status {
        border-top: 1px solid rgba(244, 245, 245, 100);
        color: rgba(16, 16, 16, 0.35);
        font-size: 14px;
        padding-top: 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        & > .haveAnswer {
          span {
            border-radius: 3px;
            padding: 4px;
            background-color: rgba(249, 213, 126, 100);
            color: rgba(16, 16, 16, 100);
            font-size: 12px;
            margin-right: 8px;
          }
        }
        & > .noAnswer {
          display: flex;
          justify-content: space-between;
          & > div:nth-child(2) {
            width: 60px;
            height: 26px;
            line-height: 26px;
            border-radius: 20px;
            background-color: rgba(16, 16, 16, 100);
            color: rgba(255, 255, 255, 100);
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
  }

  & > .footerBtn {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 0 15px 15px;
    // background: white;

    z-index: 99;
    & > div {
      width: 345px;
      background-color: rgba(249, 213, 126, 100);
      height: 50px;
      text-align: center;
      border-radius: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      transition: all 0.6s;
      position: relative;
      & > img {
        height: 20px;
        width: 20px;
      }
      & > .text {
        margin-left: 5px;
        overflow: hidden;
      }
      & > .right {
        position: absolute;
        right: 10px;
        top: 50%;
        height: 25px;
        width: 25px;
        opacity: 1;
        transform: translateY(-50%);
        & > img {
          height: 100%;
          width: 100%;
        }
      }
    }
    & > .closeShare {
      width: 50px !important;
    }
  }

  .loading {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: white;
    & > div:nth-child(1) {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8d47d;
      flex: 1;
      & > img {
        height: 135px;
        width: 135px;
      }
    }
    & > div:nth-child(2) {
      height: 16.5%;
      display: flex;
      align-items: center;
      justify-content: center;
      & > img {
        height: 35px;
        width: 98px;
      }
    }
  }
}
</style>
