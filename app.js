// Donut Javascript Code inspired from https://www.a1k0n.net/2006/09/15/obfuscated-c-donut.html


const screen_size = 100 // height and width of projection screen

const R1 = 1 // radius of the tube (tore) 
const R2 = 2 // radius of the tore minus 2*R1
const K2 = 6 // distance between the projection screen and the tore
const K1 = screen_size * K2 * 3 / (8 * (R1 + R2)) // distance between the camera and the projection screen

const THETA_STEP = 0.2
const PHI_STEP = 0.1

const canvas = document.querySelector("#render-canvas");
const ctx = canvas.getContext("2d");
ctx.font = '12px monospace';


function animateDonut(A, B) {
  
  const output = Array(screen_size).fill(Array(screen_size).fill(' '))
  const zBuffer = Array(screen_size).fill(Array(screen_size).fill(0))

  const cosA = Math.cos(A)
  const sinA = Math.sin(A)
  const cosB = Math.cos(B)
  const sinB = Math.sin(B)
  for (let theta = 0; theta < 2 * Math.PI; theta += THETA_STEP)
  {
    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)
    for (let phi = 0; phi < 2 * Math.PI ; phi += PHI_STEP)
    {
      const cosPhi = Math.cos(phi)
      const sinPhi = Math.sin(phi)
      // point X(x,y,z) of the tore
      const x = (R2 + R1*cosTheta)*(cosB*cosPhi + sinA*sinB*sinPhi) - R1*cosA*sinB*sinTheta
      const y = (R2 + R1*cosTheta)*(cosPhi*sinB - cosB*sinA*sinPhi) + R1*cosA*cosB*sinTheta
      const z = K2 + cosA*(R2 + R1*cosTheta)*sinPhi + R1*sinA*sinTheta

      // screen projection
      const xProj = Math.round(screen_size / 2 + K1 * x / z)
      const yProj = Math.round(screen_size / 2 - K1 * y / z)

      // Luminance with light vector: (0, 1, -1)
      const L = cosPhi*cosTheta*sinB - cosA*cosTheta*sinPhi - sinA*sinTheta + cosB*(cosA*sinTheta - cosTheta*sinA*sinPhi)
      if (L < 0) continue

      // Z-buffer
      if (1/z < zBuffer[yProj][xProj]) continue

      zBuffer[yProj][xProj] = 1/z
      const luminanceIndex = Math.round(L*8) 
      output[yProj][xProj] = ".,-~:;=!*#$@"[luminanceIndex]
    }
  }

  // Draw in the canvas
  // for (let i = 0; i < screen_size; i++)
  // {
  //   console.log(output[i].join(''))
  // }
  console.log(output)
}



let i = 0

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animateDonut(i, i/2)
  i+=0.05
}, 1000/1)