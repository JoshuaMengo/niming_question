<template>
  <div class="poster">
    <div class="container" ref="imageWrapper">
      <div class="header">
        <img src="@/assets/v2_qkaufe.png" />
        <div>{{ detailData.text }}</div>
      </div>
      <div class="content">
        <div>
          {{ detailData.to_user ? detailData.to_user.nickName : "" }} 的回答：
        </div>
        <div>
          {{ detailData.answer }}
        </div>
        <div>
          <div>长按识别二维码<br />查看问题详情→</div>
          <div>
            <div class="qrcode" ref="qrCodeUrl"></div>
          </div>
        </div>
      </div>
    </div>

    <div @click="download()" class="create_porster">生成海报</div>
    <div
      class="dialog"
      v-show="dialogTableVisible"
      @click="dialogTableVisible = false"
    >
      <img :src="downImg" @click.stop="" />
      <div>长按图片保存海报转发到朋友圈</div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { getDetail } from "@/api/api";
import html2canvas from "html2canvas";
export default {
  name: "poster",
  data() {
    return {
      detailData: {},
      downImg: "",
      dialogTableVisible: false,
    };
  },
  created() {
    console.log(this.$route.query);
    this.getDataDetail(this.$route.query.id);
    setTimeout(() => {
      this.creatQrCode(this.$route.query.id);
    }, 500);
  },

  methods: {
    toImage() {
      const opts = {
        useCORS: true,
        taintTest: true, // 在渲染前测试图片
        timeout: 500, // 加载延时
        backgroundColor: red,
      };
      html2canvas(this.$refs.imageWrapper, opts, { allowTaint: true }).then(
        (canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this.imgUrl = dataURL;
          if (this.imgUrl !== "") {
            this.dialogTableVisible = true;
          }
        }
      );
    },

    download() {
      var this1 = this;
      setTimeout(function () {
        html2canvas(this1.$refs.imageWrapper, {
          backgroundColor: null,
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this1.downImg = dataURL;
          this1.dialogTableVisible = true;

          console.log(dataURL);
        });
      }, 500);
    },

    creatQrCode(id) {
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text:
          "http://anonymous.lodidc.cn/niming_question/Detail?qid=" + Number(id),
        width: 60,
        height: 60,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H, //容错级别
      });
    },

    async getDataDetail(id) {
      let data = {
        session: localStorage.getItem("question_session"),
        qid: id,
      };
      const res = await getDetail(data);
      this.detailData = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.poster {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #f7f7f7;
  padding: 20px 25px;

  & > .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
      width: 80%;
      margin-bottom: 30px;
    }
    div {
      margin: 0 20px;
      width: 80%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
    }
  }
  .create_porster {
    margin-top: 20px;
    height: 35px;
    line-height: 35px;
    background: #f9d57e;
    text-align: center;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
  }
  .container {
    border-radius: 8px;
    overflow: hidden;
    .header {
      background-color: rgba(249, 213, 126, 100);
      padding: 25px 20px;
      img {
        width: 88px;
        height: 35px;
      }
    }
    .content {
      background: white;
      padding: 20px;
      & > div:nth-child(1) {
        margin-bottom: 20px;
      }
      & > div:nth-child(2) {
        border-radius: 6px;
        background-color: rgba(250, 250, 251, 100);
        padding: 20px;
        height: 40px;
        line-height: 20px;
        overflow: hidden;
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
        margin-bottom: 35px;
      }
      & > div:nth-child(3) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div:nth-child(1) {
          color: rgba(16, 16, 16, 100);
          font-size: 13px;
        }
        & > div:nth-child(2) {
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>