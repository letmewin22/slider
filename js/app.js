import {Slider} from './Slider'
import img from '/img/1.jpg'
// import {Slider} from './ref/Slider2'

window.addEventListener('load', () => {
  const items = document.querySelectorAll('[data-bg]')

  items.forEach(el => {
    const url = el.getAttribute('data-bg')

    el.style.backgroundImage = `url(${img})`
    el.setAttribute('data-bg', url)
  })

  const slider = new Slider()
  slider.init()
})
