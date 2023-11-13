import { Text as pxText, TextOptions, TextString } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps } from './interfaces'
import { useParent } from './ParentContext'

export type ExtendedText<Data extends object> = pxText & Data
export type TextProps<Data extends object> = Omit<CommonProps<ExtendedText<Data>>, 'children'> &
  Omit<TextOptions, 'text' | 'children'> &
  Events &
  Data & {
    children: TextString
  }

export function Text<Data extends object = object>(props: TextProps<Data>) {
  let text: ExtendedText<Data>
  const [ours, events, pixis] = splitProps(props, CommonPropKeys.concat('children'), EventTypes)

  if (ours.as) {
    text = ours.as
  } else {
    text = new pxText(pixis) as ExtendedText<Data>
  }

  createEffect(() => {
    text.text = ours.children
  })

  createEffect(() => {
    for (const prop in pixis) {
      console.log(prop)
      ;(text as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      text.on(event, handler)
      return () => text.off(event, handler)
    })

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup()
      }
    })
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.uses
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = untrack(() => uses.map(fn => fn(text)))
      } else {
        cleanups = untrack(() => [uses(text)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(text)
  onCleanup(() => {
    parent?.removeChild(text)
  })

  return null
}
