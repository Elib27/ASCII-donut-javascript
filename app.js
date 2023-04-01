// ASCII Donut Javascript Code inspired from https://www.a1k0n.net/2006/09/15/obfuscated-c-donut.html

let screen_size = 50 // height and width of projection screen
let Zoff = 8 // distance between the projection screen and the object

// Torus parameters
const TORE_R1 = 1 // radius of the tube (tore) 
const TORE_R2 = 2 // radius of the tore (minus 2*TORE_R1)
const THETA_STEP = 0.04
const PHI_STEP = 0.01
let K1 = screen_size * Zoff * 3 / (8 * (TORE_R1 + TORE_R2)) // distance between the camera and the projection screen

// Cube parameters
const CUBE_SIZE = 4
const CUBE_STEP = 0.05

// Cone parameters
CONE_HEIGHT = 4
CONE_RADIUS = 2
CONE_ANGLE_STEP = 0.02
CONE_RADIUS_STEP = 0.04
CONE_HEIGHT_STEP = 0.02

const renderContainer = document.querySelector("#render-div")
const shapeInputs = document.querySelectorAll('input[name="shape"]')
const sizeRange = document.querySelector('input[name="size"]')
const zoffsetRange = document.querySelector('input[name="zoffset"]')
const xrotationRange = document.querySelector('input[name="xrotation"]')
const zrotationRange = document.querySelector('input[name="zrotation"]')

let shape = "torus"

// Launch Animation
let XrotationProgress = 0
let ZrotationProgress = 0
let XrotationStep = 0.05
let ZrotationStep = 0.025
const frequency = 25

setInterval(() => {
  switch (shape) {
    case 'torus':
      animateDonut(XrotationProgress, ZrotationProgress)
      break;
    case 'cube':
      animateCube(XrotationProgress, ZrotationProgress)
      break;
    case 'cone':
      animateCone(XrotationProgress, ZrotationProgress)
      break;
  }
  XrotationProgress += XrotationStep
  ZrotationProgress += ZrotationStep
}, 1000/frequency)

// Settings
shapeInputs.forEach(input => input.addEventListener("click", () => (shape = input.value)))
sizeRange.addEventListener("input", updateScreenSize)
zoffsetRange.addEventListener("input", updateZoffset)
xrotationRange.addEventListener("input", updateXrotation)
zrotationRange.addEventListener("input", updateZrotation)

function updateScreenSize() {
  screen_size = parseInt(sizeRange.value)
  K1 = screen_size * Zoff * 3 / (8 * (TORE_R1 + TORE_R2))
}

function updateZoffset() {
  Zoff = parseInt(zoffsetRange.value)
  K1 = screen_size * Zoff * 3 / (8 * (TORE_R1 + TORE_R2))
}

function updateXrotation() {
  XrotationStep = parseInt(xrotationRange.value) / 100
}

function updateZrotation() {
  ZrotationStep = parseInt(zrotationRange.value) / 100
}

/**** Animation functions ****/

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

      // animated point of the tore
      const x = (TORE_R2 + TORE_R1*cosTheta)*(cosB*cosPhi + sinA*sinB*sinPhi) - TORE_R1*cosA*sinB*sinTheta
      const y = (TORE_R2 + TORE_R1*cosTheta)*(cosPhi*sinB - cosB*sinA*sinPhi) + TORE_R1*cosA*cosB*sinTheta
      const z = Zoff + cosA*(TORE_R2 + TORE_R1*cosTheta)*sinPhi + TORE_R1*sinA*sinTheta

      // screen projection
      const xProj = Math.round(screen_size / 2 + K1 * x / z)
      const yProj = Math.round(screen_size / 2 - K1 * y / z)

      // Luminance with light vector: (0, 1, -1)
      const L = cosPhi*cosTheta*sinB - cosA*cosTheta*sinPhi - sinA*sinTheta + cosB*(cosA*sinTheta - cosTheta*sinA*sinPhi)
      
      addASCIItoOutput(L, z, xProj, yProj, zBuffer, output)
    }
  }
  printASCII_DOM(output, renderContainer)
}

function animateCube(A, B) {

  const output = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => '&nbsp;'))
  const zBuffer = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => 0))

  const cosA = Math.cos(A)
  const sinA = Math.sin(A)
  const cosB = Math.cos(B)
  const sinB = Math.sin(B)
  
  for (let side = 0; side < 6; side++) {
    for (let a = 0; a < CUBE_SIZE; a += CUBE_STEP){
      for (let b = 0; b < CUBE_SIZE; b += CUBE_STEP)
      {
        // point of the cube
        const [xs, ys, zs, normal] = getCubeSideInfos(a, b, side)
        
        // point of the animated cube
        const x = cosB*xs + sinB*ys
        const y = -cosA*sinB*xs + cosA*cosB*ys + sinA*zs
        const z = Zoff + sinA*sinB*xs - cosB*sinA*ys + cosA*zs

        // screen projection
        const xProj = Math.round(screen_size / 2 + K1 * x / z)
        const yProj = Math.round(screen_size / 2 - K1 * y / z)
      
        // Luminance with light vector: (0, 1, -1)
        let L = -(cosA*sinB + sinA*sinB)*normal[0] + (cosA*cosB + cosB*sinA)*normal[1] + (sinA - cosA)*normal[2]
        
        addASCIItoOutput(L, z, xProj, yProj, zBuffer, output)
      }
    }
  }
  printASCII_DOM(output, renderContainer)
}

function getCubeSideInfos(a, b, side) {
  let xs, ys, zs
  let normal = []
  switch (side) {
    case 0 :
      xs = a - CUBE_SIZE / 2
      ys = b - CUBE_SIZE / 2
      zs = - CUBE_SIZE / 2
      normal = [0, 0, -1]
      break
    case 1 :
      xs = a - CUBE_SIZE / 2
      ys = CUBE_SIZE / 2
      zs = b - CUBE_SIZE / 2
      normal = [0, 1, 0]
      break
    case 2 :
      xs = CUBE_SIZE / 2
      ys = a - CUBE_SIZE / 2
      zs = b - CUBE_SIZE / 2
      normal = [1, 0, 0]
      break
    case 3 :
      xs = a - CUBE_SIZE / 2
      ys = - CUBE_SIZE / 2
      zs = b - CUBE_SIZE / 2
      normal = [0, -1, 0]
      break
    case 4 :
      xs = a - CUBE_SIZE / 2
      ys = b - CUBE_SIZE / 2
      zs = CUBE_SIZE / 2
      normal = [0, 0, 1]
      break
    case 5 :
      xs = - CUBE_SIZE / 2
      ys = a - CUBE_SIZE / 2
      zs = b - CUBE_SIZE / 2
      normal = [-1, 0, 0]
      break
  }
  return [xs, ys, zs, normal]
}

function animateCone(A, B) {

  const output = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => '&nbsp;'))
  const zBuffer = Array.from({length: screen_size}, () => Array.from({length: screen_size}, () => 0))

  const cosA = Math.cos(A)
  const sinA = Math.sin(A)
  const cosB = Math.cos(B)
  const sinB = Math.sin(B)

  for (let theta = 0; theta < 2 * Math.PI; theta += CONE_ANGLE_STEP) {
    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)
    for (let h = 0; h < CONE_HEIGHT; h += CONE_HEIGHT_STEP) {
      if (h === 0) { // on the cone base
        for (let r = 0; r < CONE_RADIUS ; r += CONE_RADIUS_STEP) {
          // point of the cone
          const xs = r*cosTheta
          const ys = - CONE_HEIGHT / 2
          const zs = r*sinTheta

          // point of the animated cone
          const x = cosB*xs + sinB*ys
          const y = -cosA*sinB*xs + cosA*cosB*ys + sinA*zs
          const z = Zoff + sinA*sinB*xs - cosB*sinA*ys + cosA*zs

          // screen projection
          const xProj = Math.round(screen_size / 2 + K1 * x / z)
          const yProj = Math.round(screen_size / 2 - K1 * y / z)

          // Luminance with light vector: (0, 1, -1)
          const L = -(cosA + sinA)*cosB
          
          addASCIItoOutput(L, z, xProj, yProj, zBuffer, output)
        }
      }
      else {
        // point of the cone
        const xs = cosTheta*(CONE_RADIUS - CONE_RADIUS*h / CONE_HEIGHT)
        const ys = h - CONE_HEIGHT / 2
        const zs = sinTheta*(CONE_RADIUS - CONE_RADIUS*h / CONE_HEIGHT)
  
        // point on the animated cone
        const x = cosB*xs + sinB*ys
        const y = -cosA*sinB*xs + cosA*cosB*ys + sinA*zs
        const z = Zoff + sinA*sinB*xs - cosB*sinA*ys + cosA*zs
  
        // screen projection
        const xProj = Math.round(screen_size / 2 + K1 * x / z)
        const yProj = Math.round(screen_size / 2 - K1 * y / z)
  
        // Luminance with light vector: (0, 1, -1)
        const L = -cosA*sinB*cosTheta - (CONE_RADIUS/CONE_HEIGHT)*cosA*cosB + sinA*sinTheta - (sinA*sinB*cosTheta + (CONE_RADIUS/CONE_HEIGHT)*sinA*cosB + cosA*sinTheta)
        
        addASCIItoOutput(L, z, xProj, yProj, zBuffer, output)
      }
    }
  }
  printASCII_DOM(output, renderContainer)
}


function addASCIItoOutput(L, z, xProj, yProj, zBuffer, output) {
  if (1/z < zBuffer[yProj][xProj]) return
  zBuffer[yProj][xProj] = 1/z
  output[yProj][xProj] = convertLuminanceToASCII(L)
}

function convertLuminanceToASCII(L) {
  if (L < 0) return "."
  let luminanceIndex = Math.round(L*8)
  if (luminanceIndex > 11) luminanceIndex = 11
  return ".,-~:;=!*#$@"[luminanceIndex]
}

function printASCII_DOM(output, renderElement) {
  let ASCII_result = ""
  for (let i = 0; i < screen_size ; i++) {
    ASCII_result += output[i].join('') + "<br>"
  }
  renderElement.innerHTML = ASCII_result
}