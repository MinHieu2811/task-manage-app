export type INotiType =
  | 'is-primary'
  | 'is-link'
  | 'is-info'
  | 'is-success'
  | 'is-warning'
  | 'is-danger'
  | 'is-orange'
  | ''

export interface INotiOptions {
  title?: string
  content: string
  removable?: boolean
  timeout?: number
  type?: INotiType
  id?: number
  typeAni?: string
}

export interface INotiStateItem extends INotiOptions {
  id: number
}

export const ADD = 'ADD'
export const REMOVE = 'REMOVE'
export const REMOVE_ALL = 'REMOVE_ALL'
export const REMOVE_ALL_AND_ADD = 'REMOVE_ALL_AND_ADD'

export type NotiAction =
  | { type: 'ADD'; payload: INotiOptions }
  | { type: 'REMOVE'; payload: { id: number } }
  | { type: 'REMOVE_ALL' }
  | { type: 'REMOVE_ALL_AND_ADD'; payload: INotiOptions }
