<template>
  <el-card v-show="show">
    <el-form
      ref="refElf"
      :model="itemSpuRecordData"
      :rules="rules"
      label-width="auto">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input
          placeholder="请输入SPU名称"
          style="width: 200px"
          v-model.trim="itemSpuRecordData.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌" prop="tmId">
        <el-select
          v-model="itemSpuRecordData.tmId"
          placeholder="请选择"
          clearable>
          <el-option
            v-for="item in brandList"
            :key="item.tmName"
            :label="item.tmName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" prop="description">
        <el-input
          placeholder="请输入SPU描述"
          v-model.trim="itemSpuRecordData.description"
          type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          v-model:file-list="filterFileList"
          :action="fileUploadAction"
          list-type="picture-card"
          :before-upload="beforeAvatarUpload"
          :on-success="imgUploadSuccess"
          :on-preview="handlePictureCardPreview">
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogImg.show">
          <img w-full :src="compatibleHttpImg(dialogImg.url)" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <div class="common-bottom-margin">
          <el-select
            v-model="propName"
            :placeholder="
              surplusSaleAttrList.length === 0
                ? '暂无数据可选'
                : `剩余${surplusSaleAttrList.length}个参数可选`
            "
            filterable>
            <el-option
              v-for="item in surplusSaleAttrList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button
            :disabled="surplusSaleAttrList.length === 0 || !propName"
            style="margin-left: 12px"
            type="primary"
            icon="Plus"
            @click="addPropItem"
            >添加属性</el-button
          >
        </div>
        <el-table
          class="common-bottom-margin"
          :data="itemSpuRecordData.spuSaleAttrList"
          border
          stripe>
          <el-table-column
            type="index"
            width="80"
            align="center"
            label="序号" />
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="100"
            align="center"></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.saleAttrValueName"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                style="width: 100px; margin: 5px"
                v-show="row.show"
                :ref="(vm) => (row.refEl = vm)"
                v-model.trim="row.inputValue"
                size="small"
                @keyup.enter="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)" />
              <el-button
                style="margin: 5px"
                v-show="!row.show"
                size="small"
                @click="showInput(row)">
                + 新标签
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ $index }">
              <el-button
                type="danger"
                icon="Delete"
                @click="
                  itemSpuRecordData.spuSaleAttrList.splice($index, 1)
                "></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button
          type="default"
          size="default"
          @click="changeShow({ show: false })"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reqSpuImageList, reqSpuSaleAttrList, resEditOrAdd } from "@/api/goods";

import type {
  ItemSpuRecord,
  ItemBrandList,
  ItemBaseSaleAttrList,
  SpuSaleAttrList,
  SpuSaleAttrValueList,
} from "@/api/goods/type";
import type { UploadProps, UploadUserFile } from "element-plus";

const emit = defineEmits(["cacelEditOrAdd"]);
const props = defineProps({
  brandList: {
    type: Array as PropType<ItemBrandList[]>,
    required: true,
  },
  allSaleAttrList: {
    type: Array as PropType<ItemBaseSaleAttrList[]>,
    required: true,
  },
});

const itemSpuRecordData: ItemSpuRecord = reactive({
  category3Id: 0,
  description: "",
  spuName: "",
  tmId: undefined,
  spuImageList: [],
  spuSaleAttrList: [],
});

const show = ref(false); //组件的显示隐藏
const changeShow = (obj: {
  show: boolean;
  category3Id?: number;
  data?: ItemSpuRecord;
  refresh?: string;
}) => {
  if (obj.show) {
    if (obj.category3Id) itemSpuRecordData.category3Id = obj.category3Id;
    if (obj.data) {
      itemSpuRecordData.description = obj.data.description;
      itemSpuRecordData.spuName = obj.data.spuName;
      itemSpuRecordData.tmId = obj.data.tmId;
      itemSpuRecordData.id = obj.data.id as number;
      getImgList(itemSpuRecordData.id);
      getSpuSaleAttrList(itemSpuRecordData.id);
    } else {
    }
  } else {
    refElf.value.resetFields();
    itemSpuRecordData.spuImageList = [];
    itemSpuRecordData.spuSaleAttrList = [];
    fileList.value = [];
    propName.value = "";
    delete itemSpuRecordData.id;
    emit("cacelEditOrAdd", obj.refresh);
  }
  show.value = obj.show;
};

//图片相关
const dialogImg = reactive({
  //图片预览框显示隐藏
  show: false,
  url: "",
});
const fileList = ref<UploadUserFile[]>([]);
const filterFileList = computed(() => {
  return fileList.value.map((item) => {
    return { name: item.name, url:  compatibleHttpImg(item.url)};
  });
})
const imgUploadSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  if (response.code === 200 && response.data) {
    let item = fileList.value.find((item) => item.uid === uploadFile.uid);
    if (item) item.url = response.data;
  } else {
    let index = fileList.value.findIndex((item) => item.uid === uploadFile.uid);
    if (index !== -1) {
      fileList.value.splice(fileList.value.length - 1, 1);
    }
  }
};
const getImgList = async (id: number) => {
  let res = await reqSpuImageList(id);
  if (res.code === 200 && res.data) {
    let arr = res.data.map((item) => {
      return { name: item.imgName, url: item.imgUrl };
    });
    fileList.value = arr;
  }
};
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImg.url = uploadFile.url!;
  dialogImg.show = true;
};

//属性相关
const propName = ref("");
const getSpuSaleAttrList = async (id: number) => {
  //获取某个spuid下的销售属性
  let res = await reqSpuSaleAttrList(id);
  if (res.code === 200 && res.data)
    itemSpuRecordData.spuSaleAttrList = res.data;
};
const surplusSaleAttrList = computed(() => {
  //剩余未添加的选项
  return props.allSaleAttrList.filter((item) => {
    return !itemSpuRecordData.spuSaleAttrList.some(
      (ite) => ite.saleAttrName === item.name
    );
  });
});
const addPropItem = () => {
  let item = surplusSaleAttrList.value.find(
    (item) => item.name === propName.value
  );
  if (item) {
    let obj: SpuSaleAttrList = {
      baseSaleAttrId: item.id,
      saleAttrName: item.name,
      spuSaleAttrValueList: [],
    };
    if (itemSpuRecordData.id) obj.spuId = itemSpuRecordData.id;
    itemSpuRecordData.spuSaleAttrList.push(obj);
    propName.value = "";
  }
};
const showInput = (row: SpuSaleAttrList) => {
  row.show = true;
  nextTick(() => {
    row.refEl?.focus();
  });
};

const handleInputConfirm = (row: SpuSaleAttrList) => {
  if (
    row.inputValue &&
    !row.spuSaleAttrValueList.some(
      (item) => item.saleAttrValueName === row.inputValue
    )
  ) {
    let obj: SpuSaleAttrValueList = {
      baseSaleAttrId: row.baseSaleAttrId,
      saleAttrName: row.saleAttrName,
      saleAttrValueName: <string>row.inputValue,
    };
    if (itemSpuRecordData.id) obj.spuId = itemSpuRecordData.id;
    row.spuSaleAttrValueList.push(obj);
  }
  row.show = false;
  row.inputValue = "";
};

//保存相关
const refElf = ref();
const rules = reactive({
  spuName: [
    { required: true, message: "请输入SKU名称", trigger: "blur" },
    { min: 2, max: 8, message: "长度应该是2到8", trigger: "blur" },
  ],
  tmId: [{ required: true, message: "请选择SPU品牌", trigger: "change" }],
  description: [{ required: true, message: "请输入SPU描述", trigger: "blur" }],
});
const save = async () => {
  //验证必填项
  await refElf.value.validate();

  //请求数据处理
  itemSpuRecordData.spuImageList = fileList.value.map((item) => {
    return { imgUrl: item.url as string, imgName: item.name };
  });

  let copyItem: ItemSpuRecord = JSON.parse(JSON.stringify(itemSpuRecordData));
  for (let index = 0; index < copyItem.spuSaleAttrList.length; index++) {
    const element = copyItem.spuSaleAttrList[index];
    let newItem = objectFilter(
      ["refEl", "show", "inputValue", "createTime", "updateTime"],
      element
    );
    copyItem.spuSaleAttrList[index] = newItem as SpuSaleAttrList;
  }


  let res = await resEditOrAdd(copyItem);
  if (res.code === 200) {
    ElMessage.success("保存成功");
  } else {
    ElMessage.error("保存失败");
  }
  if (itemSpuRecordData.id) {
    changeShow({ show: false, refresh: "current" });
  } else {
    changeShow({ show: false, refresh: "one" });
  }
};
defineExpose({ changeShow });
</script>

<style scoped lang="scss"></style>
