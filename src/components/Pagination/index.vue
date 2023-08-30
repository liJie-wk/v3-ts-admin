<template>
  <el-pagination
    background
    hide-on-single-page
    :default-page-size="pageSize"
    v-model:current-page="currentPage"
    layout=" prev, pager, next, ->,jumper,total"
    :total="total" />
</template>

<script setup lang="ts">
const emit = defineEmits(["currentChange"]);
defineProps({
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
});
const currentPage = ref(1);
whenever(currentPage, (val: number) => {
  emit("currentChange", val);
});
</script>

<style scoped lang="scss"></style>
