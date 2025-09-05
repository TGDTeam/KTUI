<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div 
      v-for="(metric, index) in metrics" 
      :key="index"
      class="glass-card p-6 transition-all duration-200 hover:neon-glow"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400 mb-1">{{ metric.label }}</p>
          <p :class="['text-2xl font-bold', metric.color]">
            {{ formatValue(metric.value, metric.type) }}
          </p>
        </div>
        <div :class="['p-3 rounded-lg', metric.bgColor]">
          <component :is="metric.icon" class="w-6 h-6" />
        </div>
      </div>
      
      <div v-if="metric.progress !== undefined" class="mt-4">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span>进度</span>
          <span>{{ metric.progress }}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :style="{ 
              width: `${metric.progress}%`,
              background: metric.progressColor || 'var(--neon-green)'
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  QueueListIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CurrencyDollarIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      totalTasks: 0,
      successTasks: 0,
      failedTasks: 0,
      totalGasFee: 0,
      chargeSuccessBatches: 0,
      chargeFailedBatches: 0,
      chargeGasFee: 0
    })
  }
})

const metrics = computed(() => [
  {
    label: '收到任务总数',
    value: props.data.totalTasks,
    type: 'number',
    color: 'neon-text',
    bgColor: 'bg-green-500/20',
    icon: QueueListIcon,
    progress: props.data.totalTasks > 0 ? 
      ((props.data.successTasks + props.data.failedTasks) / props.data.totalTasks * 100) : 0
  },
  {
    label: '成功任务总数',
    value: props.data.successTasks,
    type: 'number',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircleIcon
  },
  {
    label: '失败任务总数',
    value: props.data.failedTasks,
    type: 'number',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: XCircleIcon
  },
  {
    label: '消耗手续费总额',
    value: props.data.totalGasFee,
    type: 'currency',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: CurrencyDollarIcon
  },
  {
    label: '充值成功总批数',
    value: props.data.chargeSuccessBatches,
    type: 'number',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: ArrowUpCircleIcon
  },
  {
    label: '充值失败总批数',
    value: props.data.chargeFailedBatches,
    type: 'number',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: ArrowDownCircleIcon
  }
])

const formatValue = (value, type) => {
  if (type === 'currency') {
    return `${Number(value).toFixed(4)} ETH`
  }
  return Number(value).toLocaleString()
}
</script>
