<template>
  <div class="report">
    <div class="header">
      <div @click="$router.go(-1)">{{ goBacktext }}</div>
      <!-- <div @click="$router.go(-1)"><img src="../assets/goback.png" /></div> -->
      <div>举报</div>
    </div>

    <div class="content">
      <div class="form_item">
        <div>举报理由</div>
        <div class="textarea">
          <textarea rows="10" v-model="reportContent" />
        </div>
      </div>

      <div class="form_item">
        <div>上传截图</div>

        <van-uploader
          v-model="url"
          preview-size="125px"
          upload-text="上传截图"
          :after-read="afterRead"
          max-count="1"
          max-size="2048000"
        />
      </div>

      <div class="commit_btn" @click="comimt()">提交</div>
    </div>
  </div>
</template>

<script>
// import { uploadImg } from "@/api/api";
export default {
  name: "report",
  // components: {
  //   [Dialog.Component.name]: Dialog.Component,
  // },
  data() {
    return {
      url: [],
      reportContent: "",
      goBacktext: "<返回",
    };
  },

  methods: {
    afterRead(file) {
      console.log(file);
      //   let session = localStorage.getItem("question_session");
      // 此时可以自行将文件上传至服务器
      //   let formdata = new FormData();
      //   formdata.append("image", file.file);
      //   uploadImg({ formdata, session }).then((res) => {
      //     console.log(res);
      //     this.url[0] = res.data.url;
      //   });
    },
    comimt() {
      if (this.reportContent + "" !== "" && this.url.length > 0) {
        this.$Dialog
          .alert({
            message: "举报成功",
          })
          .then(() => {
            // on confirm
            this.$router.go(-1);
          });
      } else {
        this.$Dialog
          .alert({
            message: "请填写举报理由和上传截图凭证",
          })
          .then(() => {
            // on confirm
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.report {
  background: white;
  padding: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(244, 245, 245, 100);
    padding-bottom: 20px;
    margin-bottom: 20px;
    & > div:nth-child(1) {
      width: 60px;
      height: 30px;
      line-height: 30px;
      border-radius: 20px;
      background-color: rgba(16, 16, 16, 100);
      color: rgba(247, 247, 247, 100);
      font-size: 13px;
      text-align: center;
    }
    & > div:nth-child(2) {
      color: rgba(16, 16, 16, 100);
      font-size: 18px;
      font-weight: bold;
    }
  }
  & > .content {
    & > .form_item {
      margin-bottom: 20px;
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 15px;
        margin-bottom: 10px;
      }
      & > .textarea {
        border: 1px solid rgba(187, 187, 187, 100);
        height: 100px;
        padding: 10px;
        background: white;
        textarea {
          height: 100%;
          width: 100%;
          border: 0;
          border-radius: 5px !important;
          font-size: 16px;
        }
      }
    }
    & > .commit_btn {
      height: 44px;
      line-height: 44px;
      border-radius: 5px;
      font-size: 15px;
      text-align: center;
      background-color: rgba(249, 213, 126, 100);
      color: rgba(16, 16, 16, 100);
      font-weight: bold;
    }
  }
}
</style>