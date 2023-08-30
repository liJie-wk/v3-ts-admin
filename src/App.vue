<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const setStore = useSetStore();

if(setStore.document.themeColor) setStore.setThemeColor(setStore.document.themeColor);

const isDark = useDark()
useToggle(isDark)

</script>
<style scoped lang="scss"></style>
