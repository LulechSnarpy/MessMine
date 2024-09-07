import {Line} from "react-konva"
import React from 'react'
import {number} from "prop-types";

export default function BloodPool({ innerR, outerR } : { innerR: number, outerR: number }) {
  const [points, setPoints] = React.useState<number[]>(shapeFunction(innerR, outerR))
  return (
    <Line points={points} stroke={'gray'} fill={'white'} strokeWidth={10}
          x={window.innerWidth/2-5} y={window.innerHeight/2-5}
          closed={true}
    />
  )
}

const degree = 720

function shapeFunction(innerR: number, outerR: number) : Array<number> {
  let points = new Array<number>()
  points = points.concat(baseRLine(innerR, 0))
  points = points.concat(spiral(innerR, outerR, 0))
  points = points.concat(circle(outerR))
  points = points.concat(reversePoints(spiral(innerR, outerR, 0)))
  points = points.concat(reversePoints(baseRLine(innerR, 0)))
  return points
}

function reversePoints(points: Array<number>) : Array<number> {
  let l = points.length
  points = points.reverse()
  for (let i = 0; i < l - 1; i++) {
    points[i] ^= points[i + 1]
    points[i + 1] ^= points[i]
    points[i] ^= points[i + 1]
  }
  /*for (let i = 0; i < l - 2; i += 2) {
    points[i] ^= points[l - 2 - i]
    points[l - 2 - i] ^= points[i]
    points[i] ^= points[l - 2 - i]
    points[i + 1] ^= points[l - 1 - i]
    points[l - 1 - i] ^= points[i + 1]
    points[i + 1] ^= points[l - 1 - i]
  }*/
  return points
}

function baseRLine(innerR: number, baseTheta: number): Array<number> {
  let points = new Array<number>()
  points.push(0)
  points.push(0)
  let x = Math.cos(baseTheta) * innerR
  let y = Math.sin(baseTheta) * innerR
  points.push(x)
  points.push(y)
  return points
}

function spiral(innerR: number, outerR: number, baseTheta: number): Array<number> {
  let points = new Array<number>()
  let r = innerR
  let increased = (outerR - innerR) / degree
  for (let i = 0; i <= degree; i++) {
    let theta = baseTheta + Math.PI * i / 180
   // r = r + decreasedR(innerR, outerR, i)
    r = r + increased
  /*  console.info(r)
    console.info('increasedR = ' + decreasedR(innerR, outerR, i))*/
    let x = Math.cos(theta) * r
    let y = Math.sin(theta) * r
    points.push(x)
    points.push(y)
  }
  return points
}

function decreasedR(innerR: number, outerR: number, index: number) : number  {
  let h = (outerR-innerR) * 2 / degree
  return h * (degree - index) / degree
}

function circle(outerR: number) : Array<number> {
  let points = new Array<number>()
  for (let i = 0; i <= 360; i++) {
    let theta = Math.PI * i / 180
    let x = Math.cos(theta) * outerR
    let y = Math.sin(theta) * outerR
    points.push(x)
    points.push(y)
  }
  return points
}