<template>
  <div class="mine">
    <!-- background: url("../assets/v2_qkbbax.jpg"); -->
    <div
      :style="
        userInfo.photo + '' === ''
          ? `background: url('http://anonymous.lodidc.cn/question_static/data/image/moren.jpg')`
          : 'background:url(' + userInfo.photo + ')'
      "
      class="header"
    >
      <div>
        <div @click="$router.go(-1)">＜首页</div>
        <div>
          <van-uploader max-size="2048000" :after-read="afterRead" max-count="1"
            >更换背景</van-uploader
          >
        </div>
      </div>

      <div class="userInfo">
        <div class="detail">
          <div>
            <img :src="userInfo.avatarUrl" />
          </div>
          <div>
            <div class="nickName">
              {{ userInfo.nickName ? userInfo.nickName : "未授权用户" }}
            </div>
            <div class="id">UID {{ userInfo.uid }}</div>
          </div>
        </div>
        <!-- <div class="btn">更新信息</div> -->
      </div>
    </div>

    <div class="content">
      <div class="autograph">
        <div>
          <div>
            {{
              userInfo.introduce + "" === ""
                ? "这是一条系统赠送的签名"
                : userInfo.introduce
            }}
            <!-- <van-field
              placeholder="请输入签名"
              ref="field"
              v-model="userInfo.introduce"
            /> -->
          </div>
        </div>
        <div @click="getFocus()">
          <img src="@/assets/v2_qjxtra.png" />
        </div>
      </div>

      <div class="remind">
        <div @click="showDialog = 'code'">
          <div class="red_tip" v-show="first_login"></div>
          <img src="@/assets/v2_qkax0u.png" />开启消息通知
          <!-- <div>
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
                    padding:0;
                    background:#f7f7f7;
                    width:210px;
                    height: 50px;
                    line-height:50px;
                    text-align:left;
                    color:#2c3e50;
                 }

                </style>

                <button class="btn">开启消息通知</button>
              </script>
            </wx-open-launch-weapp>
          </div> -->
        </div>
      </div>

      <div class="panel">
        <div class="left">
          <div @click="$router.push('/QuestionBox')">
            <div class="text">
              我的提问箱
              <span>My box</span>
            </div>
            <div class="img"><img src="@/assets/v2_qkax75.png" /></div>
          </div>

          <div @click="$router.push('/howAsk')">
            <div class="text">
              向好友提问
              <span>ask somebody</span>
            </div>
            <div class="img"><img src="@/assets/v2_qmij1w.png" /></div>
          </div>

          <div>
            <a href="http://nim.lodidc.cn/friendtest/">
              <div class="text">
                默契问答
                <span>Tacit</span>
              </div>
              <div class="img"><img src="@/assets/v2_qlcecg.png" /></div>
            </a>
          </div>
        </div>

        <div class="right">
          <div @click="$router.push('/Record')">
            <div class="text">
              谁看过我 {{ userInfo.visit_num }}
              <div>
                <img
                  style="height: 20px; width: 30px"
                  src="@/assets/v2_ql0ir0.png"
                />
              </div>
            </div>
            <div class="img"><img src="@/assets/v2_qkayg6.png" /></div>
          </div>

          <div @click="$router.push('/recycle')">
            <div class="text">
              回收站
              <span>Recycle bin</span>
            </div>
            <div class="img"><img src="@/assets/v2_qkayjn.png" /></div>
          </div>

          <div @click="$router.push('/BlackList')">
            <div class="text">
              黑名单
              <span>Blacklist</span>
            </div>
            <div class="img"><img src="@/assets/v2_qkayox.png" /></div>
          </div>

          <div class="question">
            <div
              style="
                width: 190px;
                height: 53px;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 998;
              "
            >
              <wx-open-launch-weapp
                id="launch-btn"
                username="gh_1eeeae8628d0"
                path="pages/webview/webview?id=2"
              >
                <script type="text/wxtag-template">
                          <style>
                           .btn {
                              border:0;
                              font-size: 14px;
                              background:#f7f7f7;
                              text-align:left;
                              color:#2c3e50;
                              width: 160px;
                              padding: 20px 15px;
                              height: 13px;
                              border-radius: 8px;
                           }
                           .text{
                             font-size: 14px;
                            font-weight: bold;
                           }
                          </style>
                  <div class="btn">
                    <div class="text">
                      常见问题
                    </div>
                  </div>
                </script>
              </wx-open-launch-weapp>
            </div>
            <div class="img"><img src="@/assets/v2_qmk1ql.png" /></div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="dialog codeDialog"
      @click="showDialog = ''"
      v-show="showDialog === 'code'"
    >
      <div class="code">
        <img src="@/assets/20210121172140.png" />
      </div>
      <div>长按关注即可开启通知<br />若已关注无须重复操作</div>
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

    <div
      class="adminContainer"
      @click="$router.push('/FeedbackRecord')"
      v-show="is_admin"
    >
      管理员入口
    </div>

    <van-dialog
      @confirm="isConfirm"
      class="vanDialog"
      v-model="showinputDialog"
      show-cancel-button
    >
      <van-field
        class="dialog_input"
        placeholder="请输入签名"
        ref="input1"
        v-model="introduce"
      />
    </van-dialog>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import {
  getConfig,
  getUser,
  createPay,
  uploadImg,
  updateDetail,
  updateUnlockStatus,
  judgeAdmin,
} from "@/api/api";
export default {
  data() {
    return {
      showDialog: "",
      userInfo: {},
      appId: "",
      isFocus: false,
      newIntroduce: "",
      is_admin: false,
      showinputDialog: false,
      introduce: "",
      first_login: false,
    };
  },

  async created() {
    this.getWxConfig();
    this.getUserInfo();
    await this.getAdminStatus();
    this.first_login = localStorage.getItem("question_first_login");
  },
  methods: {
    getFocus() {
      this.showinputDialog = true;
    },

    isConfirm() {
      if (this.introduce + "" !== "") {
        console.log("1");
        this.updataIntroduce();
      }
    },

    async getAdminStatus() {
      const res = await judgeAdmin(localStorage.getItem("question_session"));
      console.log(res);
      this.is_admin = res.data.is_admin;
    },

    async updataIntroduce() {
      let that = this;
      let session = localStorage.getItem("question_session");
      let parama = {
        introduce: this.introduce,
      };
      const res = await updateDetail(session, parama);
      if (res.err_code === 0) {
        await that.getUserInfo();
      }
    },

    async afterRead(file) {
      // 此时可以自行将文件上传至服务器;
      let formdata = new FormData();
      let that = this;
      formdata.append("image", file.file);
      let data = {
        session: localStorage.getItem("question_session"),
        formdata: formdata,
      };
      const res = await uploadImg(data);
      if (res.err_code === 0) {
        let parama = {
          photo: res.data.url,
        };
        let session = localStorage.getItem("question_session");
        const newres = await updateDetail(session, parama);
        await that.getUserInfo();
      }
    },

    async getUserInfo() {
      const res = await getUser(localStorage.getItem("question_session"));
      this.userInfo = res.data;
      this.introduce = res.data.introduce;
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
.mine {
  padding-bottom: 20px;
  .vanDialog {
    .dialog_input {
      width: 80%;
      margin: 50px 10% 50px 10%;
      height: 40px;
      line-height: 40px;
    }
  }
  .codeDialog {
    display: flex;
    flex-direction: column;
    color: white;
    z-index:999;
  }
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
      align-items: center;
      & > div:nth-child(1) {
        width: 65px;
        height: 30px !important;
        line-height: 30px !important;
        border-radius: 20px;
        background-color: rgba(16, 16, 16, 100);
        color: rgba(247, 247, 247, 100);
        text-align: center;
      }
      & > div:nth-child(2) {
        width: 70px;
        height: 28px !important;
        line-height: 28px !important;
        border-radius: 20px;
        color: rgba(255, 255, 255, 100);
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 100);
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
          overflow: hidden;
          width: 70px;
          height: 70px;
          border-radius: 5px;
          margin-right: 15px;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .nickName {
          color: rgba(16, 16, 16);
          font-size: 18px;
          margin: 3px 0;
        }
        .id {
          color: rgba(16, 16, 16, 0.35);
          font-size: 12px;
        }
      }
    }
  }
  & > .content {
    margin: 0 20px;
    .autograph {
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
      img {
        height: 20px;
        width: 20px;
      }
    }
    .remind {
      display: flex;
      height: 50px;
      margin-top: 30px;
      & > div:nth-child(1) {
        flex: 1;
        border-radius: 16px;
        margin-right: 10px;
        background-color: rgba(247, 247, 247, 100);
        display: flex;
        align-items: center;
        position: relative;
        & > .red_tip {
          width: 10px;
          height: 10px;
          background: red;
          border-radius: 50%;
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(25%, -25%);
        }
        img {
          width: 24px;
          height: 24px;
          margin: 0 8px 0 15px;
        }
        & > div {
          flex: 1;
        }
      }
      & > div:nth-child(2) {
        width: 50px;
        height: 50px;
        background: #ffedc2;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .panel {
      margin-top: 10px;
      display: flex;
      .left {
        a {
          color: #2c3e50;
        }
        width: 135px;
        margin-right: 10px;
        & > div {
          background-color: rgba(247, 247, 247, 100);
          border-radius: 8px;
          padding: 20px 15px;
          position: relative;
        }
        & > div:nth-child(1) {
          height: 95px;
        }
        & > div:nth-child(2) {
          height: 95px;
          margin-top: 10px;
          & > .img {
            height: 35px;
            width: 35px;
          }
        }

        & > div:nth-child(3) {
          height: 25px;
          margin-top: 8px;
          & > .img {
            height: 29px;
            width: 29px;
          }
        }
        & .text {
          font-size: 15px;
          font-weight: bold;
          span {
            display: block;
            font-weight: normal;
            color: #d0cbc8;
          }
        }
        & .img {
          position: absolute;
          right: 15px;
          bottom: 15px;
          img {
            width: 35px;
            height: 35px;
          }
        }
      }
      .right {
        flex: 1;
        & > .question {
          position: relative;
          & > .img {
            z-index: 999;
          }
        }
        & > div {
          background-color: rgba(247, 247, 247, 100);
          border-radius: 8px;
          padding: 20px 15px;
          position: relative;
        }
        & > div:nth-child(1) {
          height: 80px;
        }
        & > div:nth-child(2) {
          height: 35px;
          margin-top: 10px;
          & > .img {
            right: 20px;
            bottom: 22px;
            img {
              height: 35px;
              width: 35px;
            }
          }
        }
        & > div:nth-child(3) {
          height: 35px;
          margin-top: 10px;
          // & > .text {
          //   padding: 15px;
          // }
          & > .img {
            right: 17px;
            top: 20px;
            img {
              height: 25px;
              width: 25px;
            }
          }
        }
        & > div:nth-child(4) {
          height: 13px;
          margin-top: 10px;
          // & > .text {
          //   padding: 15px;
          // }
          & > .img {
            right: 17px;
            top: 20px;
            img {
              height: 21px;
              width: 21px;
            }
          }
        }

        & .text {
          font-size: 15px;
          font-weight: bold;
          span {
            display: block;
            font-weight: normal;
            color: #d0cbc8;
          }
        }
        & .img {
          position: absolute;
          right: 15px;
          bottom: 15px;
          img {
            width: 45px;
            height: 45px;
          }
        }
      }
    }
  }
  .adminContainer {
    margin: 20px 20px 0;
    padding: 15px;
    font-size: 15px;
    background: #f7f7f7;
    font-weight: bolder;
    border-radius: 8px;
  }
}
</style>