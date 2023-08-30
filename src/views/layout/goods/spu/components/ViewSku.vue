<template>
  <el-dialog title="SKU列表" v-model="show" width="30%">
    <el-table :data="itemSkuData" border stripe>
        <el-table-column label="名字" prop="skuName" />
        <el-table-column label="价格(元)" prop="price" />
        <el-table-column label="重量(g)" prop="weight" />
        <el-table-column label="图片">
          <template #="{row}">
            <el-image :src="compatibleHttpImg(row.skuDefaultImg)" loading="lazy" fit="contain"></el-image>
            
          </template>
        </el-table-column>
    </el-table>
    
    <template #footer>
      <span>
        <el-button @click="changeShow(false)">取消</el-button>
        <el-button type="primary" @click="changeShow(false)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqFindBySpuId } from '@/api/goods';
import type { AddSkuItem } from '@/api/goods/type';

const itemSkuData = ref(<AddSkuItem[]>[])
const findBySpuId = async (id:number) => {
    let res = await reqFindBySpuId(id)
    if(res.code === 200 && res.data) {
      itemSkuData.value = res.data;
    } else {
      ElMessage.error('没有数据')
    }
}

const show = ref(false)
const changeShow = (flag:boolean,id?:number) => {
    if(flag&&id) {
        findBySpuId(id)
    } else {
      itemSkuData.value = []
    }
    show.value = flag
}

defineExpose({changeShow})
</script>

<style scoped lang="scss"></style>
