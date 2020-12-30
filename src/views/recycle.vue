<template>
  <div class="BlackList">
    <div class="header">
      <div @click="$router.go(-1)">返回</div>
      <div><img src="@/assets/v2_qkcdmv.png" />回收站</div>
    </div>

    <div class="content">
      <div v-if="list.length > 0">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div>{{ item.text }}</div>
          <div @click="recoverQ(item)">还原</div>
        </div>
      </div>
      <img v-else src="@/assets/v2_qkch9i.png" />
    </div>
  </div>
</template>

<script>
import { queryDelete, recoverQuestion } from "@/api/api";
export default {
  name: "BlackList",
  data() {
    return {
      list: [{}],
    };
  },
  async created() {
    await this.getDataList();
  },
  methods: {
    async getDataList() {
      let data = {
        session: localStorage.getItem("question_session"),
        page_index: 0,
      };
      const res = await queryDelete(data);
      this.list = res.data.list;
    },

    recoverQ(item) {
      let that = this;
      that.$Dialog
        .confirm({
          title: "注意",
          message: "是否还原",
        })
        .then(async () => {
          let data = {
            session: localStorage.getItem("question_session"),
            qid: item.qid,
            is_to_hidden:item.is_to_hidden
          };
          const res = await recoverQuestion(data);
          if (res.err_code === 0) {
            that.getDataList();
            that.$Notify({ type: "success", message: "恢复成功" });
          }
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.BlackList {
  .header {
    height: 88px;
    background: #ddd;
    padding: 20px;
    & > div:nth-child(1) {
      width: 55px;
      height: 30px;
      line-height: 30px;
      border-radius: 20px;
      background-color: rgba(16, 16, 16, 100);
      color: rgba(255, 255, 255, 100);
      font-size: 13px;
      text-align: center;
    }
    & > div:nth-child(2) {
      margin: 20px 0 0;
      color: rgba(16, 16, 16, 100);
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      img {
        height: 20px;
        width: 20px;
        margin-right: 5px;
      }
    }
    & > div:nth-child(3) {
      color: rgba(16, 16, 16, 0.35);
      font-size: 12px;
    }
  }
  .content {
    padding: 0 20px;
    background: white;
    & > img {
      height: 105px;
      width: 105px;
      margin: 88px auto;
      display: block;
    }
    .item {
      height: 84px;
      border-bottom: 1px solid rgba(244, 245, 245, 100);
      display: flex;
      font-size: 14px;
      align-items: center;
      & > div:nth-child(1) {
        flex: 1;
        color: #b3b3b3;
      }
      & > div:nth-child(2) {
        padding: 15px 0 15px 15px;
        border-left: 1px solid rgba(244, 245, 245, 100);
        color: rgba(16, 16, 16);
      }
    }
  }
}
</style>