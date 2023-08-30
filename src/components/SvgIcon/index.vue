<template>
    <svg ref="refSvg" :viewBox="viewBox" :style="{width,height}" >
      <use :href="prefix + name" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
//只需传宽度或者高度，如果传的值是%/vw/vh,那么将根据其自适应
const props =  defineProps({
  name: {
    type:String,
    required:true
  },
  color: String,
  width:String,
  height:String,
  prefix: {
    type: String,
    default: "#icon-",
  }
});
const refSvg = ref()
const svgWH = reactive({
  w:0,
  h:0
})
const viewBox = computed(() => {
  return props.width?`0 0 ${svgWH.h} ${svgWH.w}`:`0 0 ${svgWH.w} ${svgWH.h}`
})
onMounted(() => {
  const {width,height} = refSvg.value.getBBox()
  svgWH.w = parseInt((width * 100).toFixed())
  svgWH.h = parseInt((height * 100).toFixed())
})
</script>
