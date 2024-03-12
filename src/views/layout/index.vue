<template>
  <el-container class="layout-container">
    <el-aside :width="setStore.isCollapse ? '66px' : '200px'">
      <div class="layout-container-logo">
        <el-avatar shape="square" :size="30" :src="avaterPath" />
        <transition name="el-fade-in-linear">
          <h1 class="layout-container-title" v-show="!setStore.isCollapse">
            {{ AppTitle }}
          </h1>
        </transition>
      </div>
      <el-scrollbar>
        <el-menu
          router
          :default-active="route.path"
          :background-color="elaBgc"
          :text-color="textColor"
          :collapse="setStore.isCollapse">
          <recursion-slider-list :list="SliderList"></recursion-slider-list>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <top-tabbar @refresh="componentRefresh" />
      </el-header>
      <el-main>
        <router-view #="{ Component }">
          <transition name="el-fade-in-linear" mode="out-in">
            <component
              v-if="isRefresh ? Component : ''"
              :is="isRefresh ? Component : ''" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import type { RouteRecordRaw } from "vue-router";

import RecursionSliderList from "./components/RecursionSliderList.vue";
import TopTabbar from "./components/TopTabbar.vue";

import avaterPath from "@/assets/images/common/avater.webp";

import { appSliderList,screen } from "@/router/index";

const SliderList = appSliderList.reduce((pre,now,ind) => {
  pre.push(now)
  if(ind === 0) pre.push(screen)
  return pre
},<RouteRecordRaw[]>[])

const setStore = useSetStore();
const route = useRoute();

//侧边栏文字颜色
const textColor = ref("#CFD3DC");
//侧边栏背景色
const elaBgc = ref("#0a0a0a");

//组件刷新
const isRefresh = ref(true);
const componentRefresh = () => {
  isRefresh.value = false;
  nextTick(() => {
    isRefresh.value = true;
  });
};

</script>

<style scoped lang="scss">
.layout-container {
  .el-aside {
    color: var(--el-text-color-primary);
    background-color: v-bind(elaBgc);
    transition: width 0.5s;
    .layout-container-logo {
      height: $logo_hight;
      color: #fff;
      display: flex;
      align-items: center;
      padding-left: 18px;
      position: relative;
      width: 100%;
      overflow: hidden;
      .layout-container-title {
        color: v-bind(textColor);
        white-space: nowrap;
        position: absolute;
        left: calc(18px + 15px + 30px);
      }
    }
    .el-scrollbar {
      height: calc(100vh - $logo_hight);
      .el-menu {
        border-right: none;
      }
    }
  }
  .el-header {
    position: relative;
    background-color:var(--el-bg-color);
    color: var(--el-text-color-primary);
    border-bottom: 2px solid var(--el-border-color);
  }
  .el-main {
    height: calc(100vh - 60px);
  }
}
</style>
