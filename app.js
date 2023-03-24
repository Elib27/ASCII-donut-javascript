// Donut Javascript Code inspired from https://www.a1k0n.net/2006/09/15/obfuscated-c-donut.html

const renderContainer = document.querySelector('.render-container')

let timer = Date.now()

let counter = 0;

function donutAnimation() {
  const diff = Date.now() - timer
  timer = Date.now()
  counter++;
  if (counter > 10) {
    const fps = Math.round((1 / (diff / 1000))).toString() + ' FPS'
    renderContainer.innerHTML = fps
    counter = 0;
  }
  requestAnimationFrame(donutAnimation)
}

requestAnimationFrame(donutAnimation)