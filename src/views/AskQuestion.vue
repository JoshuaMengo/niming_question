<template>
  <div class="askQuestion">
    <div class="header">
      <div>向{{ userInfo.nickName }} 提问</div>
      <div @click="$router.go(-1)">取消</div>
    </div>

    <div class="content" v-if="!islock">
      <div style="padding: 20px">
        <textarea v-model="content" />
      </div>
      <div class="commit" @click="commitAsk()">发送提问</div>
      <van-checkbox
        checked-color="#000000"
        style="font-size: 14px"
        v-model="is_open"
        >匿名提问 (取消勾选则实名提问)</van-checkbox
      >
      <div class="tips">尊重他人，礼貌提问<br />恶意提问会被封禁账号哦</div>
    </div>

    <div class="islock" v-else>
      <img src="@/assets/v2_qkcgfh.png" />
      <div>抱歉，对方拒绝接受您的提问</div>
    </div>

    <div
      class="dialog"
      v-show="showDialog"
      @click="(showDialog = false), $router.go(-1)"
    >
      <img src="@/assets/v2_qlcewq.png" />
      <div style="margin-bottom: 65px">发送成功</div>
      <div @click.stop="">
        <wx-open-launch-weapp
          id="launch-btn"
          username="gh_a890d79ff3bc"
          path="pages/web_view/web_view.html?url=https://mp.weixin.qq.com/s/EGCpNvSMU8rEpO3OW6raew"
        >
          <script type="text/wxtag-template">
            <style>
             .btn {
                border:0;
                font-size: 14px;
                width: 130px;
                height: 38px;
                line-height: 38px;
                border-radius: 25px;
                background:#FFFFFF;
                color: rgba(16, 16, 16, 100);
             }
             
            </style>
            <button class="btn">ta回答时通知我</button>
          </script>
        </wx-open-launch-weapp>
      </div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { postAsk, judgeBlock, getUserDetail, getConfig } from "@/api/api";
export default {
  name: "askQuestion",
  data() {
    return {
      islock: false,
      content: "",
      is_open: true,
      userInfo: {},
      showDialog: false,
    };
  },

  async created() {
    let data = {
      session: localStorage.getItem("question_session"),
      uid: this.$route.query.id,
    };
    const res = await judgeBlock(data);
    this.islock = res.data.is_block;
    this.getUseInfo();
    this.getWxConfig();
  },

  methods: {
    async getUseInfo() {
      let data = {
        session: localStorage.getItem("question_session"),
        uid: this.$route.query.id,
      };
      const res = await getUserDetail(data);
      this.userInfo = res.data;
    },

    //获取微信config配置
    getWxConfig() {
      let that = this;
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
            jsApiList: ["chooseWXPay"],
            openTagList: ["wx-open-launch-weapp"],
          });
        wx.ready(function () {
          console.log("成功");

          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
        });
        wx.error(function (res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        });
      });
    },

    async commitAsk() {
      if (this.content + "" === "") {
        this.$Notify({ type: "warning", message: "请输入提问内容" });
      } else {
        let data = {
          content: this.content,
          to_uid: this.$route.query.id,
          session: localStorage.getItem("question_session"),
          is_open: this.is_open,
        };
        const res = await postAsk(data);
        if (res.err_code === 0) {
          this.showDialog = true;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.askQuestion {
  padding: 20px;
  .dialog {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: rgba(249, 213, 126, 100);
    font-size: 13px;
    img {
      height: 65px;
      width: 65px;
      margin-bottom: 10px;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > div:nth-child(1) {
      color: rgba(16, 16, 16, 100);
      font-size: 16px;
      font-weight: bold;
    }
    & > div:nth-child(2) {
      width: 50px;
      height: 28px;
      line-height: 28px;
      border-radius: 20px;
      background-color: rgba(221, 221, 221, 100);
      color: rgba(255, 255, 255, 100);
      text-align: center;
    }
  }
  .content {
    & > div:nth-child(1) {
      border: 1px solid rgba(16, 16, 16, 0.15) !important;
      border-radius: 8px;
      margin: 20px 0 10px;
      textarea {
        // width: 335px!important;
        border: 0;
        width: 100%;
        height: 110px !important;
        font-size: 15px;
      }
    }

    .commit {
      width: 335;
      height: 44px;
      line-height: 44px;
      border-radius: 5px;
      background-color: rgba(249, 213, 126, 100);
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
    .tips {
      margin: 155px auto;
      text-align: center;
      line-height: 25px;
      color: rgba(16, 16, 16, 0.35);
      font-size: 13px;
    }
  }
  .islock {
    margin: 0 auto;
    height: 175px;
    margin-top: 55px;
    text-align: center;
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    img {
      height: 100%;
      width: 175px;
    }
  }
}
</style>