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
const emit = defineEmits(["update:currentChange"]);
const props = defineProps({
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    required:true
  },
  currentChange: {
    type: Number,
    required:true
  },
});


const currentPage = useVModel(props,'currentChange',emit)
</script>

<style scoped lang="scss"></style>
