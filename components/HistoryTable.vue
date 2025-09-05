<template>
  <div class="glass-card p-6 mb-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold gradient-text">最近10小时数据统计</h2>
      <div class="flex items-center space-x-4">
        <button 
          @click="toggleSortOrder"
          class="px-3 py-1 bg-primary-green/20 text-primary-green rounded-lg hover:bg-primary-green/30 transition-colors text-sm flex items-center space-x-2"
        >
          <span>{{ sortOrder === 'desc' ? '最新在前' : '最旧在前' }}</span>
          <span>{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
        </button>
        <div class="text-sm text-text-secondary">
          数据更新时间: <span class="text-primary-green">{{ updateTime }}</span>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto scrollbar-custom">
      <table class="w-full min-w-[1200px]">
        <thead>
          <tr class="border-b border-glass-border">
            <th class="text-left py-4 px-3 text-text-secondary font-medium">时间段</th>
            <th class="text-center py-4 px-3 text-text-secondary font-medium" colspan="4">空投任务</th>
            <th class="text-center py-4 px-3 text-text-secondary font-medium" colspan="4">充值任务</th>
          </tr>
          <tr class="border-b border-glass-border/50">
            <th class="py-3 px-3"></th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">总数</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">成功</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">失败</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">成功率</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">总数</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">成功</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">失败</th>
            <th class="text-center py-3 px-3 text-text-secondary text-sm">成功率</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(row, index) in sortedTableData" 
            :key="row.hour"
            class="border-b border-glass-border/50 hover:bg-glass-bg/30 transition-colors"
            :class="{ 'bg-primary-green/10': index === 0 && sortOrder === 'desc' }"
          >
            <!-- 时间段 -->
            <td class="py-4 px-3 font-mono text-sm font-medium">{{ row.hour }}</td>
            
            <!-- 空投任务数据 -->
            <td class="py-4 px-3 text-center text-sm">{{ row.airdrop.total.toLocaleString() }}</td>
            <td class="py-4 px-3 text-center text-sm text-primary-green">{{ row.airdrop.success.toLocaleString() }}</td>
            <td class="py-4 px-3 text-center text-sm text-red-400">{{ row.airdrop.failed.toLocaleString() }}</td>
            <!-- <td class="py-4 px-3 text-center">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-sm" :class="getSuccessRateColor(row.airdrop.total, row.airdrop.success)">
                  {{ calculateSuccessRate(row.airdrop.total, row.airdrop.success) }}%
                </span>
                <div class="w-12 bg-glass-bg rounded-full h-1.5 overflow-hidden">
                  <div 
                    class="h-full bg-primary-green transition-all duration-300"
                    :style="{ width: calculateSuccessRate(row.airdrop.total, row.airdrop.success) + '%' }"
                  ></div>
                </div>
              </div>
            </td> -->
            
            <!-- 充值任务数据 -->
            <td class="py-4 px-3 text-center text-sm">{{ row.charge.total.toLocaleString() }}</td>
            <td class="py-4 px-3 text-center text-sm text-primary-green">{{ row.charge.success.toLocaleString() }}</td>
            <td class="py-4 px-3 text-center text-sm text-red-400">{{ row.charge.failed.toLocaleString() }}</td>
            <!-- <td class="py-4 px-3 text-center">
              <div class="flex items-center justify-center space-x-2">
                <span class="text-sm" :class="getSuccessRateColor(row.charge.total, row.charge.success)">
                  {{ calculateSuccessRate(row.charge.total, row.charge.success) }}%
                </span>
                <div class="w-12 bg-glass-bg rounded-full h-1.5 overflow-hidden">
                  <div 
                    class="h-full bg-primary-green transition-all duration-300"
                    :style="{ width: calculateSuccessRate(row.charge.total, row.charge.success) + '%' }"
                  ></div>
                </div>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface HistoryData {
  hour: string
  airdrop: {
    total: number
    success: number
    failed: number
  }
  charge: {
    total: number
    success: number
    failed: number
  }
}

const props = defineProps<{
  airdropData?: any[]
  chargeData?: any[]
}>()

const updateTime = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc') // 默认最新在前

// 生成表格数据
const tableData = computed((): HistoryData[] => {
  const data: HistoryData[] = []
  const now = new Date()
  
  for (let i = 9; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourStr = hour.getHours().toString().padStart(2, '0') + ':00'
    
    // 模拟空投数据
    const airdropVariance = 0.8 + Math.random() * 0.4
    const airdropTotal = Math.floor(100 * airdropVariance / 10)
    const airdropSuccessRate = 0.7 + Math.random() * 0.25
    const airdropSuccess = Math.floor(airdropTotal * airdropSuccessRate)
    
    // 模拟充值数据
    const chargeVariance = 0.8 + Math.random() * 0.4
    const chargeTotal = Math.floor(24 * chargeVariance / 10)
    const chargeSuccessRate = 0.85 + Math.random() * 0.1
    const chargeSuccess = Math.floor(chargeTotal * chargeSuccessRate)
    
    data.push({
      hour: hourStr,
      airdrop: {
        total: airdropTotal,
        success: airdropSuccess,
        failed: airdropTotal - airdropSuccess
      },
      charge: {
        total: chargeTotal,
        success: chargeSuccess,
        failed: chargeTotal - chargeSuccess
      }
    })
  }
  
  return data
})

// 排序后的表格数据
const sortedTableData = computed(() => {
  const data = [...tableData.value]
  
  if (sortOrder.value === 'desc') {
    // 最新时间在前（降序）
    return data.sort((a, b) => b.hour.localeCompare(a.hour))
  } else {
    // 最旧时间在前（升序）
    return data.sort((a, b) => a.hour.localeCompare(b.hour))
  }
})

const calculateSuccessRate = (total: number, success: number): number => {
  if (total === 0) return 0
  return +((success / total) * 100).toFixed(1)
}

const getSuccessRateColor = (total: number, success: number) => {
  const rate = calculateSuccessRate(total, success)
  if (rate >= 95) return 'text-primary-green'
  if (rate >= 85) return 'text-yellow-400'
  return 'text-red-400'
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

onMounted(() => {
  const updateCurrentTime = () => {
    updateTime.value = new Date().toLocaleString('zh-CN')
  }
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
})
</script>
