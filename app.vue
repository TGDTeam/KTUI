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
      <HistoryTable :airdropData="mockTaskData" :chargeData="mockBatchData" />

      <!-- 状态表格 -->
      <StatusTable :accounts="accountsData" class="mb-8" />

      <!-- 日志面板 -->
      <LogPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
// 响应式数据
const currentTime = ref('')
const totalTasks = ref(100)
const completedTasks = ref(67)

// 计算属性
const progressPercentage = computed(() => 
  totalTasks.value > 0 ? (completedTasks.value / totalTasks.value) * 100 : 0
)

// 模拟数据
const metricsData = ref({
  totalTasks: 100,
  successTasks: 67,
  failedTasks: 3,
  totalGasFee: '2.456 ETH',
  successBatches: 23,
  failedBatches: 1,
  chargeFee: '1.234 ETH'
})

const accountsData = ref([
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D097C25c',
    nonce: 42,
    balance: '2.5432',
    chargeTime: 1250,
    batchCount: 5,
    successCount: 23,
    failedCount: 1,
    status: 'charging' as const,
    statusDetails: '正在充值 3 个地址'
  },
  {
    id: '2',
    address: '0x8ba1f109551bD432803012645Hac136c',
    nonce: 38,
    balance: '1.8765',
    chargeTime: 980,
    batchCount: 3,
    successCount: 18,
    failedCount: 0,
    status: 'idle' as const
  }
])

// 模拟历史数据
const mockTaskData = ref([])
const mockBatchData = ref([])

// 生命周期
onMounted(() => {
  // 更新时间
  const updateTime = () => {
    currentTime.value = new Date().toLocaleString('zh-CN')
  }
  updateTime()
  setInterval(updateTime, 1000)

  // 模拟数据更新
  setInterval(() => {
    if (completedTasks.value < totalTasks.value) {
      completedTasks.value += Math.floor(Math.random() * 3)
    }
  }, 2000)
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
