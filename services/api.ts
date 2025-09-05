export type Account = {
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

export const fetchMetrics = (): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalTasks: 100,
        successTasks: 67,
        failedTasks: 3,
        totalGasFee: '2.456 ETH',
        successBatches: 23,
        failedBatches: 1,
        chargeFee: '1.234 ETH',
        hourlyTaskData: Array.from({ length: 10 }).map((_, i) => ({
          hour: `${String((new Date().getHours() - (9 - i) + 24) % 24).padStart(2, '0')}:00`,
          total: Math.floor(50 + Math.random() * 150),
          success: Math.floor(40 + Math.random() * 80),
          failed: Math.floor(Math.random() * 10)
        }))
      })
    }, 600)
  })
}

export const fetchAccounts = (): Promise<Account[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          address: '0x742d35Cc6634C0532925a3b8D097C25c',
          nonce: 42,
          balance: '2.5432',
          chargeTime: 1250,
          batchCount: 5,
          successCount: 23,
          failedCount: 1,
          status: 'charging',
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
          status: 'idle'
        }
      ])
    }, 500)
  })
}

export const fetchHistory = (): Promise<{ hours: string[], statsData: Record<string, number[]> }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const hours: string[] = []
      const now = new Date()
      for (let i = 0; i < 10; i++) {
        const h = new Date(now.getTime() - (9 - i) * 60 * 60 * 1000)
        hours.push(h.getHours().toString().padStart(2, '0') + ':00')
      }

      const makeNumber = () => Math.floor(50 + Math.random() * 150)
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

      for (let i = 0; i < 10; i++) {
        const total = makeNumber()
        const success = Math.floor(total * (0.7 + Math.random() * 0.25))
        const failed = total - success
        const received = Math.min(total + Math.floor(Math.random() * 20), total + 20)
        dataMap.received.push(received)
        dataMap.filtered.push(Math.floor(received * (0.02 + Math.random() * 0.08)))
        dataMap.filteredAddress.push(Math.floor(received * (Math.random() * 0.03)))
        dataMap.duplicate.push(Math.floor(received * (Math.random() * 0.04)))
        dataMap.retry.push(Math.floor(received * (Math.random() * 0.03)))
        dataMap.total.push(total)
        dataMap.success.push(success)
        dataMap.failed.push(failed)
      }

      resolve({ hours, statsData: dataMap })
    }, 700)
  })
}

export const fetchLogs = (): Promise<{ id: string, timestamp: string, level: string, message: string }[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: '1', timestamp: '14:32:15', level: 'INFO', message: '任务开始: 收到 100 个空投任务' },
        { id: '2', timestamp: '14:32:16', level: 'INFO', message: '账号 0x742d...25c 开始充值，分配 10 个任务' },
        { id: '3', timestamp: '14:32:18', level: 'WARN', message: '账号 0x8ba1...36c Gas Price 过高: 120 Gwei' },
        { id: '4', timestamp: '14:32:20', level: 'ERROR', message: '交易失败: 0x1234...abcd insufficient funds' }
      ])
    }, 300)
  })
}