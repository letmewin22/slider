export class CustomMouseEvent {
  constructor(events) {
    this.event = this.event.bind(this)

    this.events = events
  }

  on(target, cb, opts) {
    this.events.forEach(event => {
      target.addEventListener(event, this.event, opts)
    })

    this.cb = cb
  }

  off(target, cb) {
    this.events.forEach(event => {
      target.removeEventListener(event, this.event)
    })
  }

  event(e) {
    const isTouch = !!e.changedTouches?.length

    const clientX = !isTouch ? e.clientX : e.changedTouches[0].clientX

    const event = {originalEvent: e, clientX}
    this.cb(event)
  }
}
