import { type Renderable } from 'pixi.js'
import { type Ref } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'

export type Use<T> = (t: T) => void

export type Uses<T> = Use<T> | Array<Use<T>>

export interface CommonProps<Component = Renderable, Data = object> {
  children?: JSX.Element
  uses?: Uses<Component & Data>
  as?: Component
  ref?: Ref<Component & Data>
}

export const CommonPropKeys: (keyof CommonProps<Renderable>)[] = ['children', 'uses', 'as', 'ref']
