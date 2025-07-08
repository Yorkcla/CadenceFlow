import React from 'react'
import Sketch from 'react-p5'

export default function P5Canvas({ width = 300, height = 180 }) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.background(255) // 흰 배경
  }

  const draw = (p5) => {
    if (p5.mouseIsPressed) {
      p5.stroke(0)
      p5.strokeWeight(2)
      p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY)
    }
  }

  return <Sketch setup={setup} draw={draw} />
}
