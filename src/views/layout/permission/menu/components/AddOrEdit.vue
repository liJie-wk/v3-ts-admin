<template>
  <el-dialog title="Tips" v-model="show" width="30%" @close="closeDialog">
    <el-form
      :model="itemPermission"
      ref="refElf"
      :rules="rules"
      label-width="auto">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model.lazy.trim="itemPermission.name"
          placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input
          v-model.lazy.trim="itemPermission.code"
          placeholder="请输入权限值"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="changeShow(false)">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqSaveOrUpdatePermission } from "@/api/user";
import type { MenuParams, ItemRoleAssignPermission } from "@/api/user/type";


const itemPermission = ref(<MenuParams>{});

let openType: string | undefined;

let InitialValue: ItemRoleAssignPermission;

const show = ref(false);
const changeShow = (
  flag: boolean,
  data?: ItemRoleAssignPermission,
  type?: string
) => {
  show.value = flag;
  if (flag) {
    if (data) {
      InitialValue = data;
      openType = type;
      nextTick(() => {
        let fillList = ["pid", "level"];
        if (type) fillList.push("id", "name", "code");
        let obj = objectFilter(fillList, data, true);
        if (!type) {
          obj.pid = data.id;
          obj.level += 1;
        }
        itemPermission.value = obj;
      });
    }
  }
};

const closeDialog = () => {
  itemPermission.value = {} as MenuParams;
  refElf.value.resetFields();
};

//表单验证
const refElf = ref();
const rules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入权限值", trigger: "blur" }],
});

const save = async () => {
  await refElf.value.validate();
  let res = await reqSaveOrUpdatePermission(itemPermission.value);
  if (res.code === 200) {
    ElMessage.success("操作成功");
    if (openType) {
      InitialValue.name = itemPermission.value.name;
      InitialValue.code = itemPermission.value.code;
    } else {
      emit("refresh");
    }
  } else {
    ElMessage.error("操作失败");
    emit("refresh");
  }
  changeShow(false)
};

const emit = defineEmits(["refresh"]);
defineExpose({ changeShow });
</script>

<style scoped lang="scss"></style>
