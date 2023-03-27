// ASCII Donut Javascript Code inspired from https://www.a1k0n.net/2006/09/15/obfuscated-c-donut.html

const screen_size = 50 // height and width of projection screen

const R1 = 1 // radius of the tube (tore) 
const R2 = 2 // radius of the tore (minus 2*R1)
const Zoff = 6 // distance between the projection screen and the tore
const K1 = screen_size * Zoff * 3 / (8 * (R1 + R2)) // distance between the camera and the projection screen

const THETA_STEP = 0.02
const PHI_STEP = 0.01

const renderContainer = document.querySelector("#render-div")

function animateDonut(A, B) {

  const output = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => '&nbsp;'))
  const zBuffer = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => 0))

  const cosA = Math.cos(A)
  const sinA = Math.sin(A)
  const cosB = Math.cos(B)
  const sinB = Math.sin(B)

  for (let theta = 0; theta < 2 * Math.PI; theta += THETA_STEP) {
    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)
    for (let phi = 0; phi < 2 * Math.PI ; phi += PHI_STEP) {
      const cosPhi = Math.cos(phi)
      const sinPhi = Math.sin(phi)

      // point of the tore
      const x = (R2 + R1*cosTheta)*(cosB*cosPhi + sinA*sinB*sinPhi) - R1*cosA*sinB*sinTheta
      const y = (R2 + R1*cosTheta)*(cosPhi*sinB - cosB*sinA*sinPhi) + R1*cosA*cosB*sinTheta
      const z = Zoff + cosA*(R2 + R1*cosTheta)*sinPhi + R1*sinA*sinTheta

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
  // Print ASCII in the DOM
  let ASCII_result = ""
  for (let i = 0; i < screen_size ; i++) {
    ASCII_result += output[i].join('') + "<br>"
  }
  renderContainer.innerHTML = ASCII_result
}

const CUBE_SIZE = 4
const CUBE_STEP = 0.1

function animateCube(A, B) {

  const output = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => '&nbsp;'))
  const zBuffer = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => 0))

  const cosA = Math.cos(A)
  const sinA = Math.sin(A)
  const cosB = Math.cos(B)
  const sinB = Math.sin(B)
  
  for (let Xaxis = -CUBE_SIZE / 2; Xaxis <= CUBE_SIZE / 2; Xaxis += CUBE_STEP) {
    for (let Yaxis = -CUBE_SIZE / 2; Yaxis <= CUBE_SIZE / 2; Yaxis += CUBE_STEP) {
      for (let Zaxis = -CUBE_SIZE / 2; Zaxis <= CUBE_SIZE / 2; Zaxis += CUBE_STEP){
        
        // const onCubeFace = (Math.abs(Xaxis) === CUBE_SIZE / 2) || (Math.abs(Yaxis) === CUBE_SIZE / 2) || (Math.abs(Zaxis) === CUBE_SIZE / 2)
        // if (!onCubeFace) continue
        // point of the cube
        // const x = cosB*Xaxis + sinB*Yaxis
        // const y = -cosA*sinB*Xaxis + cosA*cosB*Yaxis + sinA*Zaxis
        // const z = Zoff + sinA*sinB*Xaxis - cosB*sinA*Yaxis + cosA*Zaxis
        const x = Xaxis
        const y = cosA*Yaxis + sinA*Zaxis
        const z = Zoff - sinA*Yaxis + cosA*Zaxis

        // screen projection
        const xProj = Math.round(screen_size / 2 + K1 * x / z)
        const yProj = Math.round(screen_size / 2 - K1 * y / z)

        // Luminance with light vector: (0, 1, -1)
        let L = 0
        if (Math.abs(Xaxis) === CUBE_SIZE / 2)
          L = 0
        else if (Math.abs(Yaxis) === CUBE_SIZE / 2)
          L = cosA
        else
          L = -sinA

        if (L < 0) continue

        // Z-buffer
        if (1/z < zBuffer[yProj][xProj]) continue
        zBuffer[yProj][xProj] = 1/z
        const luminanceIndex = Math.round(L*8) 
        output[yProj][xProj] = ".,-~:;=!*#$@"[luminanceIndex]
      }
    }
  }
  // Print ASCII in the DOM
  let ASCII_result = ""
  for (let i = 0; i < screen_size ; i++) {
    ASCII_result += output[i].join('') + "<br>"
  }
  renderContainer.innerHTML = ASCII_result
}


// Launch Animation
let animProgress = 0
const STEP = 0.05
const frequency = 25

setInterval(() => {
  animateDonut(animProgress, animProgress/2)
  // animateCube(animProgress, animProgress/2)
  animProgress += STEP
}, 1000/frequency)