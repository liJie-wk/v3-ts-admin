<template>
  <el-drawer v-model="show" @close="closeDrawer">
    <template #header>
      <h4>{{ addOrEditData.id ? "修改用户信息" : "添加用户信息" }}</h4>
    </template>
    <template #default>
      <el-form
        :model="addOrEditData"
        ref="refElf"
        :rules="rules"
        label-width="auto">
        <el-form-item label="用户名字" prop="username">
          <el-input v-model.trim="addOrEditData.username"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input v-model.trim="addOrEditData.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!addOrEditData.id">
          <el-input v-model.trim="addOrEditData.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="changeShow(false)">取消</el-button>
        <el-button type="primary" @click="confirmClick">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import type { ItemUserRecord } from "@/api/user/type";
import { reqSaveOrUpdate } from "@/api/user";

const emit = defineEmits(["refresh"]);
const show = ref(false);
const addOrEditData = reactive({
  username: "",
  name: "",
  password: "",
  id: 0,
});

const changeShow = (flag: boolean, data?: ItemUserRecord) => {
  show.value = flag;
  if (flag) {
    if (data) {
      nextTick(() => {
        addOrEditData.username = data.username;
        addOrEditData.name = data.name;
        addOrEditData.id = data.id;
      });
    }
  }
};
const closeDrawer = () => {
  refElf.value.resetFields();
  addOrEditData.id = 0;
  addOrEditData.password = "";
};

//表单验证
const refElf = ref();
const rules = reactive({
  username: [
    { required: true, message: "请输入用户名字", trigger: "blur" },
    { min: 5, max: 8, message: "长度应该是5到8", trigger: "blur" },
  ],
  name: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 5, max: 8, message: "长度应该是5到8", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, message: "长度至少5位", trigger: "blur" },
  ],
});

const confirmClick = async () => {
  await refElf.value.validate();
  let str;
  if (addOrEditData.id) {
    str = "password";
  } else {
    str = "id";
  }
  let obj = objectFilter([str], addOrEditData);
  let res = await reqSaveOrUpdate(obj as ItemUserRecord);
  if (res.code === 200) {
    ElMessage.success("保存成功");
    if (addOrEditData.id) {
      emit("refresh", {
        type: "change",
        data: {
          username: addOrEditData.username,
          name: addOrEditData.name,
          id: addOrEditData.id,
        },
      });
    } else {
      emit("refresh", { type: "add" });
    }
    changeShow(false);
  } else {
    ElMessage.error("保存失败");
  }
};

defineExpose({ changeShow });
</script>

<style scoped lang="scss"></style>
