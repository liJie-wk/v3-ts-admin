<template>
  <div class="">
    <el-card>
      <div class="welcome">
        <el-avatar
          :size="100"
          :src="userStore.userData?.avatar || ''"></el-avatar>
        <div class="welcome-right">
          <el-text style="font-size: var(--el-font-size-extra-large)" tag="b"
            >欢迎回来～{{ userStore.userData?.name }}</el-text
          >
          <el-text tag="b" size="large">{{ AppTitle }}</el-text>
        </div>
      </div>
    </el-card>
    <div class="welcome-img"><svg-icon name="welcome" height="60vh"></svg-icon></div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
</script>

<style scoped lang="scss">
.welcome {
  display: flex;
  .welcome-right {
    margin-left: var(--el-card-padding);
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    align-items: flex-start;
  }
}
.welcome-img {
  display: flex;
  justify-content: center;
  margin-top: 5vh;
  
}
</style>
