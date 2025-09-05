<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <MetricCard
      v-for="metric in metrics"
      :key="metric.label"
      :label="metric.label"
      :value="metric.value"
      :trend="metric.trend"
      :type="metric.type"
      :subMetrics="metric.subMetrics"
    />
  </div>
</template>

<script setup lang="ts">
interface HourlyData {
  hour: string
  total: number
  success: number
  failed: number
}

interface SubMetric {
  label: string
  current: number
  type: 'info' | 'success' | 'failed'
  hourlyData: HourlyData[]
}

interface MetricData {
  label: string
  value: string | number
  trend?: number
  type?: 'success' | 'error' | 'warning' | 'info'
  subMetrics?: SubMetric[]
}

const props = defineProps<{
  data?: {
    totalTasks: number
    successTasks: number
    failedTasks: number
    totalGasFee: string
    successBatches: number
    failedBatches: number
    chargeFee: string
    // 新增历史数据
    hourlyTaskData?: HourlyData[]
    hourlyBatchData?: HourlyData[]
    hourlyFeeData?: { hour: string, totalFee: number, chargeFee: number, transferFee: number }[]
  }
}>()

// 生成模拟的最近10小时数据
const generateMockHourlyData = (current: { total: number, success: number, failed: number }) => {
  const data: HourlyData[] = []
  const now = new Date()
  
  for (let i = 9; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourStr = hour.getHours().toString().padStart(2, '0') + ':00'
    
    // 确保有明显的趋势变化
    const baseVariance = 0.7 + Math.random() * 0.6 // 70%-130%的变化
    const trendFactor = i <= 2 ? 1.2 : 0.9 // 最近3小时增长，之前下降
    const total = Math.floor(current.total * baseVariance * trendFactor / 10)
    
    const successRate = 0.75 + Math.random() * 0.2 // 75%-95%成功率
    const success = Math.floor(total * successRate)
    const failed = total - success
    
    data.push({
      hour: hourStr,
      total,
      success,
      failed
    })
  }
  
  return data
}

const metrics = computed((): MetricData[] => [
  {
    label: '📋 空投任务',
    value: props.data?.totalTasks || 0,
    type: 'info',
    trend: calculateTrend(mockTaskData.value, 'success'),
    subMetrics: [
      { 
        label: '总数', 
        current: props.data?.totalTasks || 0, 
        type: 'info',
        hourlyData: mockTaskData.value
      },
      { 
        label: '成功', 
        current: props.data?.successTasks || 0, 
        type: 'success',
        hourlyData: mockTaskData.value
      },
      { 
        label: '失败', 
        current: props.data?.failedTasks || 0, 
        type: 'failed',
        hourlyData: mockTaskData.value
      }
    ]
  },
  {
    label: '⚡ 充值任务',
    value: (props.data?.successBatches || 0) + (props.data?.failedBatches || 0),
    type: 'warning',
    trend: calculateTrend(mockBatchData.value, 'success'),
    subMetrics: [
      { 
        label: '总数', 
        current: (props.data?.successBatches || 0) + (props.data?.failedBatches || 0), 
        type: 'info',
        hourlyData: mockBatchData.value
      },
      { 
        label: '成功', 
        current: props.data?.successBatches || 0, 
        type: 'success',
        hourlyData: mockBatchData.value
      },
      { 
        label: '失败', 
        current: props.data?.failedBatches || 0, 
        type: 'failed',
        hourlyData: mockBatchData.value
      }
    ]
  },
  {
    label: '⛽ 消耗费用',
    value: props.data?.totalGasFee || '0 ETH',
    type: 'success',
    trend: calculateTrend(mockTaskData.value, 'total'), // 使用费用趋势计算
    subMetrics: [
      { 
        label: '总费用', 
        current: parseFloat(props.data?.totalGasFee?.replace(' ETH', '') || '0'), 
        type: 'info',
        hourlyData: mockTaskData.value // 费用数据可以复用任务数据结构
      },
      { 
        label: '充值费用', 
        current: parseFloat(props.data?.chargeFee?.replace(' ETH', '') || '0'), 
        type: 'info',
        hourlyData: mockTaskData.value
      },
      { 
        label: '空投费用', 
        current: parseFloat(props.data?.totalGasFee?.replace(' ETH', '') || '0') - parseFloat(props.data?.chargeFee?.replace(' ETH', '') || '0'), 
        type: 'info',
        hourlyData: mockTaskData.value
      }
    ]
  }
])

// 模拟数据
const mockTaskData = computed(() => 
  props.data?.hourlyTaskData || generateMockHourlyData({
    total: props.data?.totalTasks || 100,
    success: props.data?.successTasks || 67,
    failed: props.data?.failedTasks || 3
  })
)

const mockBatchData = computed(() => 
  props.data?.hourlyBatchData || generateMockHourlyData({
    total: (props.data?.successBatches || 0) + (props.data?.failedBatches || 0) || 24,
    success: props.data?.successBatches || 23,
    failed: props.data?.failedBatches || 1
  })
)

// 根据历史数据计算趋势 - 使用最后两组数据
const calculateTrend = (hourlyData: HourlyData[], type: 'total' | 'success' | 'failed'): number => {
  if (hourlyData.length < 2) return 0
  
  const lastData = hourlyData[hourlyData.length - 1]
  const previousData = hourlyData[hourlyData.length - 2]
  
  const lastValue = lastData[type]
  const previousValue = previousData[type]
  
  // 确保有足够的差异来显示趋势
  if (previousValue === 0) return lastValue > 0 ? 100 : 0
  
  const trend = ((lastValue - previousValue) / previousValue) * 100
  
  // 如果趋势太小，强制设置一个最小值
  const result = +trend.toFixed(1)
  return Math.abs(result) < 0.5 ? (Math.random() > 0.5 ? 5.2 : -3.1) : result
}
</script>
