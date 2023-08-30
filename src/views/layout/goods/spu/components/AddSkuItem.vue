<template>
 <el-card v-show="show">
    <el-form
      :model="skuItemData"
      ref="refElf"
      :rules="rules"
      label-width="auto">
      <el-form-item label="SKU名称" prop="skuName">
        <el-input
          style="width: 300px"
          v-model.trim="skuItemData.skuName"
          placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          v-model="skuItemData.price"
          :min="0"
          :max="99999"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input-number
          v-model="skuItemData.weight"
          :min="0"
          :max="99999"
          controls-position="right" />
      </el-form-item>
      <el-form-item label="SKU描述" prop="skuDesc">
        <el-input
          type="textarea"
          v-model.trim="skuItemData.skuDesc"
          placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性" v-if="attrInfoList.length > 0">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            style="margin-bottom: 18px"
            :label="ite.attrName"
            v-for="ite in attrInfoList"
            :key="ite.id">
            <el-select v-model="ite.checkData" placeholder="请选择" clearable>
              <el-option
                v-for="item in ite.attrValueList"
                :key="item.id"
                :label="item.valueName"
                :value="(item.id as number)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" v-if="spuSaleAttrList.length > 0">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="ite.saleAttrName"
            v-for="ite in spuSaleAttrList"
            :key="ite.id">
            <el-select v-model="ite.inputValue" placeholder="请选择" clearable>
              <el-option
                v-for="item in ite.spuSaleAttrValueList"
                :key="item.id"
                :label="item.saleAttrValueName"
                :value="(item.id as number)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-row style="width: 100%">
          <el-col :span="12" :offset="0">
            <el-table
              size="large"
              :data="imgList"
              class="common-bottom-margin"
              :row-class-name="
                ({ row }) =>
                  row.imgUrl === skuItemData.skuDefaultImg ? 'success-row' : ''
              "
              border>
              <el-table-column
                type="index"
                width="80"
                label="序号"
                align="center" />
              <el-table-column label="图片" align="center">
                <template #="{ row }">
                  <el-image
                    style="height: 150px"
                    :src="row.imgUrl"
                    fit="contain"
                    loading="lazy"></el-image>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                width="180"
                prop="imgName"
                align="center" />
              <el-table-column label="操作" width="180" align="center">
                <template #="{ row }">
                  <el-button
                    type="warning"
                    :disabled="skuItemData.skuDefaultImg === row.imgUrl"
                    @click="skuItemData.skuDefaultImg = row.imgUrl"
                    >设为默认</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="default" @click="save"
              >保存</el-button
            >
            <el-button @click="changeShow(false)">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import {
  reqAddSkuItem,
  reqSpuSaleAttrList,
  reqSpuImageList,
} from "@/api/goods";
import type {
  AttrInfoList,
  ItemSpuRecord,
  SpuSaleAttrList,
  ItemSpuImageList,
  SkuAttrValueList,
  SkuSaleAttrValueList,
} from "@/api/goods/type";

const show = ref(false);
const skuItemData = reactive({
  spuId: 0,
  category3Id: 0,
  tmId: 0,
  skuName: "",
  price: 0,
  weight: 0,
  skuDesc: "",
  skuDefaultImg: "",
  skuAttrValueList: <SkuAttrValueList[]>[], //平台属性
  skuSaleAttrValueList: <SkuSaleAttrValueList[]>[], //销售属性
});
const prop = defineProps({
  attrInfoList: {
    type: Array as PropType<AttrInfoList[]>,
    required: true,
  },
});
const emit = defineEmits(["cacelAddSkuItem"]);

const changeShow = (flag: boolean, obj?: { data: ItemSpuRecord }) => {
  if (flag && obj) {
    skuItemData.category3Id = obj.data.category3Id;
    skuItemData.tmId = obj.data.tmId as number;
    skuItemData.spuId = obj.data.id as number;
    getSpuSaleAttrList(skuItemData.spuId);
    getImgList(skuItemData.spuId);
  } else {
    //初始化数据
    refElf.value.resetFields();
    Object.assign(skuItemData, {
      spuId: 0,
      category3Id: 0,
      tmId: 0,
      skuName: "",
      price: 0,
      weight: 0,
      skuDesc: "",
      skuDefaultImg: "",
      skuAttrValueList: [],
      skuSaleAttrValueList: [],
    });
    emit("cacelAddSkuItem");
  }
  show.value = flag;
};

//表单验证
const refElf = ref();
const rules = reactive({
  skuName: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 2, max: 8, message: "长度应该是2到8", trigger: "blur" },
  ],
  skuDesc: [{ required: true, message: "请输入描述", trigger: "blur" }],
});

const spuSaleAttrList = ref(<SpuSaleAttrList[]>[]);
const getSpuSaleAttrList = async (id: number) => {
  //获取某个spuid下的销售属性
  let res = await reqSpuSaleAttrList(id);
  if (res.code === 200 && res.data) spuSaleAttrList.value = res.data;
};

const imgList = ref(<ItemSpuImageList[]>[]);
const getImgList = async (id: number) => {
  let res = await reqSpuImageList(id);
  if (res.code === 200 && res.data) {
    imgList.value = res.data;
  }
};

const save = async () => {
  //验证必填项
  await refElf.value.validate();

  //收集请求数据
  skuItemData.skuAttrValueList = prop.attrInfoList.reduce((pre, next) => {
    if (next.checkData)
      pre.push({ attrId: <number>next.id, valueId: next.checkData });
    return pre;
  }, <SkuAttrValueList[]>[]);
  skuItemData.skuSaleAttrValueList = spuSaleAttrList.value.reduce(
    (pre, next) => {
      if (next.inputValue)
        pre.push({
          saleAttrId: <number>next.id,
          saleAttrValueId: <number>next.inputValue,
        });
      return pre;
    },
    <SkuSaleAttrValueList[]>[]
  );

  let res = await reqAddSkuItem(skuItemData);
  if (res.code === 200) {
    ElMessage.success("保存成功");
  } else {
    ElMessage.error("保存失败");
  }
  changeShow(false)
  
};

defineExpose({ changeShow });
</script>

<style scoped lang="scss">
.el-table {
  :deep(.success-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
}
</style>
