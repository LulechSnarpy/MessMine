import {Line} from "react-konva"
import React from 'react'
import Konva from "konva";
import LineConfig = Konva.LineConfig;

export function BloodPool(
  { innerR, degree, isCircle, config }
    : { innerR: number, degree: number, isCircle: boolean, config: LineConfig}) {
  // const [points, setPoints] = React.useState<number[]>(shapeFunction(innerR, degree, isCircle))
  let points = shapeFunction(innerR, degree, isCircle)
  return (
    <Line
          points={points}
          stroke={config.stroke}
          strokeWidth={config.strokeWidth}
          x={config.x}
          y={config.y}
          closed={config.closed}
          tension={config.tension}
          fill={config.fill}
    />
  )
}

const minDegree = 360
const distance = 200

function shapeFunction(innerR: number, degree: number, isCircle: boolean = true) : Array<number> {
  let points = new Array<number>()
  //points = points.concat(baseRLine(innerR, 0))
  points = points.concat(spiral(innerR, degree, 0))
  if(isCircle) points = points.concat(circle(degree))
  // if(isCircle) points = points.concat(reversePoints(spiral(innerR, degree, 0)))
  // points = points.concat(reversePoints(baseRLine(innerR, 0)))
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

function spiral(innerR: number, degree: number, baseTheta: number): Array<number> {
  let points = new Array<number>()
  let r = innerR
  let increased = distance / minDegree
  for (let i = 0; i <= degree; i++) {
    let theta = baseTheta + Math.PI * i / 180
    r = r + increased
    let x = Math.cos(theta) * r
    let y = Math.sin(theta) * r
    points.push(x)
    points.push(y)
  }
  return points
}

function circle(degree: number) : Array<number> {
  let r = degree / minDegree * distance
  let baseDegree = degree % 360
  let points = new Array<number>()
  for (let i = baseDegree; i <= 360 + baseDegree; i++) {
    let theta = Math.PI * i / 180
    let x = Math.cos(theta) * r
    let y = Math.sin(theta) * r
    points.push(x)
    points.push(y)
  }
  return points
}