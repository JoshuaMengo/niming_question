<template>
  <div class="container">
    <img src="@/assets/v2_qm3kc0.png" />
    <div>
      请长按/截屏保存到相册<br />
      使用微信扫一扫进入查收
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top:35px;
  img {
    width: 325px;
    height: 450px;
    margin-bottom: 20px;
  }
  div {
    text-align: center;
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
  }
}
</style>