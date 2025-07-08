import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import Sketch from 'react-p5'

const P5Canvas = forwardRef(({ width = 300, height = 180 }, ref) => {
  const canvasRef = useRef(null)

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(width, height).parent(canvasParentRef)
    canvasRef.current = p5
    p5.background(255)
  }

  const draw = (p5) => {
    if (p5.mouseIsPressed) {
      p5.stroke(0)
      p5.strokeWeight(2)
      p5.line(p5.pmouseX, p5.pmouseY, p5.mouseX, p5.mouseY)
    }
  }

  // ✅ 외부에서 그림을 Blob으로 가져갈 수 있게 ref 메서드 정의
  useImperativeHandle(ref, () => ({
    async getCanvasBlob() {
      if (!canvasRef.current) return null
      return new Promise((resolve) => {
        canvasRef.current.canvas.toBlob((blob) => {
          resolve(blob)
        })
      })
    }
  }))

  return <Sketch setup={setup} draw={draw} />
})

export default P5Canvas

