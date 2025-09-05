<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold gradient-text">充值状态</h2>
      <div class="flex items-center space-x-4">
        <div class="text-sm text-text-secondary">
          活跃账号: <span class="text-primary-green font-medium">{{ activeAccounts }}</span>
        </div>
        <button class="px-4 py-2 bg-primary-green/20 text-primary-green rounded-lg hover:bg-primary-green/30 transition-colors">
          刷新
        </button>
      </div>
    </div>

    <div class="overflow-x-auto scrollbar-custom">
      <table class="w-full min-w-[1200px]">
        <thead>
          <tr class="border-b border-glass-border">
            <th v-for="column in columns" :key="column.key" class="text-left py-4 px-3 text-text-secondary font-medium">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="accounts.length === 0">
            <td colspan="9" class="py-8 text-center text-text-secondary">暂无账号数据</td>
          </tr>

          <tr 
            v-for="(account, index) in accounts" 
            :key="account.id"
            class="border-b border-glass-border/50 hover:bg-glass-bg/50 transition-colors"
          >
            <td class="py-4 px-3">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full mr-3" :class="getStatusColor(account.status)"></div>
                <span class="font-mono text-sm">{{ index + 1 }}</span>
              </div>
            </td>
            <td class="py-4 px-3">
              <div class="font-mono text-sm">{{ formatAddress(account.address) }}</div>
            </td>
            <td class="py-4 px-3">
              <span class="font-mono text-sm">{{ account.nonce }}</span>
            </td>
            <td class="py-4 px-3">
              <div class="font-mono text-sm">{{ account.balance }} ETH</div>
            </td>
            <td class="py-4 px-3">
              <span class="text-sm">{{ account.chargeTime }}ms</span>
            </td>
            <td class="py-4 px-3">
              <span class="text-sm">{{ account.batchCount }}</span>
            </td>
            <td class="py-4 px-3">
              <span class="text-primary-green text-sm">{{ account.successCount }}</span>
            </td>
            <td class="py-4 px-3">
              <span class="text-red-400 text-sm">{{ account.failedCount }}</span>
            </td>
            <td class="py-4 px-3">
              <StatusBadge :status="account.status" :details="account.statusDetails" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

interface Account {
  id: string
  address: string
  nonce: number
  balance: string
  chargeTime: number
  batchCount: number
  successCount: number
  failedCount: number
  status: 'idle' | 'waiting' | 'charging' | 'transferring' | 'error'
  statusDetails?: string
}

const props = defineProps<{
  accounts?: Account[]
}>()

const columns = [
  { key: 'index', label: '序号' },
  { key: 'address', label: '支付账号' },
  { key: 'nonce', label: 'Nonce' },
  { key: 'balance', label: '主网余额' },
  { key: 'chargeTime', label: '充值耗时' },
  { key: 'batchCount', label: '批量次数' },
  { key: 'successCount', label: '充值成功' },
  { key: 'failedCount', label: '充值失败' },
  { key: 'status', label: '当前状态' }
]

const accounts = computed(() => props.accounts || [])

const activeAccounts = computed(() => 
  accounts.value.filter(acc => acc.status !== 'idle').length
)

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getStatusColor = (status: string) => {
  const colors = {
    idle: 'bg-gray-500',
    waiting: 'bg-yellow-500',
    charging: 'bg-primary-green animate-pulse-glow',
    transferring: 'bg-blue-500 animate-pulse-glow',
    error: 'bg-red-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}
</script>