// Donut Javascript Code inspired from https://www.a1k0n.net/2006/09/15/obfuscated-c-donut.html

const screen_width = 400

const R1 = 1 // radius of the tube (tore) 
const R2 = 2 // radius of the thore
const K2 = 15 // distance between the projection screen and the tore
const K1 = screen_width * K2 * 3 / (8 * (R1 + R2)) // distance between the camera and the projection screen

const THETA_STEP = 0.2
const PHI_STEP = 0.1

const renderCanvas = document.querySelector("#render-canvas");
const ctx = renderCanvas.getContext("2d");
ctx.font = '12px monospace';


function animateDonut() {
  for (let theta = 0; theta < 2 * Math.PI; theta += THETA_STEP)
  {
    for (let phi = 0; phi < 2 * Math.PI ; phi += PHI_STEP)
    {
      // point X(x,y,z) of the tore
      const x = (R2 + R1 * Math.cos(theta)) * Math.cos(phi)
      const y = R1 * Math.sin(theta)
      const z = -(R2 + R1 * Math.cos(theta) * Math.sin(phi))

      // screen projection
      const xProj = Math.round(K1 * x / (K2 + z))
      const yProj = Math.round(K1 * y / (K2 + z))

      // Luminance with light vector: (0, 1, -1)
      const L = Math.sin(theta)

      if (L < 0) continue
      ctx.fillText('.', 200 + xProj, 200 + yProj);
      console.log(xProj, yProj)
      // ctx.fillStyle = `rgba(${255 * L},${255 * L},${255 * L})`;
      ctx.fillStyle = ('white')
    }
  }
}

animateDonut()
