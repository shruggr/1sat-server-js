export interface BalanceUpdate {
    tick?: string,
    id?: string,
    fundTotal: number,
    pendingOps: number,
    pending: string,
    fundUsed: number,
  }