<template>
  <div class="FbrecordDetail">
    <div class="goback" @click="$router.go(-1)">
      <img src="../assets/v2_qemuyq.png" />
    </div>

    <div class="input_container">
      <input v-model="uid" />
      <div class="commit_btn" @click="getFb()">确定</div>
    </div>

    <div class="info" v-if="detailData.nickName">
      <div class="avatar">
        <img :src="detailData.avatarUrl" />
      </div>
      <div>
        <div>{{ detailData.nickName }}</div>
        <div>
          解锁状态：{{
            detailData.is_vip
              ? "永久解锁"
              : detailData.is_handle
              ? "解锁一次"
              : "无"
          }}
        </div>
      </div>
      <div @click="showImg()">支付凭证</div>
    </div>

    <div class="btn_container">
      <button @click="handleFb('once')">解锁一次</button>
      <button @click="handleFb('vip')">永久解锁</button>
      <button @click="handleFb('none')">无需处理</button>
    </div>
  </div>
</template>

<script>
import { getFeedback, handleFeedback,searchUser } from "@/api/api";
export default {
  data() {
    return {
      fid: "",
      detailData: {},
      gobacktext: "<返回",
      uid:''
    };
  },
  
  mounted() {
    if (this.$route.query.fid) {
      this.fid = this.$route.query.fid;
      let data={
        session:localStorage.getItem("question_session"),
        fid: this.fid,
      }
      getFeedback(data).then(res=>{
        this.detailData = res.data;
      })
    }
  },
  created() {},
  methods: {
    getFb() {
      if (this.uid + "" === "") {
        this.$Notify({ type: "warning", message: "请输入查询的id" });
        return;
      }
      let data = {
        session: localStorage.getItem("question_session"),
        uid: this.uid,
      };
      searchUser(data).then((res) => {
        console.log(res);
        this.detailData = res.data;
      });
    },

    showImg() {
      this.$ImagePreview([this.detailData.img]);
    },

    handleFb(flag) {
      let that = this;
      console.log(flag);
      that.$Dialog
        .confirm({
          title: "注意",
          message: "是否确定操作",
        })
        .then(() => {
          // on confirm
          let data = {
            uid: that.detailData.uid,
            fid: that.detailData.fid,
            flag: flag,
            session:localStorage.getItem('question_session')
          };
          handleFeedback(data).then((res) => {
            console.log(res);
            that.$Dialog.alert({
              message: "操作成功"
            }).then(() => {
              // on close
              that.router.go(-1)
            });
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
// html,body{
//     width:100vw!important;
//     background: white!important;
//     height: 100vh!important;
// }
.FbrecordDetail {
  background: white;
  padding: 20px;
  & > .goback {
    display: inline-block;
    margin-bottom: 70px;
    img {
      height: 30px;
      width: 60px;
    }
  }
  & > .input_container {
    width: 325px;
    height: 50px;
    display: flex;
    margin-bottom: 35px;
    & > .commit_btn {
      width: 65px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-radius: 0px 6px 6px 0px;
      background-color: rgba(16, 16, 16, 100);
      color: white;
      font-size: 14px;
    }
    & > input {
      flex: 1;
      // text-indent: 10px;
      border: 1px solid rgba(0, 0, 0, 0.15) !important;
      border-radius: 6px 0 0 6px !important;
      // border-radius: 0px 6px 6px 0px!important;
      padding: 0 10px;
    }
  }
  & > .info {
    padding: 20px 0;
    border-top: 1px solid rgba(244, 245, 245, 100);
    border-bottom: 1px solid rgba(244, 245, 245, 100);
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 20px;
    .avatar {
      width: 55px;
      height: 55px;
      border-radius: 50px;
      background: #ccc;
      margin-right: 10px;
      overflow: hidden;
      & > img {
        height: 100%;
        width: 100%;
      }
    }
    & > div:nth-child(2) {
      flex: 1;
      height: 55px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    & > div:nth-child(3) {
      color: rgba(76, 134, 234, 100);
      font-size: 14px;
    }
  }
  & > .btn_container {
    display: flex;
    justify-content: space-between;
    & > button {
      width: 105px;
      height: 44px;
      line-height: 44px;
      border-radius: 5px;
      text-align: center;
      color: white;
    }

    & > button:nth-child(1) {
      background-color: rgba(187, 187, 187, 100);
      border: 1px solid rgba(255, 255, 255, 100);
    }
    & > button:nth-child(2) {
      background-color: rgba(16, 16, 16, 100);
      border: 1px solid rgba(255, 255, 255, 100);
    }
    & > button:nth-child(3) {
      background-color: rgba(255, 255, 255, 100);
      border: 1px solid rgba(16, 16, 16, 100);
      color: black;
    }
  }
}
</style>