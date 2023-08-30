<template>
  <div class="login_view">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24" style="height: 100vh">
        <div class="login_from">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form :model="userData" :rules="elfRules" ref="elfRef">
            <el-form-item prop="username">
              <el-input
                v-model.trim="userData.username"
                placeholder="请输入账号"
                prefix-icon="User"
                size="large"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model.trim="userData.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                :show-password="true"
                size="large"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button
                style="width: 100%"
                type="primary"
                :loading="loginBtn"
                @click="loginClick"
                size="large"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- <svg-icon name="lock" color="red" width="40px" height="40px"></svg-icon> -->
  </div>
</template>

<script setup lang="ts">

import { useUserStore } from "@/store/index";
const userStore = useUserStore();

const $router = useRouter();

const userData = reactive({
  username: "",
  password: "",
});
const loginBtn = ref(false);
const elfRef = ref();
const elfRules = reactive({
  username: [
    {
      trigger: "blur",
      validator(rules: any, value: any, callback: any) {
        if (value && value.length >= 5) {
          callback();
        } else {
          callback(new Error("账号不小于5位数"));
        }
      },
    },
  ],
  password: [
    {
      trigger: "change",
      validator(rules: any, value: any, callback: any) {
        if (value && value.length >= 5) {
          callback();
        } else {
          callback(new Error("密码不小于5位数"));
        }
      },
    },
  ],
});
const loginClick = async () => {
  await elfRef.value.validateField();
  loginBtn.value = true;
  let res = await userStore.userLogin(userData);
  if (res.code === 200) {
    $router.replace("/home");
    ElNotification.success('登陆成功')
  } else {
    ElNotification.error('登陆失败')
  }
  loginBtn.value = false;
};
</script>

<style scoped lang="scss">
.login_view {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/login/background.jpg") no-repeat center;
  background-size: cover;
  .login_from {
    padding: 40px;
    width: 80%;
    background: url("@/assets/images/login/login_form.png") no-repeat center;
    border-radius: 5px;
    background-size: cover;
    position: relative;
    top: 50%;
    transform: translate(0%, -50%);
    h1 {
      font-size: 48px;
      color: #fff;
    }
    h2 {
      padding: 20px 0;
      font-size: 26px;
      color: #fff;
    }
  }
}
</style>
