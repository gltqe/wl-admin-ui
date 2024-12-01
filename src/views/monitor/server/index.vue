<template>
  <div class="layout-content">
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card class="card" header="内存">
          <el-descriptions :column="2">
            <el-descriptions-item label-class-name="des-label" label="内存总量：">{{ memoryInfo.total }}GB
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="使用率：">{{ memoryInfo.rate }}%
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="已使用："> {{ memoryInfo.used }}GB
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="可用："> {{ memoryInfo.free }}GB
            </el-descriptions-item>
          </el-descriptions>
          <el-row>
            <div id="memoryChart" class="chart"></div>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-card class="card" header="CPU">
          <el-descriptions :column="2">
            <el-descriptions-item label-class-name="des-label" label="CPU总数：">{{ cpuInfo.total }}GB
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="当前空闲率：">{{ cpuInfo.idleRate }}%
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="系统使用率："> {{ cpuInfo.sysRate }}%
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="用户使用率："> {{ cpuInfo.userRate }}%
            </el-descriptions-item>
          </el-descriptions>
          <el-row>
            <div id="cpuChart" class="chart"></div>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-card class="card" header="硬盘">
          <el-descriptions :column="2">
            <el-descriptions-item label-class-name="des-label" label="硬盘总量：">{{ discInfo.total }}GB
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="使用率：">{{ discInfo.rate }}%
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="已使用："> {{ discInfo.used }}GB
            </el-descriptions-item>
            <el-descriptions-item label-class-name="des-label" label="可用："> {{ discInfo.free }}GB
            </el-descriptions-item>
          </el-descriptions>
          <el-row>
            <div id="discChart" class="chart"></div>
          </el-row>
        </el-card>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24" :xs="24">
        <el-card header="服务信息">
          <el-scrollbar>
            <el-descriptions :column="4">
              <el-descriptions-item label-class-name="des-label" label="服务器名称：">{{ serverInfo.serverName }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="服务器地址：">{{ serverInfo.serverIp }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="操作系统名称：">{{ serverInfo.osName }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="操作系统架构：">{{ serverInfo.osArch }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="java版本：">{{ serverInfo.javaVersion }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="jvm名称：">{{ serverInfo.jvmName }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="jvm版本：">{{ serverInfo.jvmVersion }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" label="jvm版本：">{{ serverInfo.jvmVersion }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" :span="4" label="项目路径：">
                {{ serverInfo.projectDir }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="des-label" :span="4" label="运行参数：">
                {{ serverInfo.runParameters }}
              </el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
        </el-card>

      </el-col>
    </el-row>
  </div>
</template>

<script setup name="ServerInfo">

import {getMemoryInfo, getDiscInfo, getCpuInfo, getServerInfo} from '@/api/monitor/server'
import {ref} from "vue";
import {ElMessage} from "element-plus";
import * as echarts from 'echarts'


const memoryInfo = ref({})
const cpuInfo = ref({})
const discInfo = ref({})
const serverInfo = ref({})
getMemoryInfo().then(res => {
  if (res.data.code === 200) {
    memoryInfo.value = res.data.data
    handleMemoryChart(memoryInfo.value)
  } else {
    ElMessage.error(res.data.msg)
  }
})


getCpuInfo().then(res => {
  if (res.data.code === 200) {
    cpuInfo.value = res.data.data
    handleCpuChart(cpuInfo.value)
  } else {
    ElMessage.error(res.data.msg)
  }
})
getDiscInfo().then(res => {
  if (res.data.code === 200) {
    discInfo.value = res.data.data
    handleDiscChart(discInfo.value)
  } else {
    ElMessage.error(res.data.msg)
  }
})

getServerInfo().then(res => {
  if (res.data.code === 200) {
    serverInfo.value = res.data.data
  } else {
    ElMessage.error(res.data.msg)
  }
})

// echarts
// 内存
const handleMemoryChart = (form) => {
  const memoryChart = echarts.init(document.getElementById('memoryChart'))
  memoryChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (param) {
        return param.marker + param.name + '：' + param.value + ' GB' + '<br>'
      }
    },
    legend: {
      left: 'center'
    },
    grid: {
      top: '25%', // 调整图表上边距
      bottom: '10%' // 调整图表下边距
    },
    series: [
      {
        name: '百分比',
        type: 'pie',
        radius: ['55%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {value: form.used, name: '已使用内存'},
          {value: form.free, name: '可用内存'}
        ]
      }
    ]
  })
}

// cpu
const handleCpuChart = (form) => {
  const cpuChart = echarts.init(document.getElementById('cpuChart'))
  cpuChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (param) {
        return param.marker + param.name + '：' + param.value + ' %' + '<br>'
      }
    },
    legend: {
      left: 'center'
    },
    grid: {
      top: '25%', // 调整图表上边距
      bottom: '10%' // 调整图表下边距
    },
    series: [
      {
        name: '百分比',
        type: 'pie',
        radius: ['55%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {value: form.sysRate, name: '系统使用率'},
          {value: form.userRate, name: '用户使用率'},
          {value: form.idleRate, name: '空闲率'}
        ]
      }
    ]
  })
}

// 硬盘
const handleDiscChart = (form) => {
  const discChart = echarts.init(document.getElementById('discChart'))
  discChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (param) {
        return param.marker + param.name + '：' + param.value + ' GB' + '<br>'
      }
    },
    legend: {
      left: 'center'
    },
    grid: {
      top: '25%', // 调整图表上边距
      bottom: '10%' // 调整图表下边距
    },
    series: [
      {
        name: '百分比',
        type: 'pie',
        radius: ['55%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: form.used, name: '已使用' },
          { value: form.free, name: '可用' }
        ]
      }
    ]
  })
}

</script>

<style scoped>
.card {
  margin-bottom: 20px;
}

.chart {
  height: 220px;
  width: 100%;
}

</style>
