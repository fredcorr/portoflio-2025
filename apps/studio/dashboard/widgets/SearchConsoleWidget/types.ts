export interface GSCTotals {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCQueryRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCTrendPoint {
  date: string
  clicks: number
}

export interface GSCData {
  period: { startDate: string; endDate: string }
  totals: GSCTotals
  topQueries: GSCQueryRow[]
  clickTrend: GSCTrendPoint[]
}

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }

// Internal shape returned by the GSC searchanalytics.query endpoint
export interface GSCApiRow {
  keys?: string[]
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}
