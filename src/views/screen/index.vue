<template>
  <div class="root-screen">
    <div class="root-screen-container" :style="{ transform: getScale }">
      <el-container>
        <el-header class="screen-header" height="100%">
          <div class="left">
            <el-image :src="headerLeftImg"></el-image>
            <div class="btn" @click="router.replace('home')">
              <el-image :src="headerBtnImg" fit="contain"></el-image>
              <el-text size="large" class="btn-text">首页</el-text>
            </div>
          </div>
          <div class="center">
            <div class="center-container">
              <el-image :src="headerCenterImg"></el-image>
              <el-text size="large">智慧旅游可视化大数据展示平台</el-text>
            </div>
          </div>
          <div class="right">
            <el-image :src="headerLeftImg"></el-image>
            <div class="btn">
              <el-image :src="headerBtnRImg" fit="contain"></el-image>
              <el-text size="large" class="btn-text">统计报告</el-text>
            </div>
            <div class="nowtime">
              <el-text>当前时间：{{ nowTime }}</el-text>
            </div>
          </div>
        </el-header>
        <el-container>
          <el-aside class="left-aside">
            <div class="left-aside-item">
              <div class="top">
                <div class="left">
                  <div style="margin-bottom: 13px">
                    <el-text style="font-size: 20px">实时游客统计</el-text>
                  </div>

                  <el-image
                    :src="asideItemBgImg"
                    style="width: 50px"></el-image>
                </div>
                <div class="right">
                  <el-text>可预约总量&nbsp;</el-text>
                  <el-text type="warning">{{ allPeopleNum }}</el-text>
                  <el-text>&nbsp;人&nbsp;&nbsp;</el-text>
                </div>
              </div>
              <div class="left-aside-item-center">
                <div
                  class="num-item"
                  v-for="item in currentPeoples"
                  :key="item">
                  <el-text style="font-size: 30px">{{ item }}</el-text>
                </div>
              </div>
              <div class="left-aside-item-bottom">
               <AsyncLiquidfil :allPeopleNum="allPeopleNum" :peopleNum="peopleNum"></AsyncLiquidfil>
              </div>
            </div>
            <div class="left-aside-item">
              <div class="top">
                <div class="left">
                  <div style="margin-bottom: 13px">
                    <el-text style="font-size: 20px">男女比例</el-text>
                  </div>

                  <el-image
                    :src="asideItemBgImg"
                    style="width: 50px"></el-image>
                </div>
                <div class="right"></div>
              </div>
              <div class="left-aside-item-bottom">
                <div class="gender-container">
                  <div class="gender-container-top">
                    <div class="gender">
                      <el-text>男士</el-text>
                      <div class="gender-image">
                        <el-image :src="manImg" fit="cover"></el-image>
                      </div>
                    </div>
                    <div class="gender">
                      <el-text>女士</el-text>
                      <div class="gender-image">
                        <el-image :src="womanImg" fit="cover"></el-image>
                      </div>
                    </div>
                  </div>
                  <div class="gender-container-bottom">
                    <div class="gender-container-bottom-text">
                      <el-text>{{ manRatio + "%" }}</el-text>
                      <el-text>{{ 100 - manRatio + "%" }}</el-text>
                    </div>
                    <el-progress
                      :stroke-width="20"
                      :percentage="60"
                      text-inside
                      color="#326BF5FF">
                      <el-text></el-text>
                    </el-progress>
                  </div>
                </div>
              </div>
            </div>
            <div class="left-aside-item">
              <div class="top">
                <div class="left">
                  <div style="margin-bottom: 13px">
                    <el-text style="font-size: 20px">年龄比例</el-text>
                  </div>

                  <el-image
                    :src="asideItemBgImg"
                    style="width: 50px"></el-image>
                </div>
                <div class="right"></div>
              </div>
              <div class="left-aside-item-bottom">
                <div style="height: 230px" ref="refLeftPie"></div>
              </div>
            </div>
          </el-aside>
          <el-main>
            <div class="main-container">
              <div class="main-container-top">
                <div class="top-img">
                  <el-image
                    :src="dataScreenHeaderWarnBgImg"
                    style="width: 600px"
                    fill="contain"></el-image>
                  <el-text>平台高峰预警信息（2条）</el-text>
                </div>
                <div class="left-img">
                  <el-image
                    :src="mapTitleBgImg"
                    style="height: 26px"></el-image>
                  <el-text size="small">景区实时客流量</el-text>
                </div>
                <AsyncAtlas></AsyncAtlas>
              </div>
              <div class="main-container-bottom">
                <div class="left-top-item">
                  <div class="left">
                    <div style="margin-bottom: 13px">
                      <el-text>未来30天游客量趋势图</el-text>
                    </div>

                    <el-image
                      :src="asideItemBgImg"
                      style="width: 50px"></el-image>
                  </div>
                  <div class="right"></div>
                </div>
                <div ref="refLineChart" style="height: 100%"></div>
              </div>
            </div>
          </el-main>
          <el-aside class="right-aside">
            <div class="right-aside-item">
              <div class="top">
                <div class="left">
                  <div style="margin-bottom: 13px">
                    <el-text style="font-size: 20px">热门景区排行</el-text>
                  </div>

                  <el-image
                    :src="asideItemBgImg"
                    style="width: 50px"></el-image>
                </div>
                <div class="right"></div>
              </div>
              <div class="right-aside-item-bottom">
                <div class="rank-container">
                  <div class="rank-row bgimg">
                    <div class="center-hv">排名</div>
                    <div class="center-hv">景区</div>
                    <div class="center-hv">预约数量</div>
                  </div>
                  <div
                    class="rank-row"
                    v-for="(item, ind) in hotScenicSpotData"
                    :key="item.name">
                    <div class="center-hv" style="position: relative">
                      <svg-icon
                        name="rank"
                        height="45px"
                        :color="hotColor[ind]"></svg-icon>
                      <span
                        class="center-position"
                        style="
                          font-size: 12px;
                          transform: translate(-50%, -50%) scale(0.8);
                        "
                        >{{ "NO." + (ind + 1) }}</span
                      >
                    </div>
                    <div class="center-hv">{{ item.name }}</div>
                    <div class="center-hv">
                      <el-progress
                        :color="hotColor[ind]"
                        :stroke-width="20"
                        :percentage="
                          getPercentage(
                            item.peoples,
                            allPeopleNum / hotScenicSpotData.length
                          )
                        "
                        text-inside>
                      </el-progress>
                      <el-text
                        >&emsp;{{
                          (item.peoples / 10000).toFixed(2) + "w"
                        }}</el-text
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-aside-item">
              <div class="top">
                <div class="left">
                  <div style="margin-bottom: 13px">
                    <el-text style="font-size: 20px">年度游客量对比</el-text>
                  </div>

                  <el-image
                    :src="asideItemBgImg"
                    style="width: 50px"></el-image>
                </div>
                <div class="right"></div>
              </div>
              <div class="right-aside-item-bottom">
                <div ref="refYearLine" style="height: 226px"></div>
              </div>
            </div>
            <div class="right-aside-item">
              <div class="top">
                <div class="left">
                  <div style="margin-bottom: 13px">
                    <el-text style="font-size: 20px">渠道预约数据统计</el-text>
                  </div>

                  <el-image
                    :src="asideItemBgImg"
                    style="width: 50px"></el-image>
                </div>
                <div class="right"></div>
              </div>
              <div class="right-aside-item-bottom">
                <div ref="refRightPie" style="height: 230px"></div>
              </div>
            </div>
          </el-aside>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
//图片资源
import headerLeftImg from "@/assets/images/screen/dataScreen-header-left-bg.png";
import headerBtnImg from "@/assets/images/screen/dataScreen-header-btn-bg-l.png";
import headerBtnRImg from "@/assets/images/screen/dataScreen-header-btn-bg-r.png";
import headerCenterImg from "@/assets/images/screen/dataScreen-header-center-bg.png";
import asideItemBgImg from "@/assets/images/screen/dataScreen-title.png";
import womanImg from "@/assets/images/screen/woman.png";
import manImg from "@/assets/images/screen/man.png";
import dataScreenHeaderWarnBgImg from "@/assets/images/screen/dataScreen-header-warn-bg.png";
import mapTitleBgImg from "@/assets/images/screen/map-title-bg.png";

//echart
import * as echarts from "echarts/core";
import {
  BarChart,
  PieChart,
  LinesChart,
  LineChart,
} from "echarts/charts";
import {
  PolarComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
const AsyncAtlas = defineAsyncComponent(() =>
  import('./components/Atlas/index.vue')
)
const AsyncLiquidfil = defineAsyncComponent(() => 
  import('./components/Liquidfill/index.vue')
)

import type { ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
echarts.use([
  PolarComponent,
  BarChart,
  PieChart,
  LegendComponent,
  TooltipComponent,
  LinesChart,
  GridComponent,
  LineChart,
  SVGRenderer,
]);

const setStore = useSetStore();
const router = useRouter();
let myEcharts = <ECharts[]>[];

//当前时间
const nowTime = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");

//缩放
const WDesignDraft = 1920;
const HDesignDraft = 1080;
const getScale = computed(() => {
  let wScale = setStore.document.clientWidth / WDesignDraft;
  let hScale = setStore.document.clientHeight / HDesignDraft;
  return `translate(-50%, -50%) scale(${wScale < hScale ? wScale : hScale}`;
});

//热门景区
const hotScenicSpotData = ref([
  {
    name: "峨眉山",
    peoples: 75374,
  },
  {
    name: "昆仑山",
    peoples: 35374,
  },
  {
    name: "九寨沟",
    peoples: 45374,
  },
  {
    name: "万里长城",
    peoples: 65374,
  },
  {
    name: "北京故宫",
    peoples: 85374,
  },
]);
const hotColor = ["#4ab2e5", "#f34e2b", "#f58f0e", "#d5b314", "#96cc34"];

//人数相关
const allPeopleNum = ref(500000); //容量
const peopleNum = computed(() => {
  return hotScenicSpotData.value.reduce((pre, now) => {
    //当前总数
    return (pre += now.peoples);
  }, 0);
});
const manNum = ref(123456);
const manRatio = computed(() => getPercentage(manNum.value, peopleNum.value));
const currentPeoples = computed(() => {
  return [...peopleNum.value.toString().split(""), "人"];
});

const getPercentage = (val: number, allValue: number) => {
  return parseInt(((val / allValue) * 100).toString());
};


//左侧饼图
const refLeftPie = ref();
const createLeftPie = () => {
  const option = {
    legend: {
      top: "center",
      right: "10%",
      itemGap: 20,
      orient: "vertical",
      selectedMode: false,
      align: "left",
      formatter: "{name}",
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        left: "-30%",
        radius: ["40%", "90%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{d}",
          color: "#fff",
        },
        data: [
          { value: 1048, name: "10岁以下" },
          { value: 735, name: "10 - 20岁" },
          { value: 580, name: "20 - 40岁" },
          { value: 484, name: "40 - 60岁" },
          { value: 300, name: "60岁以上" },
        ],
      },
    ],
  };
  const myChart = echarts.init(refLeftPie.value, null, { renderer: "svg" });
  myChart.setOption(option);
  return myChart;
};

//右侧饼图
const refRightPie = ref();
const createRightPie = () => {
  function Pie() {
    let dataArr = [];
    for (var i = 0; i < 150; i++) {
      if (i % 3 === 0) {
        dataArr.push({
          name: (i + 1).toString(),
          value: 10,
          itemStyle: {
            color: "#fff",
            borderWidth: 0,
            borderColor: "rgba(0,0,0,0)",
          },
        });
      } else {
        dataArr.push({
          name: (i + 1).toString(),
          value: 25,
          itemStyle: {
            color: "rgba(0,0,0,0)",
            borderWidth: 0,
            borderColor: "rgba(0,0,0,0)",
          },
        });
      }
    }
    return dataArr;
  }
  const option = {
    legend: {
      orient: "vertical",
      icon: "circle",
      top: "center",
      left: "2%",
      x: "center",
      textStyle: {
        color: "#fff",
      },
      data: ["智慧文旅平台", "携程", "飞猪", "其他渠道"],
    },
    series: [
      {
        type: "pie",
        center: ["65%", "47%"],
        radius: ["60%", "85%"],
        color: [
          "#0E7CE2",
          "#FF8352",
          "#E271DE",
          "#F8456B",
          "#00FFFF",
          "#4AEAB0",
        ],
        itemStyle: {
          borderColor: "#031845",
          borderWidth: 10,
        },
        data: [
          {
            value: 335,
            name: "智慧文旅平台",
          },
          {
            value: 310,
            name: "携程",
          },
          {
            value: 234,
            name: "飞猪",
          },
          {
            value: 235,
            name: "其他渠道",
          },
        ],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        radius: ["22%", "24%"],
        center: ["65%", "47%"],

        color: ["#ffffff", "red"],
        startAngle: 115,
        data: [
          {
            value: 30,
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: 10,
            itemStyle: {
              color: "transparent",
            },
          },
          {
            value: 60,
            itemStyle: {
              color: "#ffffff",
              borderWidth: 6,
              borderColor: "#ffffff",
            },
          },
        ],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        radius: ["0%", "26%"],
        center: ["65%", "47%"],

        startAngle: 90,
        name: "232",
        data: [
          {
            value: 25,
            itemStyle: {
              color: "transparent",
              borderWidth: 4,
              borderColor: "#ffffff",
            },
          },
          {
            value: 75,
            itemStyle: {
              color: "transparent",
            },
          },
        ],

        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        radius: ["93%", "94%"],
        center: ["65%", "47%"],
        color: [
          "blue",
          "transparent",
          "blue",
          "transparent",
          "blue",
          "transparent",
        ],
        data: [
          {
            value: 17,
            name: "11",
          },
          {
            value: 17,
            name: "22",
          },
          {
            value: 17,
            name: "33",
          },
          {
            value: 17,
            name: "44",
          },
          {
            value: 17,
            name: "55",
          },
          {
            value: 17,
            name: "66",
          },
        ],

        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: "pie",
        zlevel: 0,
        silent: true,
        center: ["65%", "47%"],
        radius: ["40%", "41%"],
        z: 10,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: Pie(),
      },
      {
        type: "pie",
        zlevel: 0,
        silent: true,
        center: ["65%", "47%"],
        radius: ["54%", "56%"],
        z: 10,
        startAngle: 90,
        label: {
          show: false,
        },
        color: ["red", "blue", "red", "blue"],

        labelLine: {
          show: false,
        },

        data: [
          {
            name: "r1",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(51,149,191,0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(51,149,191,0)",
                },
              ]),
            },
          },
          {
            name: "r2",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(0,0,0,0)",
                },
                {
                  offset: 1,
                  color: "rgba(51,149,191,0.5)",
                },
              ]),
            },
          },
          {
            name: "r3",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(51,149,191,0)",
                },
                {
                  offset: 1,
                  color: "rgba(51,149,191,0.5)",
                },
              ]),
            },
          },
          {
            name: "r4",
            value: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(51,149,191,0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(0,0,0,0)",
                },
              ]),
            },
          },
        ],
      },
    ],
  };

  const myChart = echarts.init(refRightPie.value, null, { renderer: "svg" });
  myChart.setOption(option);
  return myChart;
};



//中下折线图
const refLineChart = ref();
const createLineChart = () => {
  const data = [
    ["06-05", 116],
    ["06-06", 129],
    ["06-07", 135],
    ["06-08", 86],
    ["06-09", 73],
    ["06-10", 85],
    ["06-11", 73],
    ["06-12", 68],
    ["06-13", 92],
    ["06-14", 130],
    ["06-15", 245],
    ["06-16", 139],
    ["06-17", 115],
    ["06-18", 111],
    ["06-19", 309],
    ["06-20", 206],
    ["06-21", 137],
    ["06-22", 128],
    ["06-23", 85],
    ["06-24", 94],
    ["06-25", 71],
    ["06-26", 106],
    ["06-27", 84],
    ["06-28", 93],
    ["06-29", 85],
    ["06-30", 73],
    ["07-01", 83],
    ["07-02", 125],
    ["07-03", 107],
    ["07-04", 82],
    ["07-05", 44],
    ["07-06", 72],
    ["07-07", 106],
    ["07-08", 107],
    ["07-09", 66],
    ["07-10", 91],
    ["07-11", 400],
    ["07-12", 113],
    ["07-13", 107],
    ["07-14", 131],
    ["07-15", 111],
    ["07-16", 64],
    ["07-17", 69],
    ["07-18", 88],
    ["07-19", 77],
    ["07-20", 83],
    ["07-21", 111],
    ["07-22", 57],
    ["07-23", 55],
    ["07-24", 60],
  ];
  const dateList = data.map(function (item) {
    return item[0];
  });
  const valueList = data.map(function (item) {
    return item[1];
  });
  const option = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      data: dateList,
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      boundaryGap: false,
    },

    yAxis: {
      name: "访问量",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      nameTextStyle: {
        align: "right",
      },
      splitLine: {
        //网格线
        show: false,
      },
    },

    grid: [
      {
        top: "35%",
        bottom: "10%",
      },
    ],
    series: [
      {
        type: "line",
        showSymbol: false,
        data: valueList,
        areaStyle: {},
        smooth: true,
      },
    ],
  };
  const myChart = echarts.init(refLineChart.value, null, { renderer: "svg" });
  myChart.setOption(option);
  return myChart;
};

//年度游客相关
const refYearLine = ref();
const createYearLine = () => {
  const valueList1 = [116, 129, 135, 86, 73, 85, 73, 68, 92, 130, 245, 139];
  const valueList2 = [115, 111, 309, 206, 137, 128, 85, 94, 71, 106, 84, 93];
  const valueList3 = [94, 71, 106, 84, 93, 137, 29, 135, 86, 73, 85, 73];
  const dateList = Array.from({ length: 12 }, (v, k) => k + 1);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        label: {
          show: true,
          formatter: "{value} 月",
        },
      },
    },
    legend: {
      data: ["2023年", "2022年", "2021年"],
      right: 0,
      top: 0,
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      data: dateList,
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      boundaryGap: false,
    },

    yAxis: {
      splitLine: {
        //网格线
        show: false,
      },
      name: "人数",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      nameTextStyle: {
        align: "right",
      },
    },

    grid: [
      {
        top: "15%",
        right: "4%",
        bottom: "10%",
      },
    ],
    series: [
      {
        name: "2023年",
        type: "line",
        showSymbol: false,
        data: valueList1,
        areaStyle: {},
        smooth: true,
      },
      {
        name: "2022年",
        type: "line",
        showSymbol: false,
        data: valueList2,
        areaStyle: {},
        smooth: true,
      },
      {
        name: "2021年",
        type: "line",
        showSymbol: false,
        data: valueList3,
        areaStyle: {},
        smooth: true,
      },
    ],
  };
  const myChart = echarts.init(refYearLine.value, null, { renderer: "svg" });
  myChart.setOption(option);
  return myChart;
};
onMounted(() => {
  myEcharts.push(
    createLeftPie(),
    createLineChart(),
    createYearLine(),
    createRightPie()
  );
});
onUnmounted(() => {
  myEcharts.forEach((item) => echarts.dispose(item));
  myEcharts = [];
});
</script>

<style scoped lang="scss">
$WDesignDraft: v-bind("WDesignDraft + 'px'");
$HDesignDraft: v-bind("HDesignDraft + 'px'");
$LeftMargin: 40px;
$BottomMargin: 16px;
.aside-item {
  background: url("@/assets/images/screen/dataScreen-main-lt.png") top center
    no-repeat;
  background-size: cover;
  width: 100%;
  .top {
    display: flex;
    .left {
      flex: 1;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}
.root-screen {
  background: url("@/assets/images/screen/bg.webp") center no-repeat;
  background-size: cover;
  height: 100vh;
  position: relative;
  :deep(.el-text) {
    color: #59b4e6ff;
  }

  .root-screen-container {
    width: $WDesignDraft;
    height: $HDesignDraft;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .screen-header {
      display: flex;
      padding: 0;
      .left,
      .right {
        position: relative;
        .btn {
          position: absolute;
          top: 0;
          .btn-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
      .left {
        .btn {
          right: 0;
        }
      }
      .center {
        flex: 1;
        .center-container {
          position: relative;
          .el-text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(2);
          }
        }
      }
      .right {
        .btn {
          left: 0;
        }
        .nowtime {
          position: absolute;
          left: 50%;
          top: 0;
          line-height: 36px;
        }
      }
    }

    .el-aside {
      width: calc(384px + $LeftMargin);
      transform: translateY(-$BottomMargin);
      height: calc($HDesignDraft - 77px);
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      &.left-aside {
        padding-left: $LeftMargin;
        .left-aside-item {
          @extend .aside-item;
          &-center {
            display: flex;
            justify-content: center;
            margin-top: 20px;

            .num-item {
              width: 42px;
              height: 42px;
              line-height: 42px;
              background: url("@/assets/images/screen/total.png") center
                no-repeat;
              background-size: 100%;
              text-align: center;
              margin-right: 8px;
              &:last-of-type {
                margin-right: 0;
              }
            }
          }
          &-bottom {
            .gender-container {
              $bottom_padding: 20px;
              padding: $bottom_padding 0;
              width: 66%;
              margin: 0 auto;
              .gender-container-top {
                height: 112px;
                display: flex;
                justify-content: space-between;
                margin-bottom: $bottom_padding;
                .gender {
                  width: 100px;
                  text-align: center;
                  background: url("@/assets/images/screen/man-bg.png") top
                    center no-repeat;
                  background-size: contain;
                  display: flex;
                  flex-flow: column;
                  &:last-of-type {
                    background-image: url("@/assets/images/screen/woman-bg.png");
                  }
                  .el-text {
                    line-height: $bottom_padding;
                  }
                  .gender-image {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }
              }
              .gender-container-bottom {
                .gender-container-bottom-text {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                .el-progress {
                  width: 100%;
                  :deep(.el-progress-bar__outer) {
                    background-color: #e96273ff;
                  }
                }
              }
            }
          }
        }
      }
      &.right-aside {
        padding-right: $LeftMargin;
        .right-aside-item {
          @extend .aside-item;
          &-bottom {
            .rank-container {
              width: 95%;
              height: 332px;
              margin: 0 auto;
              display: flex;
              flex-flow: column nowrap;
              justify-content: space-evenly;

              .rank-row {
                display: flex;
                height: 50px;
                color: white;
                &.bgimg {
                  background: url("@/assets/images/screen/rankingChart-bg.png")
                    top center no-repeat;
                  background-size: contain;
                  height: 38px;
                  color: #f3b250;
                }
                div {
                  flex: 1;
                  &:last-of-type {
                    flex: 2;
                  }
                }
              }
            }
          }
        }
      }
    }
    .el-main {
      padding: 0 $LeftMargin $BottomMargin;
      display: flex;
      .main-container {
        display: flex;
        flex-flow: column nowrap;
        flex: 1;

        .main-container-top {
          position: relative;
          flex: 1;
          .top-img {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -2px);
            display: flex;
            justify-content: center;
            .el-text {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .left-img {
            position: absolute;
            top: 62px;
            left: 0;
            height: 26px;
            line-height: 26px;
            .el-text {
              position: absolute;
              left: 10%;
              top: 0;
            }
          }
        }
        .main-container-bottom {
          background: url("@/assets/images/screen/dataScreen-main-cb.png") top
            center no-repeat;
          background-size: cover;
          height: 282px;
          width: 100%;
          position: relative;
          .left-top-item {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
  }
}
</style>
