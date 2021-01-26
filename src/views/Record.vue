<template>
  <div class="record_container">
    <div class="header">
      <div @click="$router.go(-1)">{{ gobacktext }}</div>
      <div><img src="@/assets/v2_qkcdhx.png" />谁看过我</div>
      <div>包含仅访问未留言的好友</div>
    </div>
    <div class="recordList" v-show="userInfo.nickName">
      <div class="record_iem" v-for="(item, index) in list" :key="index">
        <div><img :class="userInfo.is_lock ? 'isLock':''" :src="item.avatarUrl" /></div>
        <div>{{ userInfo.is_lock ? "解锁后可查看" : item.nickName }}</div>
        <div>访问{{ item.watch_time }}次</div>
      </div>
    </div>

    <div class="footer" v-show="userInfo.nickName">
      <div v-show="userInfo.is_lock" @click="showDialog = 'pay'">解锁查看</div>
    </div>

    <div class="dialog" @click="showDialog = ''" v-show="showDialog === 'pay'">
      <div class="content" @click.stop="">
        <div>谁看过我</div>
        <div class="operation_container">
          <div @click="pay({ fee: 200, body: 'once' })">
            <div><img src="@/assets/v2_qkccl0 .png" />偷看一次</div>
            <div>￥<span>2</span></div>
          </div>
          <div @click="pay({ fee: 1500, body: 'vip' })">
            <div><img src="@/assets/v2_qkccl8.png" />永久解锁</div>
            <div>￥<span>15</span><del>￥30</del></div>
          </div>
        </div>
        <div class="tips">
          Tips：包含所有访问/查看您提问箱的用户(可能包含非好友)及访问次数，不对应提问者和提问内容。
        </div>
        <div @click="$router.push('/feedback')">支付后无法进入？</div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import {
  queryVisitor,
  getConfig,
  reduceUnlockNumber,
  getUser,
  updateUnlockStatus,
  createPay,
} from "@/api/api";
export default {
  name: "record",
  data() {
    return {
      gobacktext: "<返回",
      list: [],
      showDialog: "",
      userInfo:{
        is_lock:true
      }
    };
  },
  async created() {
    await this.getList();
    await this.getUserInfo();
    
    this.getWxConfig();

  },
  methods: {
    async getUserInfo() {
      const res = await getUser(localStorage.getItem("question_session"));
      this.userInfo = res.data;
      this.introduce = res.data.introduce;
    },

    async getList() {
      let session = localStorage.getItem("question_session");
      const res = await queryVisitor({ session: session, page_index: 0 });
      this.list = res.data.list;
      console.log(res);
    },

    //获取微信config配置
    getWxConfig() {
      let that = this;
      // let url = encodeURIComponent(window.location.href);
      let data = {
        wechaturl: window.location.href,
        session: localStorage.getItem("question_session"),
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
          console.log("成功隐藏");
          wx.hideMenuItems({
            menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          });
          // wx.updateTimelineShareData({
          //   title: "分享", // 分享标题
          //   link:
          //     "http://anonymous.lodidc.cn/niming_question/QuestionBox?id=" +
          //     localStorage.getItem("uid"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //   imgUrl:
          //     "http://anonymous.lodidc.cn/question_static/data/image/moren.jpg", // 分享图标
          //   success: function () {
          //     console.log("设置成功");
          //     // 设置成功
          //   },
          // });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
        });
        wx.error(function (res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        });
      });
    },

    //生成支付订单，调起微信支付
    async pay(data) {
      let that = this;
      let parama = {
        session: localStorage.getItem("question_session"),
        total_fee: data.fee,
        body: data.body,
      };
      const result = await createPay(parama);
      if (result) {
        let wxpay = new Promise((resolve, reject) => {
          wx.chooseWXPay({
            appId: result.data.appId,
            timestamp: result.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: result.data.nonceStr, // 支付签名随机串，不长于 32 位
            package: result.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: result.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: result.data.paySign, // 支付签名
            success: function (res) {
              resolve("支付成功");
              // 支付成功后的回调函数
            },
          });
        });

        //重新请求get，刷新用户is_blok的状态
        wxpay.then(async () => {
          await updateUnlockStatus({
            trade_no: result.data.trade_no,
            flag: data.body,
            session: localStorage.getItem("question_session"),
          });
          that.showDialog = "";
          that.getUserInfo();
          reduceUnlockNumber(localStorage.getItem("question_session"));
          this.$Dialog
            .alert({
              title: "",
              message: "支付成功",
            })
            .then(() => {
              // on close
            });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
body,
html {
  background: white !important;
}
.record_container {
  .dialog {
    background: rgba(0, 0, 0, 0.65);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 35px;
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
    & > .content {
      background: white;
      border-radius: 10px;
      width: 100%;
      padding: 25px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 30px;
      }
      & > div:last-child {
        color: rgba(76, 134, 234, 100);
        font-size: 12px;
        margin-top: 20px;
      }
      & > .tips {
        color: rgba(0, 0, 0, 0.35);
      }
      & > .operation_container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        color: rgba(16, 16, 16, 100);
        & > div {
          width: 115px;
          height: 115px;
          border-radius: 8px;
          background-color: #ffedc2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          & > div:nth-child(1) {
            display: flex;
            align-items: center;
            img {
              width: 18px;
              height: 18px;
              margin-right: 3px;
            }
          }
          span {
            font-weight: bold;
            font-size: 20px;
          }
          del {
            opacity: 0.6;
          }
        }

        & > div:nth-child(2) {
          background-color: #f9d57e;
        }
      }
    }
  }
  & > .header {
    background: #f9d57e;
    // background: url("../assets/headerBg.jpg");
    width: 100%;
    padding: 20px;
    & > div:nth-child(1) {
      width: 55px;
      height: 30px;
      line-height: 30px;
      border-radius: 20px;
      background-color: rgba(16, 16, 16, 100);
      color: rgba(247, 247, 247, 100);
      text-align: center;
      margin-bottom: 25px;
    }
    & > div:nth-child(2) {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      img {
        width: 25px;
        height: 25px;
        margin-right: 4px;
      }
    }
    & > div:nth-child(3) {
      opacity: 0.6;
      font-size: 12px;
    }
  }
  & > .recordList {
    padding: 0 20px;
    & > .record_iem {
      height: 70px;
      display: flex;
      align-items: center;
      color: rgba(16, 16, 16, 100);
      border-bottom: 1px solid #f1f1f1;
      font-size: 15px;
      & > div:first-child {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background: black;
        margin-right: 10px;
        overflow: hidden;
        img {
          // filter:grayscale(80%);
          // filter:blur(8px);
          height: 100%;
          width: 100%;
        }
        .isLock{
          filter: grayscale(100%) blur(7px);
        }
      }
      & > div:nth-child(2) {
        flex: 1;
      }
      & > div:nth-child(3) {
        color: rgba(16, 16, 16, 0.35);
        font-size: 14px;
      }
    }
  }

  & > .footer {
    background: white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px 20px;
    & > div {
      height: 50px;
      line-height: 50px;
      border-radius: 50px;
      background-color: rgba(0, 0, 0, 1);
      color: rgba(249, 213, 126, 100);
      font-size: 15px;
      text-align: center;
    }
  }
}
</style>