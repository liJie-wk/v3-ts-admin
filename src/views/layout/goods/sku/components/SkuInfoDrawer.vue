<template>
  <el-drawer v-model="show" size="50%">
    <template #header>
      <h4>{{ skuItemData.skuName || "商品详情" }}</h4>
    </template>
    <template #default>
      <el-form label-width="auto">
        <el-form-item label="描述">
          <el-text>{{ skuItemData.skuDesc }}</el-text>
        </el-form-item>
        <el-form-item label="价格">
          <el-text>{{ skuItemData.price }}</el-text>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-tag
            v-for="item in skuItemData.skuAttrValueList"
            :key="item.attrId"
            >{{ item.valueName }}</el-tag
          >
        </el-form-item>
        <el-form-item label="销售属性">
          <el-tag
            v-for="item in skuItemData.skuSaleAttrValueList"
            :key="item.saleAttrId"
            >{{ item.saleAttrValueName }}</el-tag
          >
        </el-form-item>
        <el-form-item label="商品图片">
          <el-carousel v-if="skuItemData.skuImageList instanceof Array && skuItemData.skuImageList.length > 0" type="card" style="width: 100%;">
            <el-carousel-item v-for="item in skuItemData.skuImageList" :key="item.id">
              <div class="center-hv" style="height: 100%;"><el-image :src="compatibleHttpImg(item.imgUrl)" fit="contain"></el-image></div>
            </el-carousel-item>
          </el-carousel>
          <el-empty v-else description="description" />
        </el-form-item>
      </el-form>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reqSkuInfo } from "@/api/goods";
import type { AddSkuItem } from "@/api/goods/type";

const show = ref(false);
const skuItemData = ref(<AddSkuItem>{});
const changeShow = async (flag: boolean, id?: number) => {
    if(flag === show.value) return
  if (flag && id) {
    let res = await reqSkuInfo(id);
    console.log(res);
    if (res.code === 200 && res.data) {
      skuItemData.value = res.data;
    } else {
      return ElMessage.error("数据获取失败");
    }
  } else {
  }
  show.value = flag;
};
defineExpose({ changeShow });
</script>

<style scoped lang="scss">
.el-tag {
    margin-right: 5px;
}</style>
