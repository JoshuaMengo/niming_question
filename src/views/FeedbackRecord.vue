<template>
  <div class="FeedbackRecord">
    <div class="header">
      <div>支付反馈记录</div>
      <div @click="$router.push('/FbrecordDetail')">手动查找</div>
    </div>

    <div class="content">
      <div
        class="list_item"
        @click="enterDetail(item.fid)"
        v-for="(item, index) in list"
        :key="index"
      >
        <div>
          <div>用户ID：{{ item.uid }}</div>
          <div>
            {{ item.create_time }} {{ item.is_handle ? "已处理" : "未处理" }}
          </div>
        </div>
        <div>></div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryFeedback } from "@/api/api";
export default {
  data() {
    return {
      list: [],
    };
  },

  created() {
    this.queryList();
  },
  methods: {
    async queryList() {
      let session = localStorage.getItem("question_session");
      const res = await queryFeedback(session);
      this.list = res.data.list;
    },

    enterDetail(fid) {
      this.$router.push({
        path: "/FbrecordDetail",
        query: {
          fid: fid,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.FeedbackRecord {
  background: white;
  .header {
    height: 60px;
    border-bottom: 1px solid rgba(244, 245, 245, 100);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    & > div:nth-child(1) {
      color: rgba(16, 16, 16, 100);
      font-size: 16px;
      font-weight: bold;
    }
    & > div:nth-child(2) {
      border-radius: 50px;
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: white;
      font-size: 12px;
      background-color: rgba(16, 16, 16, 100);
    }
  }
  & > .content {
    padding: 0 20px;
    & > .list_item {
      padding: 15px 0;
      border-bottom: 1px solid rgba(244, 245, 245, 100);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
  }
}
</style>