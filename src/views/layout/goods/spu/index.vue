<template>
  <div class="spu-root">
    <category-list
      @select-id="getSelectId"
      :disabled="!spuRootData.show"
      class="common-bottom-margin"></category-list>
    <el-card v-show="spuRootData.show">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="!spuRootData.selectId"
        @click="openEditOrAdd()"
        class="common-bottom-margin"
        v-authority="'btn.Spu.add'"

        >添加SPU</el-button
      >
      <el-table
        class="common-bottom-margin"
        :data="spuRootData.list"
        v-loading="spuRootData.loading"
        border
        stripe>
        <el-table-column type="index" width="80" label="序号" align="center" />
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button
              type="primary"
              title="添加SKU"
              icon="Plus"
              @click="openAddSkuItem(row)"
        v-authority="'btn.Spu.addsku'"
              ></el-button>
            <el-button
              type="success"
              icon="View"
              title="查看SKU列表"
        v-authority="'btn.Spu.skus'"
              @click="refViewSku.changeShow(true, row.id)"></el-button>
              <el-button
                type="warning"
                size="default"
                v-authority="'btn.Spu.update'"
                :disabled="row.level === 1"
                icon="Edit"
                title="编辑"
                @click="openEditOrAdd(row)">
              </el-button>
              <el-popconfirm
                width="200"
                title="你确定要删除这个吗？"
                @confirm="delSpuLits(row.id)">
                <template #reference>
                  <el-button
                    v-authority="'btn.Spu.delete'"
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
        :total="spuRootData.total"
        :page-size="spuRootData.pageSize"
        @update:currentChange="getSPUList" :currentChange="spuRootData.currentPage"></Pagination>
    </el-card>

    <edit-or-add
      :brand-list="spuRootData.brandList"
      :all-sale-attr-list="spuRootData.allSaleAttrList"
      @cacel-edit-or-add="showMain"
      ref="refEditOrAdd"></edit-or-add>
    <AddSkuItem
      ref="refAddSkuItem"
      :attr-info-list="spuRootData.attrInfoList"
      @cacel-add-sku-item="showMain"></AddSkuItem>
    <ViewSku ref="refViewSku" @cancel="showMain"></ViewSku>
  </div>
</template>

<script setup lang="ts">
import {
  reqSPUList,
  reqBrandList,
  reqBaseSaleAttrList,
  reqAttrInfoList,
  reqDelSpuItem,
} from "@/api/goods";
import type {
  ItemSpuRecord,
  ItemBrandList,
  ItemBaseSaleAttrList,
  AttrInfoList,
} from "@/api/goods/type";
import CategoryList from '../components/CategoryList.vue';
import AddSkuItem from "./components/AddSkuItem.vue";
import EditOrAdd from "./components/EditOrAdd.vue";
import ViewSku from "./components/ViewSku.vue";
const spuRootData = reactive({
  selectId: 0,
  loading: false,
  currentPage: 1,
  pageSize: 5,
  total: 0,
  list: <ItemSpuRecord[]>[],
  show: true,
  brandList: <ItemBrandList[]>[],
  allSaleAttrList: <ItemBaseSaleAttrList[]>[],
  attrInfoList: <AttrInfoList[]>[],
});

type selectIdList = [number, number, number];
const getSelectId = async (arr: selectIdList) => {
  spuRootData.selectId = arr[arr.length - 1];
  if (spuRootData.selectId) {
    getSPUList();
    getAttrInfoList(arr);
    getPublicData();
  } else {
    spuRootData.list = []
    spuRootData.total = 0
  }
};
const getSPUList = async (currentPage = 1) => {
  if(!spuRootData.selectId) return
  spuRootData.loading = true;
  spuRootData.currentPage = currentPage;
  let res = await reqSPUList(
    currentPage,
    spuRootData.pageSize,
    spuRootData.selectId
  );
  if (res.code === 200 && res.data) {
    spuRootData.list = res.data.records;
    spuRootData.total = res.data.total;
  } else {
    spuRootData.list = [];
    spuRootData.total = 0;
  }
  spuRootData.loading = false;
};
const getAttrInfoList = async (arr: selectIdList) => {
  //获取平台属性
  let res = await reqAttrInfoList(...arr);
  if (res.code === 200 && res.data) {
    spuRootData.attrInfoList = res.data;
  }
};

type refresh = undefined | "current" | "one";
const showMain = (refresh: refresh) => {
  switch (refresh) {
    case "current":
      getSPUList(spuRootData.currentPage);
      break;
    case "one":
      getSPUList();
      break;

    default:
      break;
  }
  spuRootData.show = true;
};

const refEditOrAdd = ref();
const openEditOrAdd = (data?: ItemSpuRecord) => {
  spuRootData.show = false;
  refEditOrAdd.value.changeShow({
    show: true,
    category3Id: spuRootData.selectId,
    data,
  });
};

const refAddSkuItem = ref();
const openAddSkuItem = (data: ItemSpuRecord) => {
  spuRootData.show = false;
  refAddSkuItem.value.changeShow(true, {
    data,
  });
};

const refViewSku = ref();

const delSpuLits = async (id: number) => {
  let res = await reqDelSpuItem(id);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    if (spuRootData.currentPage === 1 || spuRootData.list.length > 1) {
      showMain("current");
    } else {
      showMain("one");
    }
  } else {
    ElMessage.error("删除失败");
    showMain("current");
  }
};

const getPublicData = () => {
  if (spuRootData.brandList.length === 0) {
    reqBrandList().then((result) => {
      if (result.code === 200 && result.data)
        spuRootData.brandList = result.data;
    });
  }
  if (spuRootData.allSaleAttrList.length === 0) {
    reqBaseSaleAttrList().then((result) => {
      if (result.code === 200 && result.data)
        spuRootData.allSaleAttrList = result.data;
    });
  }
};
</script>

<style scoped lang="scss"></style>
