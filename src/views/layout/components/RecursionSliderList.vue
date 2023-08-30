<template>
  <template v-for="item in props.list">
    <template v-if="!item.meta.isDisabled">
      <el-sub-menu :index="setPath(item.path)" v-if="item.children">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span> {{ item.meta.title }}</span>
        </template>
        <recursion-slider-list
          :list="item.children"
          :prePath="item.path"></recursion-slider-list>
      </el-sub-menu>

      <el-menu-item :index="setPath(item.path)" v-else>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">
const props = defineProps(["list", "prePath"]);
const setPath = (path: string) => {
  return props.prePath ? props.prePath + "/" + path : path;
};
</script>

<style scoped lang="scss"></style>
