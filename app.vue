<template>
  <div class="min-h-screen bg-primary-bg">
    <!-- 背景效果 -->
    <div class="fixed inset-0 bg-gradient-to-br from-primary-green/5 via-transparent to-primary-green-secondary/5 pointer-events-none"></div>
    
    <!-- 主容器 -->
    <div class="relative z-10 container mx-auto px-6 py-8">
      <!-- 头部 -->
      <header class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold gradient-text mb-2">Web3 空投系统</h1>
            <p class="text-text-secondary">区块链批量中转空投代币管理平台</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="glass-card px-4 py-2">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-primary-green rounded-full animate-pulse-glow"></div>
                <span class="text-sm text-text-secondary">系统运行中</span>
              </div>
            </div>
            
            <div class="glass-card px-4 py-2">
              <div class="text-sm text-text-secondary">
                当前时间: <span class="text-primary-green">{{ currentTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 指标面板 -->
      <MetricsPanel :data="metricsData" />

      <!-- 历史数据表格 -->
      <HistoryTable :history="historyData" />

      <!-- 状态表格 -->
      <StatusTable :accounts="accountsData" class="mb-8" />

      <!-- 日志面板 -->
      <LogPanel :initialLogs="logsData" />
    </div>
  </div>
</template>

<script setup lang="ts">
// filepath: c:\Users\Administrator\Desktop\KT\UI\app.vue
import { ref, onMounted, onUnmounted } from 'vue'
import MetricsPanel from './components/MetricsPanel.vue'
import HistoryTable from './components/HistoryTable.vue'
import StatusTable from './components/StatusTable.vue'
import LogPanel from './components/LogPanel.vue'
import { fetchMetrics, fetchAccounts, fetchHistory, fetchLogs } from './services/api'

// 响应式数据（用 API 填充）
const currentTime = ref('')
const metricsData = ref<any>(null)
const accountsData = ref<any[]>([])
const historyData = ref<{ hours: string[], statsData: Record<string, number[]> } | null>(null)
const logsData = ref<any[]>([])

// 存储更新时间定时器 id 以便清理
let timeIntervalId: number | null = null

// 生命周期
onMounted(async () => {
  // 更新时间
  const updateTime = () => {
    currentTime.value = new Date().toLocaleString('zh-CN')
  }
  updateTime()
  timeIntervalId = window.setInterval(updateTime, 1000)

  // 异步拉取模拟后端数据
  try {
    const [metrics, accounts, history, logs] = await Promise.all([
      fetchMetrics(),
      fetchAccounts(),
      fetchHistory(),
      fetchLogs()
    ])
    metricsData.value = metrics
    accountsData.value = accounts
    historyData.value = history
    logsData.value = logs
  } catch (e) {
    // 简短错误处理（可按需扩展）
    console.error('fetch error', e)
  }
})

onUnmounted(() => {
  if (timeIntervalId !== null) {
    clearInterval(timeIntervalId)
    timeIntervalId = null
  }
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
