<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold gradient-text">实时日志</h2>
      <div class="flex items-center space-x-4">
        <select 
          v-model="selectedLevel" 
          class="bg-glass-bg border border-glass-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary-green"
        >
          <option value="ALL">全部</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>
        
        <input 
          v-model="searchKeyword"
          placeholder="搜索关键字..."
          class="bg-glass-bg border border-glass-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary-green w-40"
        >
        
        <button 
          @click="clearLogs"
          class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
        >
          清除
        </button>
        
        <button 
          @click="exportLogs"
          class="px-3 py-1 bg-primary-green/20 text-primary-green rounded-lg hover:bg-primary-green/30 transition-colors text-sm"
        >
          导出
        </button>
      </div>
    </div>
    
    <div class="bg-black/30 rounded-lg p-4 h-96 overflow-y-auto scrollbar-custom font-mono text-sm">
      <div 
        v-for="log in filteredLogs" 
        :key="log.id"
        class="mb-2 flex items-start space-x-3 hover:bg-glass-bg/30 p-1 rounded transition-colors"
      >
        <span class="text-text-secondary text-xs whitespace-nowrap">{{ log.timestamp }}</span>
        <span 
          class="text-xs font-semibold px-2 py-0.5 rounded uppercase whitespace-nowrap"
          :class="getLevelClass(log.level)"
        >
          {{ log.level }}
        </span>
        <span class="text-text-primary leading-relaxed">{{ log.message }}</span>
      </div>
      
      <div v-if="filteredLogs.length === 0" class="text-center text-text-secondary py-8">
        暂无日志数据
      </div>
    </div>
    
    <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
      <span>共 {{ logs.length }} 条日志</span>
      <span>自动清除策略: 保留最近 5000 条</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface LogEntry {
  id: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
}

const props = defineProps<{
  initialLogs?: LogEntry[]
}>()

const selectedLevel = ref('ALL')
const searchKeyword = ref('')

const logs = ref<LogEntry[]>(props.initialLogs ? [...props.initialLogs] : [])

const filteredLogs = computed(() => {
  let filtered = logs.value

  if (selectedLevel.value !== 'ALL') {
    filtered = filtered.filter(log => log.level === selectedLevel.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(log => 
      log.message.toLowerCase().includes(keyword)
    )
  }

  return filtered.slice(-100)
})

const getLevelClass = (level: string) => {
  const classes = {
    INFO: 'bg-blue-500/20 text-blue-400',
    WARN: 'bg-yellow-500/20 text-yellow-400',
    ERROR: 'bg-red-500/20 text-red-400'
  }
  return classes[level as keyof typeof classes]
}

const clearLogs = () => {
  logs.value = []
}

const exportLogs = () => {
  const content = filteredLogs.value
    .map(log => `${log.timestamp} [${log.level}] ${log.message}`)
    .join('\n')
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logs-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)] as LogEntry['level'],
      message: `模拟日志消息 ${Math.random().toString(36).substr(2, 9)}`
    }
    
    logs.value.push(newLog)
    
    // 保持最大5000条日志
    if (logs.value.length > 5000) {
      logs.value = logs.value.slice(-5000)
    }
  }, 3000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>