<template>
  <div class="notfound center-hv">
    <div class="notfound-container">
      <div class="notfound-container-left">
        <SvgIcon name="404" width="500px"></SvgIcon>
      </div>
      <div class="notfound-container-right center-hv">
        <el-space direction="vertical" alignment="normal" :size="40">
          <el-text style="font-size: 36px" type="primary"
            >努力更新中，敬请期待...</el-text
          >
          <p><el-text type="info">您可以点击下面按钮返回</el-text></p>
          <div>
            <el-button
            type="primary"
            size="default"
            @click="router.replace({name:'home'})"
            >返回</el-button
          >
          </div>
        </el-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
</script>

<style scoped lang="scss">
.notfound {
  width: 100vw;
  height: 100vh;
  .notfound-container {
    display: flex;
    .notfound-container-right {
      flex: 1;
      margin-left: 40px;
    }
  }
}
</style>
