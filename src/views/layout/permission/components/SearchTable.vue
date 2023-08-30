<template>
      <el-form :inline="true" @submit.native.prevent class="one-elf">
        <el-form-item :label="label + '：'">
          <el-input v-model.lazy.trim="searchUsername" @keyup.enter.native="searchUsername?$emit('refresh'):''" :placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!searchUsername" @click="$emit('refresh')">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
</template>
 
<script setup lang="ts">
const props = defineProps({
  modelValue:String,
  placeholder:{
    type:String,
    default:'请输入用户名'
  },
  label:{
    type:String,
    default:'用户名'
  }
})
const emit = defineEmits(['update:modelValue','refresh'])

const searchUsername = useVModel(props,'modelValue',emit)
const reset = () => {
  searchUsername.value = ''
  emit('refresh')
}
</script>
 
<style scoped lang="scss">
 
.one-elf {
  display: flex;
  justify-content: space-between;
}
</style>