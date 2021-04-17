import {CustomMouseEvent} from './CustomMouseEvent'

const mousedownInstance = new CustomMouseEvent(['mousedown', 'touchstart'])

export const mousedown = {
  on: (target, cb, opts) => mousedownInstance.on(target, cb, opts),
  off: (target, cb) => mousedownInstance.off(target, cb),
}

const mousemoveInstance = new CustomMouseEvent(['mousemove', 'touchmove'])

export const mousemove = {
  on: (target, cb, opts) => mousemoveInstance.on(target, cb, opts),
  off: (target, cb) => mousemoveInstance.off(target, cb),
}

const mouseupInstance = new CustomMouseEvent(['mouseup', 'touchend'])

export const mouseup = {
  on: (target, cb, opts) => mouseupInstance.on(target, cb, opts),
  off: (target, cb) => mouseupInstance.off(target, cb),
}
