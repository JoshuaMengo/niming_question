<template>
  <div class="newPoster">
    <div class="goback" @click="$router.go(-1)">＜返回</div>

    <div class="content" ref="imageWrapper" v-if="!isend">
      <img src="@/assets/v2_qmgfrx.png" />
      <div class="info">
        <div>
          <img :src="userInfo.avatarUrl" />
        </div>
        <div>{{ userInfo.nickName || "" }}</div>
      </div>

      <div class="qrcode" ref="qrCodeUrl"></div>
    </div>

    <div class="content imageWrapper" v-else>
      <img style="height: 100%; width: 100%" :src="downImg" />
    </div>

    <div class="text">长按保存后分享到朋友圈，即可邀请好友提问啦</div>

    <div class="loading" @click.stop="" v-show="isloading">
      <van-loading size="30" />
    </div>

  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import { getUser } from "@/api/api";

export default {
  data() {
    return {
      isend: false,
      downImg: "",
      userInfo: {},
      isloading:true

    };
  },
  created() {
    setTimeout(async () => {
      await this.creatQrCode(localStorage.getItem("question_uid"));
      this.download();
    }, 500);
    this.getData();
  },

  methods: {
    async getData() {
      const res = await getUser(localStorage.getItem("question_session"));
      this.userInfo = res.data;
    },

    toImage() {
      const opts = {
        useCORS: true,
        taintTest: true, // 在渲染前测试图片
        timeout: 500, // 加载延时
        backgroundColor: red,
        scrollY: 0,
        width: htmlDom.clientWidth, //dom 原始宽度
        height: htmlDom.clientHeight,
        // backgroundColor: red,
      };
      html2canvas(this.$refs.imageWrapper, opts, { allowTaint: true }).then(
        (canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this.imgUrl = dataURL;
          console.log(dataURL, "----");
          if (this.imgUrl !== "") {
            this.isend = true;
          }
        }
      );
    },

    creatQrCode(id) {
      let w = String(
        parseInt(window.getComputedStyle(this.$refs.qrCodeUrl).width)
      ).replace("px", "");
      let h = String(
        parseInt(window.getComputedStyle(this.$refs.qrCodeUrl).height)
      ).replace("px", "");
      console.log(w, h);
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text:
          "http://anonymous.lodidc.cn/niming_question/QuestionBox?id=" +
          Number(id),
        width: w,
        height: h,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H, //容错级别
      });
    },

    download() {
      var this1 = this;
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(function () {
        html2canvas(this1.$refs.imageWrapper, {
          backgroundColor: null,
          scrollY: 0,
          useCORS: true,
          taintTest: true, // 在渲染前测试图片
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this1.downImg = dataURL;
          this1.isend = true;
          this1.isloading = false

        });
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
.newPoster {
  padding: 10px;
  .loading {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .goback {
    width: 65px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 20px;
    background-color: rgba(16, 16, 16, 100);
    color: rgba(247, 247, 247, 100);
    margin-bottom: 20px;
  }
  .content {
    width: 325px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
    }
    .qrcode {
      height: 75px;
      width: 75px;
      position: absolute;
      top: 62%;
      left: 50%;
      transform: translateX(-50%);
    }
    .info {
      display: flex;
      align-items: center;
      position: absolute;
      top: 78px;
      left: 50%;
      transform: translateX(-50%);
      & > div:nth-child(1) {
        height: 36px;
        width: 36px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      & > div:nth-child(2) {
      }
    }
    .imageWrapper {
      height: 450px;
      width: 325px;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .text {
    margin-top: 12px;
    text-align: center;
    color: rgba(16, 16, 16, 0.5);
    font-size: 13px;
  }
}
</style>