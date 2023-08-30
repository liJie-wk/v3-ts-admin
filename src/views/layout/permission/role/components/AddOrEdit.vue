<template>
  <el-dialog title="添加职位" v-model="show" width="30%" @close="dialogClose">
    <el-form :model="itemAssignRole" ref="refElf" :rules="rules">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          placeholder="请输入职位名称"
          v-model.lazy.trim="itemAssignRole.roleName"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="changeShow(false)">取消</el-button>
        <el-button type="primary" @click="saveOrUpdateRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { AssignRole } from "@/api/user/type";
import { reqSaveOrUpdateRole } from "@/api/user";

const emit = defineEmits(["refresh"]);

const show = ref(false);
const itemAssignRole = reactive({
  roleName: "",
  id: 0,
});
const changeShow = (flag: boolean, data?: AssignRole) => {
  show.value = flag;
  if (flag) {
    if (data) {
      nextTick(() => {
        itemAssignRole.roleName = data.roleName;
      itemAssignRole.id = data.id;
      })
    }
  }
};
const dialogClose = () => {
  refElf.value.resetFields();
  itemAssignRole.id = 0;
};
//表单校验
const refElf = ref();
const rules = reactive({
  roleName: [
    { required: true, message: "请输入职位名称", trigger: "blur" },
    { min: 5, max: 10, message: "长度应该是5到10", trigger: "blur" },
  ],
});
const saveOrUpdateRole = async () => {
  await refElf.value.validate();
  let res;
  if(itemAssignRole.id) {
    res = await reqSaveOrUpdateRole(itemAssignRole.roleName,itemAssignRole.id)
  } else {
    res = await reqSaveOrUpdateRole(itemAssignRole.roleName)
  }
  if(res.code === 200) {
    ElMessage.success('保存成功')
    //发送数据修改列表
    emit('refresh',{type:itemAssignRole.id?'update':'save',data:itemAssignRole})
    changeShow(false)
  } else {
    ElMessage.error('保存失败')
  }
};

defineExpose({ changeShow });
</script>

<style scoped lang="scss"></style>
