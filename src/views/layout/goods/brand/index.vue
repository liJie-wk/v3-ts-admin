<template>
  <div class="brand">
    <el-card>
      <el-button
        type="primary"
        size="large"
        icon="Plus"
        class="common-bottom-margin"
        @click="refDialogGoods.changeDialogShow(true)"
        v-authority="'btn.Trademark.add'"

        >添加品牌</el-button
      >
      <el-table class="common-bottom-margin" v-loading="tableLoading" :max-height="setStore.document.clientHeight - 258" border stripe :data="brandData.listData">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="100"></el-table-column>
        <el-table-column
          label="品牌名称"
          align="center"
          prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO" align="center">
          <template #="{ row }">
            <el-image
              style="width: 100px"
              :preview-src-list="srcList"
              preview-teleported
              hide-on-click-modal
              @click="findImgInd(row)"
              :src="compatibleHttpImg(row.logoUrl)"
              fit="cover"
              loading="lazy"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" align="center">
          <template #="{ row }">
            <el-button
                type="warning"
                size="default"
                v-authority="'btn.Trademark.update'"
                :disabled="row.level === 1"
                icon="Edit"
                title="编辑"
                @click="refDialogGoods.changeDialogShow(true, row)">
              </el-button>
              <el-popconfirm
                width="200"
                title="你确定要删除这个吗？"
                @confirm="removeTrademarkItem(row.id)">
                <template #reference>
                  <el-button
                    v-authority="'btn.Trademark.remove'"
                    type="danger"
                    size="default"
                    :disabled="row.level === 1"
                    icon="Delete"
                    title="删除"
                    ></el-button
                  >
                </template>
              </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
        <Pagination
      :total="brandData.total"
      :page-size="PageSize"
      @update:currentChange="getTrademark" :currentChange="brandData.currentPage"></Pagination>
    </el-card>
    <dialog-goods ref="refDialogGoods" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="ts">

import DialogGoods from "./components/DialogGoods.vue";

import type { Record } from "@/api/goods/type";

import { reqTrademark,reqRemoveTrademark } from "@/api/goods";

const setStore = useSetStore()

//列表数据相关
const PageSize = 10;
const brandData = reactive({
  total: 0,
  listData: <Record[]>[],
    currentPage:1
});
const tableLoading = ref(false)

const getTrademark = async (page = 1) => {
  tableLoading.value = true
  brandData.currentPage = page;
  let res = await reqTrademark(brandData.currentPage, PageSize);
  if (res.code === 200 && res.data) {
    brandData.listData = res.data.records;
    brandData.total = res.data.total;
  }
  tableLoading.value = false
};

const removeTrademarkItem = async (id:number) => {
  let res = await reqRemoveTrademark(id)
   if(res.code === 200) {
    ElMessage.success('删除成功')
    refreshList('del')
   } else {
    ElMessage.error('删除失败')
   }
}
//列表数据的刷新方式
type refreshListParams = "change" | "add" |"del"
const refreshList = (params?:refreshListParams) => {
  switch (params) {
    case "change":
      getTrademark(brandData.currentPage);
      break;
    case "add":
      getTrademark();
      break;
    case "del":
      let num = brandData.currentPage;
      if (!(brandData.listData.length - 1)) num = brandData.currentPage - 1;
      if (num) getTrademark(num);

      break;
    default:
      break;
  }
};


//弹窗实例
const refDialogGoods = ref();


//图片预览
const srcList = ref(<[string|undefined]>[undefined])
const findImgInd = (row:Record) => {
  srcList.value[0] = compatibleHttpImg(row.logoUrl)
};



onMounted(() => {
  getTrademark();
});
</script>

<style scoped lang="scss">

</style>
