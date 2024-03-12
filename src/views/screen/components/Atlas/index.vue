<template>
  <div ref="refAtlas" style="height: 100%"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts/core";

import geoJson from "@/assets/json/flight_map.json";
import { GeoComponent } from "echarts/components";
import { MapChart,EffectScatterChart } from "echarts/charts";

import type { GeoJSON } from "echarts/types/src/coord/geo/geoTypes";
import type { ECharts } from "echarts/core";

echarts.use([GeoComponent, MapChart,EffectScatterChart]);

//地图
const refAtlas = ref();
const createAtlas = () => {
  const points = [
    { value: [118.8062, 31.9208], itemStyle: { color: "#4ab2e5" } },
    { value: [127.9688, 45.368], itemStyle: { color: "#4fb6d2" } },
    { value: [110.3467, 41.4899], itemStyle: { color: "#52b9c7" } },
    { value: [125.8154, 44.2584], itemStyle: { color: "#5abead" } },
    { value: [116.4551, 40.2539], itemStyle: { color: "#f34e2b" } },
    { value: [123.1238, 42.1216], itemStyle: { color: "#f56321" } },
    { value: [114.4995, 38.1006], itemStyle: { color: "#f56f1c" } },
    { value: [117.4219, 39.4189], itemStyle: { color: "#f58414" } },
    { value: [112.3352, 37.9413], itemStyle: { color: "#f58f0e" } },
    { value: [109.1162, 34.2004], itemStyle: { color: "#f5a305" } },
    { value: [103.5901, 36.3043], itemStyle: { color: "#e7ab0b" } },
    { value: [106.3586, 38.1775], itemStyle: { color: "#dfae10" } },
    { value: [101.4038, 36.8207], itemStyle: { color: "#d5b314" } },
    { value: [103.9526, 30.7617], itemStyle: { color: "#c1bb1f" } },
    { value: [108.384366, 30.439702], itemStyle: { color: "#b9be23" } },
    { value: [113.0823, 28.2568], itemStyle: { color: "#a6c62c" } },
    { value: [102.9199, 25.46639], itemStyle: { color: "#96cc34" } },
    { value: [113.280637, 23.125178] },
  ];
  const aircraftRouteData = points.map((item) => {
    return item.itemStyle
      ? {
          coords: [item.value, points[points.length - 1].value],
          lineStyle: item.itemStyle,
        }
      : "";
  });
  aircraftRouteData.pop();
  const option = {
    geo: {
      map: "china",
      aspectScale: 0.75, //长宽比
      zoom: 1.1,
      roam: false,
      itemStyle: {
        areaColor: {
          type: "radial",
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: "#09132c", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#274d68", // 100% 处的颜色
            },
          ],
          globalCoord: true, // 缺省为 false
        },
        shadowColor: "rgb(58,115,192)",
        shadowOffsetX: 10,
        shadowOffsetY: 11,
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
          },
        },
      ],
      emphasis: {
        itemStyle: {
          areaColor: "#2AB8FF",
          borderWidth: 0,
          color: "green",
          label: {
            show: false,
          },
        },
      },
    },
    series: [
      {
        type: "map",
        roam: false,
        label: {
          show: true,
          color: "#1DE9B6",
        },

        itemStyle: {
          borderColor: "rgb(147, 235, 248)",
          borderWidth: 1,
          areaColor: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: "#09132c", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#274d68", // 100% 处的颜色
              },
            ],
            globalCoord: true, // 缺省为 false
          },
        },
        emphasis: {
          itemStyle: {
            areaColor: "rgb(46,229,206)",
            borderWidth: 0.1,
          },
          label: {
            color: "rgb(183,185,14)",
          },
        },
        zoom: 1.1,
        //     roam: false,
        map: "china", //使用
      },
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        showEffectOn: "render",
        zlevel: 1,
        rippleEffect: {
          period: 15,
          scale: 4,
          brushType: "fill",
        },
        label: {
          formatter: "{b}",
          position: "right",
          offset: [15, 0],
          color: "#1DE9B6",
          show: true,
        },
        itemStyle: {
          color: "#1DE9B6" /* function (value){ //随机颜色
 return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
 }*/,
          shadowBlur: 10,
          shadowColor: "#333",
        },
        symbolSize: 12,
        data: points,
      }, //地图线的动画效果
      {
        type: "lines",
        zlevel: 2,
        effect: {
          show: true,
          period: 4, //箭头指向速度，值越小速度越快
          trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
          symbol: "arrow", //箭头图标
          symbolSize: 7, //图标大小
        },
        lineStyle: {
          color: "#1DE9B6",
          /* function (value){ //随机颜色

                        ['#f21347','#f3243e','#f33736','#f34131','#f34e2b',
                        '#f56321','#f56f1c','#f58414','#f58f0e','#f5a305',
                        '#e7ab0b','#dfae10','#d5b314','#c1bb1f','#b9be23',
                        '#a6c62c','#96cc34','#89d23b','#7ed741','#77d64c',
                        '#71d162','#6bcc75','#65c78b','#5fc2a0','#5abead',
                        '#52b9c7','#4fb6d2','#4ab2e5']
 return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
 }*/ width: 1, //线条宽度
          opacity: 0.1, //尾迹线条透明度
          curveness: 0.3, //尾迹线条曲直度
        },
        data: aircraftRouteData,
      },
    ],
  };

  echarts.registerMap("china", geoJson as GeoJSON);
  const myChart = echarts.init(refAtlas.value);

  myChart.setOption(option);
  return myChart;
};

let atlas: ECharts | null;

onMounted(() => {
  atlas = createAtlas();
});
onUnmounted(() => {
  if(!atlas) return
  echarts.dispose(atlas);
  atlas = null;
});
</script>

