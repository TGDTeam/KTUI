<template>
  <div class="inline-flex items-center">
    <div 
      class="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200"
      :class="badgeClass"
    >
      <div class="flex items-center space-x-2">
        <div class="w-1.5 h-1.5 rounded-full" :class="dotClass"></div>
        <span>{{ statusText }}</span>
      </div>
    </div>
    <div v-if="details" class="ml-2 text-xs text-text-secondary">
      {{ details }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  status: 'idle' | 'waiting' | 'charging' | 'transferring' | 'error'
  details?: string
}

const props = defineProps<Props>()

const statusConfig = {
  idle: {
    text: '空闲',
    badgeClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    dotClass: 'bg-gray-400'
  },
  waiting: {
    text: '等待任务',
    badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    dotClass: 'bg-yellow-400 animate-pulse'
  },
  charging: {
    text: '充值中',
    badgeClass: 'bg-primary-green/20 text-primary-green border-primary-green/30',
    dotClass: 'bg-primary-green animate-pulse-glow'
  },
  transferring: {
    text: '中转中',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400 animate-pulse-glow'
  },
  error: {
    text: '异常',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
    dotClass: 'bg-red-400'
  }
}

const config = computed(() => statusConfig[props.status])
const statusText = computed(() => config.value.text)
const badgeClass = computed(() => config.value.badgeClass)
const dotClass = computed(() => config.value.dotClass)
</script>
