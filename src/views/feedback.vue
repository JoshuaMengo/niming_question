<template>
  <div class="feedback">
    <div class="header" @click="$router.go(-1)">
      <div><img src="../assets/v2_qemuyq.png" /></div>
    </div>
    <div class="content">
      <div class="title">支付成功后还是无法查看访客记录？</div>
      <div>
        1、请确认您购买的是“偷看一次”还是“永久解锁”权限：若选择“偷看一次”则只能查看一次，退出后无法再次进入；<br />
        2、若支付完成后无法进入访客记录，可能是因为网络延迟，请刷新后重新尝试进入，若依然无法进入：请您在截图微信支付凭证并在下方上传，我们将尽快为您处理，处理结果将通过公众号通知。
      </div>

      <div>
        <van-uploader
          v-model="url"
          preview-size="185px"
          upload-text="上传支付凭证截图"
          :after-read="afterRead"
          max-count="1"
          max-size="2048000"
        />
        <div>
          获取微信支付凭证：
          微信搜索“微信支付”点击进入，查找到相应的支付凭证后，点击查看详情并截图。
        </div>
      </div>
      <div class="commit_btn" @click.stop="commit()">提交</div>
    </div>
  </div>
</template>

<script>
import { uploadImg, createFeedback } from "@/api/api";
export default {
  data() {
    return {
      url: [],
    };
  },
  methods: {
    afterRead(file) {
      let session = localStorage.getItem("question_session");
      // 此时可以自行将文件上传至服务器
      let formdata = new FormData();
      formdata.append("image", file.file);
      uploadImg({ formdata, session }).then((res) => {
        this.url[0] = res.data.url;
      });
    },

    commit() {
      if (this.url.length > 0) {
        let session = localStorage.getItem("question_session");
        let data = {
          session: session,
          img: this.url[0],
        };
        createFeedback(data).then((res) => {
          this.$Dialog
            .alert({
              message: "提交成功",
            })
            .then(() => {
              // on confirm
              this.$router.go(-1);
            });
        });
      } else {
        console.log("1");
      }
    },
  },
  // beforeCreate() {
  //   document
  //     .querySelector("body")
  //     .setAttribute("style", "background-color:#fff;height:100vh");
  // },
};
</script>

<style lang="less" scoped>
.feedback {
  padding: 20px;
  .header {
    margin-bottom: 20px;
    img {
      width: 60px;
      height: 30px;
    }
  }
  .content {
    .upload {
      position: relative;
      .text {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.35);
        height: 40px;
      }
    }
    & > div:nth-child(1) {
      color: rgba(61, 61, 61, 100);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 14px;
    }
    & > div:nth-child(2) {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      padding-bottom: 20px;
    }
    & > div:nth-child(3) {
      display: flex;
      align-items: flex-end;
      & > div:nth-child(2) {
        color: rgba(0, 0, 0, 0.3);
        font-size: 13px;
      }
    }
    .commit_btn {
      height: 45px;
      line-height: 45px;
      border-radius: 5px;
      background-color: rgba(249, 213, 126, 100);
      color: rgba(16, 16, 16, 100);
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      margin-top: 15px;
    }
  }
}

.van-uploader {
  margin: 20px 15px 0 0;
  .van-uploader__input {
    border: 1px solid rgba(221, 221, 221, 100) !important;
  }
}
</style>