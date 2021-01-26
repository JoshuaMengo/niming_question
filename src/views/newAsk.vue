<template>
  <div class="newAsk">
    <div class="header">
      <div>向 指定好友 提问</div>
      <div @click="$router.go(-1)">取消</div>
    </div>

    <input
      class="nickName"
      v-model="paramas.nickName"
      placeholder="好友的名字/昵称"
    />

    <textarea
      class="content"
      v-model="paramas.content"
      placeholder="输入提问内容..."
    />

    <input class="phone" v-model="paramas.phone" placeholder="好友的手机号码" />

    <div class="commit" @click="showDialog = true">发送提问</div>

    <div class="check">
      <van-checkbox
        checked-color="#000000"
        style="font-size: 14px"
        v-model="paramas.is_open"
        >匿名提问 (取消勾选则实名提问)</van-checkbox
      >
    </div>

    <div class="tips">
      尊重他人，礼貌提问<br />
      恶意提问会被封禁账号哦
    </div>

    <div class="dialog" v-show="showDialog" @click="showDialog = false">
      <div class="content" @click.stop="">
        <div>- 请支付 -</div>
        <div>2.00<span>元</span></div>
        <div @click="commit()">支付</div>
        <div>服务费及通讯费</div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessage, getConfig, createPay } from "@/api/api";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      paramas: {
        nickName: "",
        phone: "",
        content: "",
        is_open: true,
        session: localStorage.getItem("question_session"),
      },
      showDialog: false,
    };
  },

  created() {},
  methods: {
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
    async commit() {
      let that = this;
      let parama = {
        session: localStorage.getItem("question_session"),
        total_fee: 200,
        body: "send",
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
          sendMessage(this.paramas).then((res) => {
            that.showDialog = "";
            that.$Dialog
              .alert({
                title: "",
                message: "发送成功",
              })
              .then(() => {
                // on close
                that.$router.push('/')
              });
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.newAsk {
  padding: 20px;
  input {
    display: block;
    margin-bottom: 10px;
    padding: 0 15px;
    width: 305px;
    border-radius: 8px;
    font-size: 15px;
    border: 1px solid rgba(16, 16, 16, 0.1);
  }
  & > .nickName {
    height: 50px;
  }
  & > .content {
    height: 120px;
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgba(16, 16, 16, 0.1);
    padding: 15px;
    width: 305px;
    margin-bottom: 10px;
    font-size: 15px;
  }
  & > .phone {
    height: 50px;
  }
  & > .tips {
    text-align: center;
    line-height: 20px;
    color: rgba(16, 16, 16, 0.35);
    font-size: 13px;
  }
  & > .commit {
    width: 335px;
    height: 44px;
    line-height: 44px;
    border-radius: 5px;
    background-color: rgba(249, 213, 126, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    margin-bottom: 20px;
    text-align: center;
  }
  & > .check {
    margin-bottom: 95px;
    font-size: 14px;
    color: rgba(16, 16, 16, 0.5);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > div:nth-child(1) {
      font-size: 16px;
      font-weight: bold;
    }
    & > div:nth-child(2) {
      width: 50px;
      height: 28px;
      background-color: rgba(221, 221, 221, 100);
      color: rgba(255, 255, 255, 100);
      font-size: 12px;
      border-radius: 20px;
      text-align: center;
      line-height: 28px;
    }
  }

  & > .dialog {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    & > .content {
      background: white;
      width: 275px;
      height: 260px;
      border-radius: 10px;
      text-align: center;

      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 0.5);
        font-size: 14px;
        margin: 25px 0 40px;
      }
      & > div:nth-child(2) {
        font-size: 30px;
        margin: 25px 0 40px;
        color: rgba(16, 16, 16, 1);
        span {
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
          margin-left: 5px;
        }
      }

      & > div:nth-child(3) {
        width: 195px;
        height: 45px;
        line-height: 45px;
        border-radius: 150px;
        background-color: rgba(16, 16, 16, 100);
        color: rgba(249, 213, 126, 100);
        font-size: 15px;
        margin: 0 auto 10px;
      }
      & > div:nth-child(4) {
        color: rgba(16, 16, 16, 0.35);
        font-size: 12px;
      }
    }
  }
}
</style>