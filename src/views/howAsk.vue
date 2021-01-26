<template>
  <div class="howAsk">
    <div class="header">
      <div class="back" @click="$router.go(-1)">返回</div>
      <div class="bottom_container">
        <div class="text">
          <div>向好友提问</div>
          <div>Ask somebody</div>
        </div>
        <div>
          <img style="width: 24px; height: 24px" src="@/assets/v2_qmk3os.png" />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="item">
        <div>怎么向好友提问</div>
        <div>通过好友分享的专属海报，扫码进入Ta的提问箱就可以向Ta提问啦~</div>
      </div>

      <div class="line">
        <div class="text">or</div>
      </div>

      <div class="item">
        <div>没有好友的海报/提问箱链接？</div>
        <div>
          如果好友未开通提问箱，您可以通过填写对方的手机号码和您的提问内容主动提问，我们将通过短信通知Ta开通并查收您的提问。
        </div>
      </div>

      <div class="btn" @click="$router.push('/newAsk')">去提问</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.howAsk {
  .header {
    height: 95px;
    background-color: rgba(249, 213, 126, 100);
    padding: 20px;
    .back {
      width: 55px;
      height: 30px;
      line-height: 30px;
      border-radius: 20px;
      background-color: rgba(16, 16, 16, 100);
      color: rgba(247, 247, 247, 100);
      font-size: 13px;
      text-align: center;
    }
    .bottom_container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      .text {
        & > div:nth-child(1) {
          color: rgba(16, 16, 16, 1);
          font-size: 20px;
          font-weight: bold;
        }
        & > div:nth-child(2) {
          color: rgba(16, 16, 16, 0.35);
          font-size: 12px;
          line-height: 17px;
        }
      }
    }
  }
  .content {
    padding: 20px;
    .line {
      height: 1px;
      background: rgba(244, 245, 245, 100);
      margin-bottom: 30px;
      position: relative;
      .text {
        width: 30px;
        height: 20px;
        line-height: 20px;
        background: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .item {
      margin-bottom: 30px;
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 16px;
        margin-bottom: 15px;
        font-weight: bold;
      }
      & > div:nth-child(2) {
        color: rgba(61, 61, 61, 100);
        font-size: 15px;
      }
    }
    .btn {
      width: 335px;
      height: 45px;
      line-height: 45px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 1);
      color: rgba(249, 213, 126, 100);
      font-size: 15px;
      text-align: center;
    }
  }
}
</style>