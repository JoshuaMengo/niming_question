<template>
  <div class="BlackList">
    <div class="header">
      <div @click="$router.go(-1)">返回</div>
      <div><img src="@/assets/v2_qkcdmv.png" />黑名单</div>
      <div>当前列表下的用户无法向您提问</div>
    </div>

    <div class="content">
      <div v-if="list.length > 0">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div>
            <div>匿名用户 {{ item.block_uid }}</div>
            <div>{{ item.content }}</div>
          </div>
          <div @click="deblock(item.block_uid)">移出<br />列表</div>
        </div>
      </div>
      <img v-else src="@/assets/v2_qkch9i.png" />
    </div>
  </div>
</template>

<script>
import { queryBlacklist, deblockUser } from "@/api/api";
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
      const res = await queryBlacklist(data);
      this.list = res.data.list;
    },

    async deblock(id) {
      let that = this;
      that.$Dialog
        .confirm({
          title: "注意",
          message: "是否移除屏蔽",
        })
        .then(async () => {
          let data = {
            session: localStorage.getItem("question_session"),
            block_uid: id,
          };
          const res = await deblockUser(data);
          if (res.err_code === 0) {
            await this.getDataList();
            this.$Notify({ type: "success", message: "成功移除屏蔽" });
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
      margin: 20px 0 10px;
      color: rgba(16, 16, 16, 100);
      font-size: 20px;
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
      align-items: center;
      & > div:nth-child(1) {
        flex: 1;
        font-size: 15px;
        & > div:nth-child(1) {
          margin-bottom: 10px;
          font-weight: bold;
        }
        & > div:nth-child(2) {
          color: #b3b3b3;
        }
      }
      & > div:nth-child(2) {
        padding-left: 15px;
        border-left: 1px solid rgba(244, 245, 245, 100);
        color: rgba(16, 16, 16);
        font-size: 14px;
      }
    }
  }
}
</style>