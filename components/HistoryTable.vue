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
      <table class="w-full min-w-[800px]">
        <thead>
          <tr class="border-b border-glass-border">
            <th class="text-left py-4 px-3 text-text-secondary font-medium">统计类型</th>
            <th 
              v-for="hour in hours" 
              :key="hour" 
              class="text-center py-4 px-3 text-text-secondary font-medium text-sm"
            >
              {{ hour }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="stat in statsList" 
            :key="stat.key"
            class="border-b border-glass-border/50 hover:bg-glass-bg/30 transition-colors"
          >
            <td class="py-3 px-3 font-medium text-sm">{{ stat.label }}</td>
            <td 
              v-for="(val, idx) in statsData[stat.key]" 
              :key="stat.key + '-' + idx"
              class="py-3 px-3 text-center text-sm"
            >
              {{ val.toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  history?: {
    hours: string[],
    statsData: Record<string, number[]>
  }
}>()

const updateTime = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc') // 默认最新在前

// 统计类型列表（行）
const statsList = [
  { key: 'received', label: '接收空投' },
  { key: 'filtered', label: '过滤空投' },
  { key: 'filteredAddress', label: '过滤地址' },
  { key: 'duplicate', label: '重复空投' },
  { key: 'retry', label: '重试空投' },
  { key: 'total', label: '空投总数' },
  { key: 'success', label: '空投成功' },
  { key: 'failed', label: '空投失败' }
] as const

// 如果 props.history 可用，则直接使用；否则组件内部生成（保持原有行为）
const hoursLatestFirst = computed(() => {
  if (props.history && props.history.hours) {
    // props.history.hours assumed oldest->newest or newest->old? 我们约定 props.hours 为 oldest->newest
    return [...props.history.hours].reverse() // 保持与原组件“最新在前”的习惯
  }

  const arr: string[] = []
  const now = new Date()
  for (let i = 0; i < 10; i++) {
    const h = new Date(now.getTime() - i * 60 * 60 * 1000)
    arr.push(h.getHours().toString().padStart(2, '0') + ':00')
  }
  return arr
})

const hours = computed(() => {
  return sortOrder.value === 'desc' ? hoursLatestFirst.value : [...hoursLatestFirst.value].reverse()
})

const basePerHour = computed(() => {
  // 如果有外部数据且包含 statsData，则不再生成随机
  if (props.history && props.history.statsData) {
    // props.history.statsData assumed to be oldest->newest; 需要返回 newest->oldest 与原逻辑一致
    // 我们 reverse arrays to newest-first
    const map = props.history.statsData
    const len = map.total?.length || 10
    const base: any[] = []
    for (let i = 0; i < len; i++) {
      const idx = (map.total.length - 1) - i
      base.push({
        total: map.total[idx] || 0,
        success: map.success ? map.success[idx] || 0 : 0,
        failed: map.failed ? map.failed[idx] || 0 : 0,
        received: map.received ? map.received[idx] || 0 : 0,
        filtered: map.filtered ? map.filtered[idx] || 0 : 0,
        filteredAddress: map.filteredAddress ? map.filteredAddress[idx] || 0 : 0,
        duplicate: map.duplicate ? map.duplicate[idx] || 0 : 0,
        retry: map.retry ? map.retry[idx] || 0 : 0
      })
    }
    return base
  }

  // 生成每小时的基础数据（按最新->最旧顺序生成），保证 total = success + failed，其他项小于 total
  const base: {
    total: number
    success: number
    failed: number
    received: number
    filtered: number
    filteredAddress: number
    duplicate: number
    retry: number
  }[] = []

  for (let i = 0; i < 10; i++) {
    // 生成一个相对稳定的基数并加点随机
    const baseScale = 50 + Math.floor(Math.random() * 150) // 50 ~ 199
    const total = Math.max(0, baseScale)
    const success = Math.floor(total * (0.7 + Math.random() * 0.25)) // 70% ~ 95%
    const failed = total - success

    const received = Math.min(total + Math.floor(Math.random() * 20), total + 20)
    // 保证其他统计项不会超过 received 或 total
    const filtered = Math.floor(received * (0.02 + Math.random() * 0.08)) // 2% ~ 10%
    const filteredAddress = Math.floor(received * (0.0 + Math.random() * 0.03)) // 0% ~ 3%
    const duplicate = Math.floor(received * (0.0 + Math.random() * 0.04)) // 0% ~ 4%
    const retry = Math.floor(received * (0.0 + Math.random() * 0.03)) // 0% ~ 3%

    base.push({ total, success, failed, received, filtered, filteredAddress, duplicate, retry })
  }

  // base currently newest->oldest (index 0 is最新)
  return base
})

// 按照当前 hours 顺序，构建每个统计类型对应的数组（如果用户选择升序，返回的数据会反转）
const statsData = computed(() => {
  const dataMap: Record<string, number[]> = {
    received: [],
    filtered: [],
    filteredAddress: [],
    duplicate: [],
    retry: [],
    total: [],
    success: [],
    failed: []
  }

  const base = basePerHour.value

  for (let i = 0; i < base.length; i++) {
    const h = base[i]
    dataMap.received.push(h.received)
    dataMap.filtered.push(h.filtered)
    dataMap.filteredAddress.push(h.filteredAddress)
    dataMap.duplicate.push(h.duplicate)
    dataMap.retry.push(h.retry)
    dataMap.total.push(h.total)
    dataMap.success.push(h.success)
    dataMap.failed.push(h.failed)
  }

  if (sortOrder.value === 'asc') {
    for (const k in dataMap) {
      dataMap[k].reverse()
    }
  }

  return dataMap
})

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
