import {clamp, raf, lerp, resize} from '@emotionagency/utils'

import {mousedown, mousemove, mouseup} from './events/mouseevents'

export class Slider {
  startX = 0
  endX = 0

  currentX = 0
  lastX = 0

  min = 0
  max = 0

  offsetValue = 0

  ease = 0
  speed = 0
  offset = 0
  velocity = 0

  constructor(opts = {}) {
    this.opts = {
      el: opts.el ?? '.js-slider',
      ease: opts.ease ?? 0.1,
      speed: opts.speed ?? 1.5,
      offset: opts.offset ?? 220,
      velocity: opts.velocity ?? 25,
      breakpoint: opts.breakpoint ?? 1024,
      mobile: {
        ease: opts?.mobile?.ease ?? 0.1,
        speed: opts?.mobile?.speed ?? 1.5,
        offset: opts?.mobile?.offset ?? 80,
        velocity: opts?.mobile?.velocity ?? 12,
      },
    }

    this.slider = document.querySelector(this.opts.el)
    this.sliderInner = this.slider.querySelector('.js-slider__inner')
    this.slides = [...this.slider.querySelectorAll('.js-slide')]
  }

  bounds() {
    const methods = [
      'onMousemove',
      'onMousedown',
      'onMouseup',
      'animate',
      'resize',
    ]

    methods.forEach(fn => {
      this[fn] = this[fn].bind(this)
    })
  }

  init() {
    this.bounds()

    mousedown.on(this.slider, this.onMousedown)
    mouseup.on(document.body, this.onMouseup)

    this.setSizes()

    raf.on(this.animate)
    resize.on(this.resize)
  }

  get sizes() {
    return this.slider.getBoundingClientRect()
  }

  setSizes() {
    const sliderWidth = this.slider.scrollWidth + this.sizes.left
    this.min = 0
    this.max = -(sliderWidth - window.innerWidth)
  }

  onMousemove(e) {
    const left = e.clientX

    this.currentX = this.endX + (left - this.startX) * this.speed
    this.currentX = clamp(
      this.currentX,
      this.min + this.offsetValue,
      this.max - this.offsetValue
    )
  }

  onMousedown(e) {
    mousemove.on(document.body, this.onMousemove, {
      passive: true,
    })

    this.startX = e.clientX

    this.slider.classList.add('is-grabbing')

    this.slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(${-16 * idx}px)`
    })

    this.offsetValue += this.offset
    this.currentX = clamp(this.currentX, this.min, this.max)
  }

  onMouseup() {
    this.offsetValue = 0
    this.currentX = clamp(this.currentX, this.min, this.max)

    mousemove.off(document.body, this.onMousemove)

    this.slides.forEach((slide, idx) => {
      slide.style.transform = 'translateX(0px)'
    })

    this.endX = this.currentX
    this.slider.classList.remove('is-grabbing')
  }

  resize() {
    const params = ['ease', 'speed', 'offset', 'velocity']

    params.forEach(p => {
      this[p] =
        screen.width > this.opts.breakpoint ? this.opts[p] : this.opts.mobile[p]
    })

    this.setSizes()
  }

  animate() {
    this.lastX = lerp(this.lastX, this.currentX, this.ease)
    this.lastX = Math.floor(this.lastX * 100) / 100

    const sd = this.currentX - this.lastX
    const acc = sd / window.innerWidth
    const velo = +acc

    this.sliderInner.style.transform = `translate3d(${
      this.lastX
    }px, 0, 0) skewX(${velo * this.velocity}deg)`
  }

  destroy() {
    mousedown.off(this.slider, this.onMousedown)
    mouseup.off(document.body, this.onMouseup)
    mousemove.off(document.body, this.onMousemove)

    raf.off(this.animate)
    resize.off(this.resize)
  }
}
