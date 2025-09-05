<template>
  <div 
    class="glass-card p-6 transition-all duration-300 relative overflow-hidden group"
    :class="hoverEffectClass"
  >
    <div 
      class="absolute inset-0 opacity-30 transition-opacity duration-300"
      :class="shimmerEffectClass"
    ></div>
    
    <div class="relative z-10">
      <div class="flex items-center justify-between mb-4">
        <div class="text-2xl">{{ label }}</div>
        <div v-if="trend" class="flex items-center text-sm" :class="trendColor">
          <span class="mr-1">{{ trend > 0 ? '↗' : '↘' }}</span>
          <span>{{ Math.abs(trend) }}%</span>
        </div>
      </div>
      
      <!-- 子指标显示 -->
      <div v-if="subMetrics" class="space-y-2">
        <div 
          v-for="subMetric in subMetrics" 
          :key="subMetric.label"
          class="flex items-center justify-between text-sm"
        >
          <span class="text-text-secondary">{{ subMetric.label }}</span>
          <span :class="getSubMetricColor(subMetric.type)" class="font-medium">
            {{ formatSubMetricValue(subMetric) }}
          </span>
        </div>
      </div>
      
      <!-- <div class="w-full bg-glass-bg rounded-full h-1 overflow-hidden mt-4">
        <div 
          class="h-full bg-gradient-to-r transition-all duration-1000 ease-out"
          :class="progressColor"
          :style="{ width: progressWidth }"
        ></div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
interface SubMetric {
  label: string
  current: number
  type: 'total' | 'success' | 'failed'
  hourlyData: any[]
}

interface Props {
  label: string
  value: string | number
  trend?: number
  type?: 'success' | 'error' | 'warning' | 'info'
  subMetrics?: SubMetric[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const trendColor = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0 ? 'text-primary-green' : 'text-red-400'
})

const progressColor = computed(() => {
  const colors = {
    success: 'from-primary-green to-primary-green-secondary',
    error: 'from-red-500 to-red-400',
    warning: 'from-yellow-500 to-yellow-400',
    info: 'from-blue-500 to-blue-400'
  }
  return colors[props.type]
})

const getSubMetricColor = (type: string) => {
  const colors = {
    total: 'text-text-primary',
    success: 'text-primary-green',
    failed: 'text-red-400'
  }
  return colors[type as keyof typeof colors] || 'text-text-primary'
}

const formatSubMetricValue = (subMetric: SubMetric) => {
  const value = subMetric.current || 0
  
  if (subMetric.label.includes('费用')) {
    return `${value.toFixed(4)} ETH`
  }
  return value.toLocaleString()
}

const progressWidth = computed(() => {
  if (props.subMetrics) {
    const totalMetric = props.subMetrics.find(m => m.type === 'total')
    const successMetric = props.subMetrics.find(m => m.type === 'success')
    if (totalMetric && successMetric && totalMetric.current > 0) {
      return `${(successMetric.current / totalMetric.current) * 100}%`
    }
  }
  return '75%'
})

const showHistoryModal = ref(false)

// 获取历史数据（使用第一个subMetric的hourlyData）
const historyData = computed(() => {
  return props.subMetrics?.[0]?.hourlyData || []
})

// 按时间排序历史数据
const sortedHistoryData = computed(() => {
  return [...historyData.value].sort((a, b) => a.hour.localeCompare(b.hour))
})

// 计算统计信息
const averageSuccessRate = computed(() => {
  if (historyData.value.length === 0) return 0
  const totalRate = historyData.value.reduce((sum, data) => {
    return sum + calculateSuccessRate(data.total, data.success)
  }, 0)
  return (totalRate / historyData.value.length).toFixed(1)
})

const totalProcessed = computed(() => {
  return historyData.value.reduce((sum, data) => sum + data.total, 0)
})

const openHistoryModal = () => {
  showHistoryModal.value = true
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
}

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

const hoverEffectClass = computed(() => {
  if (!props.trend) {
    return 'hover:neon-glow'
  }
  
  if (props.trend > 0) {
    return 'hover:neon-glow-green'
  } else {
    return 'hover:neon-glow-red'
  }
})

const shimmerEffectClass = computed(() => {
  if (!props.trend) {
    return 'loading-shimmer'
  }
  
  if (props.trend > 0) {
    return 'loading-shimmer-green'
  } else {
    return 'loading-shimmer-red'
  }
})
</script>

<style scoped>
.shadow-green-glow {
  box-shadow: 
    0 0 20px rgba(0, 255, 133, 0.4),
    0 0 40px rgba(0, 255, 133, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

.shadow-red-glow {
  box-shadow: 
    0 0 20px rgba(255, 77, 79, 0.4),
    0 0 40px rgba(255, 77, 79, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

.animate-pulse-green {
  animation: pulseGreen 2s ease-in-out infinite;
}

.animate-pulse-red {
  animation: pulseRed 2s ease-in-out infinite;
}

.loading-shimmer-green {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 133, 0.15),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

.loading-shimmer-red {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 77, 79, 0.15),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes pulseGreen {
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(0, 255, 133, 0.4),
      0 0 40px rgba(0, 255, 133, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(0, 255, 133, 0.6),
      0 0 60px rgba(0, 255, 133, 0.3),
      0 8px 32px rgba(0, 0, 0, 0.3);
  }
}

@keyframes pulseRed {
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(255, 77, 79, 0.4),
      0 0 40px rgba(255, 77, 79, 0.2),
      0 8px 32px rgba(0, 0, 0, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(255, 77, 79, 0.6),
      0 0 60px rgba(255, 77, 79, 0.3),
      0 8px 32px rgba(0, 0, 0, 0.3);
  }
}
</style>
