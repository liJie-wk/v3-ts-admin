<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <el-icon
        size="24"
        @click="setStore.changeCollapse"
        style="margin-right: 24px">
        <component :is="setStore.isCollapse ? 'Expand' : 'Fold'"></component>
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <template v-for="(item, index) in $route.matched" :key="item.path">
          <el-breadcrumb-item
            v-if="index > 0"
            :to="
              index + 1 === $route.matched.length ? '' : { path: item.path }
            ">
            <el-space>
            <el-icon size="16" >
              <component :is="item.meta.icon"></component>
            </el-icon>
            <el-text>{{ item.meta.title }}</el-text>
          </el-space>
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="toolbar-right">
      <div style="margin-right: 24px;">
        <el-button
        icon="Refresh"
        size="default"
        circle
        @click="$emit('refresh')"></el-button>
      <el-button
        icon="FullScreen"
        size="default"
        circle
        @click="toggle"></el-button>
      <el-button
        icon="Setting"
        size="default"
        circle
        @click="isSetShow = true"></el-button>
      </div>
      <el-space size="default">
        <el-avatar
          :size="30"
          :src="userStore.userData?.avatar || ''"></el-avatar>
          <el-text>{{ userStore.userData?.name || "不存在" }}</el-text>

        <el-dropdown>
          <el-icon><ArrowDown /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logOff">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </div>
    <ThemeSet v-model="isSetShow"></ThemeSet>
  </div>
</template>

<script setup lang="ts">
import ThemeSet from "./ThemeSet.vue";
const setStore = useSetStore();
const userStore = useUserStore();
const $route = useRoute();
const $router = useRouter();

//全屏
const { toggle } = useFullscreen()
//设置
const isSetShow = ref(false);
//退出登录
const logOff = () => {
  userStore.clearUserData();
  $router.replace("/login");
};
</script>

<style scoped lang="scss">
.toolbar {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .toolbar-left {
    display: flex;
    align-items: center;
  }
  .toolbar-right {
    display: flex;
    align-items: center;
  }
}
</style>
