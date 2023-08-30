<template>
  <div class="">
    <el-dialog
      @close="changeDialogShow(false)"
      v-model="brandItemData.show"
      :title="brandItemData.id ? '修改品牌' : '添加品牌'"
      width="30%">
      <el-form
        label-width="100px"
        ref="refElf"
        :model="brandItemData"
        :rules="rules"
        inline>
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model.trim="brandItemData.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="fileUploadAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img
              v-if="brandItemData.logoUrl"
              :src="compatibleHttpImg(brandItemData.logoUrl)"
              class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="brandItemData.show = false">取消</el-button>
          <el-button type="primary" @click="confirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { Record } from "@/api/goods/type";
import { reqSaveOrUpdateTrademark } from "@/api/goods";
import type { UploadProps } from "element-plus";
const emit = defineEmits(["refreshList"]);
const refElf = ref();

//品牌数据
const brandItemData = reactive({
  show: false,
  logoUrl: "",
  tmName: "",
  id: 0,
  type: "添加",
});

const rules = reactive({
  tmName: [
    { required: true, message: "请输入品牌名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度应该是3到5", trigger: "blur" },
  ],
  logoUrl: [
    {
      required: true,
      validator(rules: any, value: any, callback: any) {
        if (value) {
          callback();
        } else {
          callback(new Error("请选择图片"));
        }
      },
    },
  ],
});

//上传图片
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  brandItemData.logoUrl = response.data;
};

const confirm = async () => {
  await refElf.value.validate();
  let res;
  const { logoUrl, tmName, id } = brandItemData;
  if (id) {
    res = await reqSaveOrUpdateTrademark({ logoUrl, tmName, id });
    if (res.code === 200) {
      emit("refreshList", "change");
      brandItemData.show = false;
      ElMessage.success("修改成功");
    } else {
      ElMessage.error("修改失败");
    }
  } else {
    res = await reqSaveOrUpdateTrademark({ logoUrl, tmName });
    if (res.code === 200) {
      emit("refreshList", "add")
      brandItemData.show = false;
      ElMessage.success("添加成功");
    } else {
      ElMessage.error("添加失败");
    }
  }
};

//弹窗关闭
const changeDialogShow = (bol: boolean, row?: Record) => {
  if (bol) {
    if (row?.id) {
      brandItemData.logoUrl = row.logoUrl;
      brandItemData.tmName = row.tmName;
      brandItemData.id = row.id;
    }
  } else {
    brandItemData.logoUrl = "";
    brandItemData.tmName = "";
    brandItemData.id = 0;
    refElf.value.clearValidate(["logoUrl", "tmName"]);
  }
  brandItemData.show = bol;
};

defineExpose({ changeDialogShow });
</script>

<style scoped lang="scss">
.avatar-uploader {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}
.el-icon {
  &.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>
