<template>
  <div class="record_container">
    <div class="header">
      <div @click="$router.go(-1)">{{ gobacktext }}</div>
      <div><img src="@/assets/v2_qkcdhx.png" />谁看过我</div>
      <div>包含仅访问未留言的好友</div>
    </div>
    <div class="recordList">
      <div class="record_iem" v-for="(item,index) in list" :key="index">
        <div><img :src="item.avatarUrl"/></div>
        <div>{{item.nickName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {queryVisitor,reduceUnlockNumber} from '@/api/api'
export default {
  name: "record",
  data() {
    return {
      gobacktext: "<返回",
      list:[]
    };
  },
  async created() {
    await this.getList();
    await reduceUnlockNumber(localStorage.getItem('question_session'))
  },
  methods: {
    async getList() {
      let session = localStorage.getItem('question_session')
      const res = await queryVisitor({session:session,page_index:0})
      this.list = res.data.list
      console.log(res)
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
       img{
        width: 25px;
        height:25px;
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
        img{
          height:100%;
          width:100%;
        }
      }
    }
  }
}
</style>