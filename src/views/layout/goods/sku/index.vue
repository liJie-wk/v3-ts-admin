<template>
  <div>
    <el-card>
      <el-table class="common-bottom-margin"
        :max-height="setStore.document.clientHeight - 190"
        v-loading="skuData.tableLoading"
        :data="skuData.list"
        border
        stripe>
        <el-table-column align="center" type="index" width="80" label="序号" />
        <el-table-column
          align="center"
          label="名称"
          width="300"
          prop="skuName" />
        <el-table-column
          align="center"
          label="描述"
          width="500"
          prop="skuDesc" />
        <el-table-column align="center" width="200" label="图片">
          <template #="{ row }">
            <el-image
              :src="row.skuDefaultImg || ''"
              fit="contain"
              style="height: 100px;"
              loading="lazy"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="重量(g)" prop="weight" />
        <el-table-column align="center" label="价格(元)" prop="price" />
        <el-table-column align="center" label="操作" width="300" fixed="right">
          <template #="{ row }">
            <el-button
              type="primary"
              size="default"
              :disabled="skuData.saleBtnFlag"
              @click="changeSale(row)"
              v-authority="'btn.Sku.updown'"
              :icon="row.isSale === 1 ? 'Bottom' : 'Top'"></el-button>
            <el-button
              type="info"
              size="default"
              @click="openSkuInfoDrawer(row.id)"
              v-authority="'btn.Sku.detail'"
              icon="InfoFilled"></el-button>
              <el-button
                type="warning"
                size="default"
                v-authority="'btn.Sku.update'"
                :disabled="row.level === 1"
                icon="Edit"
                title="编辑"
                @click="editSku">
              </el-button>
              <el-popconfirm
                width="200"
                title="你确定要删除这个吗？"
                @confirm="deleteSku(row.id)">
                <template #reference>
                  <el-button
                    v-authority="'btn.Sku.remove'"
                    type="danger"
                    size="default"
                    :disabled="row.level === 1"
                    icon="Delete"
                    title="删除"
                    ></el-button
                  >
                </template>
              </el-popconfirm></template>
        </el-table-column>
      </el-table>
      <Pagination
      :total="skuData.total"
      :page-size="PageSize"
      @current-change="getSkuList"></Pagination>
    </el-card>
    <SkuInfoDrawer ref="refSkuInfoDrawer"></SkuInfoDrawer>
  </div>
</template>

<script setup lang="ts">
import { reqSkuList, reqChangeSkuItemSale,reqDeleteSku } from "@/api/goods";
import type { AddSkuItem } from "@/api/goods/type";
import SkuInfoDrawer from './components/SkuInfoDrawer.vue';
import { useSetStore } from '@/store';
const setStore = useSetStore()

const PageSize = 10;
let currentPage = 1;

const skuData = reactive({
  list: <AddSkuItem[]>[],
  total: 0,
  tableLoading: false,
  saleBtnFlag:false
});

const getSkuList = async (page = 1) => {
  if (typeof page !== "number") return;
  currentPage = page;
  skuData.tableLoading = true;
  let res = await reqSkuList(page, PageSize);
  if (res.code === 200 && res.data) {
    skuData.list = res.data.records;
    skuData.total = res.data.total;
  } else {
    skuData.list = [];
    skuData.total = 0;
    ElMessage.error("获取数据失败");
  }
  skuData.tableLoading = false;
  console.log(res);
};

//上下架操作
const changeSale = async (row:AddSkuItem) => {
    skuData.saleBtnFlag = true
    let res = await reqChangeSkuItemSale(<number>row.id,<0|1>row.isSale)
    if(res.code === 200) {
        row.isSale = row.isSale === 1?0:1;
        ElMessage.success('操作成功')
    } else {
        ElMessage.error('操作失败')
    }
    skuData.saleBtnFlag = false
}

//查看详情
const refSkuInfoDrawer = ref()
const openSkuInfoDrawer = (id:number) => {
  refSkuInfoDrawer.value.changeShow(true,id)
}
//编辑
const editSku = () => {
  ElMessage.warning('还在开发中...')
}

//删除
const deleteSku = async (skuId: number) => {
  let res = await reqDeleteSku(skuId)
  if(res.code === 200) {
    ElMessage.success('删除成功')
    if(currentPage === 1 || skuData.list.length > 1) {
      getSkuList(currentPage)
    } else {
      getSkuList(currentPage - 1)
    }
  } else {
    ElMessage.error('删除失败')
  }
}
onMounted(() => {
  getSkuList();
});
</script>

<style scoped lang="scss"></style>
