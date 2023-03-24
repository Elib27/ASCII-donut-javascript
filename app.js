// Donut Javascript Code inspired from https://www.a1k0n.net/2006/09/15/obfuscated-c-donut.html

const R1 = 1
const R2 = 2
const K1 = 2

const THETA_STEP = 0.2
const PHI_STEP = 0.1

const renderContainer = document.querySelector('.render-container')

function animateDonut() {
  for (let theta = 0; theta < 2 * Math.PI; theta += THETA_STEP)
  {
    for (let phi = 0; phi < 2 * Math.PI ; phi += PHI_STEP)
    {
      const x = (R2 + R1 * Math.cos(theta)) * Math.cos(phi)
      const y = R1 * Math.sin(theta)
      const z = -(R2 + R1 * Math.cos(theta) * Math.sin(phi))
      
      console.log(theta, phi)
    }
  }
}


/*

  Creer stucture donut
  Itérer sur les points
  Créer projection
  Créer lumière
  Rendu vers les caractères ASCII : .,-~:;=!*#$@
*/