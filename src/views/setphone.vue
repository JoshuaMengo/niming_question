<template>
  <div class="setphone">
    <div class="header">
      <img src="@/assets/v2_qkaufe.png" />
    </div>
    <div class="content">
      <div>
        <img src="@/assets/v2_qmii08.png" />
      </div>
      <div>绑定手机号</div>
      <input
        class="phone"
        v-model="phone"
        placeholder="请输入收到短信的手机号"
      />

      <div class="code" v-show="!isSend">
        <input placeholder="输入图中数字" v-model="codeValue" />
      </div>

      <div class="phoneCode" v-show="isSend">
        <input placeholder="请输入验证码" v-model="phoneCode" />
        <div v-show="!sendAgain">{{ downNum }}s可重发</div>
        <div class="sendAgain" v-show="sendAgain" @click="send_again()">
          重发
        </div>
      </div>

      <div @click="changeCode()">
        <Sidentify
          v-show="identifyCode != null && !isSend"
          :identifyCode="identifyCode"
          @makedCode="getMakedCode"
        />
      </div>

      <div
        :class="
          phoneCode + '' !== '' || codeValue + '' !== ''
            ? 'bindbtn activebtn'
            : 'bindbtn'
        "
        @click="isSend ? bindPhone() : checkCode()"
      >
        {{ !isSend ? "获取验证码" : "绑定" }}
      </div>
      <div class="tips">一个ID只能绑定一个手机号，且无法修改哦</div>
    </div>
  </div>
</template>

<script>
import { createSnsCode } from "@/api/api";
import { getUrlCode } from "@/utils/index.js";
import Sidentify from "@/components/sidentify.vue";
import { checkPhone } from "@/utils/index";
import { login, updatePhone } from "@/api/api";
export default {
  components: {
    Sidentify,
  },
  data() {
    return {
      codeValue: "", //用户输入的验证码
      phone: "",
      isGetCode: false,
      // 验证码初始值
      identifyCode: "1234",
      // 验证码的随机取值范围
      identifyCodes: "1234567890",
      phoneCode: "",
      isSend: false,
      sendAgain: false,
      downNum: 15,
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
        });
        return; //return掉 不再走授权
      }
      //非静默授权
      var url = encodeURIComponent(window.location.href);
      var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfc6cc44785e79f4a&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = getCodeUrl;
    } else {
      // 已经有session,用localstorage的session来请求 别的业务逻辑
      this.localId = localStorage.getItem("question_uid");
    }

    // let data = this.$md5(this.passWord)
    // 刷新页面就生成随机验证码
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },

  methods: {
    //绑定手机号码
    bindPhone() {
      updatePhone({
        code: this.phoneCode,
        phone: this.phone,
        session: localStorage.getItem("question_session"),
      }).then((res) => {
        if (res.data.is_success) {
          this.$Notify({ type: "success", message: "绑定成功" });
          setTimeout(()=>{
            this.$router.push("/")
          },1000)
        } else {
          this.$Notify({ type: "warning", message: "绑定失败，请确认手机号和验证码" });
        }
      });
    },

    checkCode() {
      let that = this;
      if (checkPhone(that.phone) === false) return;
      if (that.identifyCode == that.codeValue) {
        //调用发送验证码
        that.isSend = true;
        that.send();
        let inteval = setInterval(() => {
          if (that.downNum === 0) {
            clearInterval(inteval);
            that.sendAgain = true;
            that.downNum = 15;
          } else {
            that.downNum = that.downNum - 1;
          }
        }, 1000);
      }
    },

    send_again() {
      //重发验证码
      let that = this;
      that.isSend = true;
      that.sendAgain = false;
      that.send();
      let inteval = setInterval(() => {
        if (that.downNum === 0) {
          clearInterval(inteval);
          that.sendAgain = true;
        } else {
          that.downNum = that.downNum - 1;
        }
      }, 1000);
    },

    send() {
      if (checkPhone(this.phone) === false) {
        return;
      } else {
        createSnsCode({
          session: localStorage.getItem("question_session"),
          phone: this.phone,
        }).then((res) => {
          if (res.err_code === 0) {
            this.$Notify({ type: "success", message: "验证码已发送" });
          }
        });
      }
    },

    getMakedCode(code) {
      this.identifyCodea = code;
      console.log("getMakedCode:", this.identifyCode);
    },

    changeCode() {
      this.$nextTick(() => {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      });
    },
    // 生成一个随机整数  randomNum(0, 10) 0 到 10 的随机整数， 包含 0 和 10
    randomNum(min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 随机生成验证码字符串
    makeCode(data, len) {
      for (let i = 0; i < len; i++) {
        this.identifyCode += data[this.randomNum(0, data.length - 1)];
      }
    },
  },
};
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
.header {
  background: #f9d57e;
  height: 75px;
  display: flex;
  align-items: center;
  img {
    width: 88px;
    height: 35px;
    margin-left: 25px;
  }
}
.content {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  // & > .phoneCode {
  //   height: 50px;
  //   margin-right: 5px;
  //   border-radius: 6px;
  //   border: 1px solid rgba(16, 16, 16, 0.1);
  //   padding: 0 15px;
  //   width: 235px;
  // }
  & > div:nth-child(1) {
    img {
      height: 25px;
      width: 25px;
    }
  }
  & > div:nth-child(2) {
    font-size: 18px;
    font-weight: bold;
    margin: 15px 0 50px;
  }
  & > .phone {
    width: 235px;
    height: 50px;
    border: 1px solid rgba(16, 16, 16, 0.1);
    border-radius: 6px;
    padding: 0 15px;
    margin-bottom: 15px;
    color: rgba(16, 16, 16, 0.5);
  }
  & > .code {
    width: 265px;
    margin-bottom: 15px;
    display: flex;
    & > input {
      width: 235px;
      height: 50px;
      margin-right: 5px;
      border-radius: 6px;
      border: 1px solid rgba(16, 16, 16, 0.1);
      padding: 0 15px;
    }
    div {
      flex: 1;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      line-height: 50px;
    }
  }
  & > .phoneCode {
    width: 265px;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    input {
      height: 50px;
      border-radius: 6px;
      border: 1px solid rgba(16, 16, 16, 0.1);
      width: 140px;
      padding: 0 20px;
      color: rgba(16, 16, 16, 0.5);
      margin-right: 5px;
    }
    & > div {
      flex: 1;
      text-align: center;
      color: rgba(0, 0, 0, 1);
      font-size: 13px;
      font-weight: bold;
    }
    & > .sendAgain {
      flex: 1;
      background: #f9d57e;
      color: white;
      line-height: 50px;
      height: 50px;
      border-radius: 6px;
      font-size: 14px;
      text-align: center;
    }
  }

  & > .btnbg {
    background-color: rgba(0, 0, 0, 1);
    opacity: 1 !important;
  }
  & > .bindbtn {
    margin-top: 105px;
    width: 265px;
    height: 46px;
    line-height: 46px;
    opacity: 0.2;
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 1);
    color: rgba(255, 233, 173, 100);
    font-size: 15px;
    text-align: center;
    margin-bottom: 10px;
  }
  & > .activebtn {
    opacity: 1;
  }
  & > .tips {
    color: rgba(16, 16, 16, 0.35);
  }
}
</style>