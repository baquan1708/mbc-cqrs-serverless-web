export interface TaskEntity {
  source?: string
  isDeleted?: boolean
  status?: string
  requestId?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: string
  createdIp?: string
  updatedIp?: string
  pk: string
  sk: string
  id: string
  code: string
  name: string
  version: number
  tenantCode: string
  type: string
  seq?: number
  ttl?: number
  input: Record<string, any>
  attributes?: {
    result?: any
    error?: any
    subTaskCount?: number
    subTaskFailedCount?: number
    subTaskRunningCount?: number
    subTaskSucceedCount?: number
    subTasks?: any
  }
}
