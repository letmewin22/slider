import {CustomMouseEvent} from './CustomMouseEvent'

const returnData = instance => {
  return {
    on: (target, cb, opts) => instance.on(target, cb, opts),
    off: (target, cb) => instance.off(target, cb),
  }
}

const mousedownInstance = new CustomMouseEvent(['mousedown', 'touchstart'])
export const mousedown = returnData(mousedownInstance)

const mousemoveInstance = new CustomMouseEvent(['mousemove', 'touchmove'])
export const mousemove = returnData(mousemoveInstance)

const mouseupInstance = new CustomMouseEvent([
  'mouseup',
  'touchend',
  'touchcancel',
])
export const mouseup = returnData(mouseupInstance)
