import {Line, Group, Ring} from "react-konva"
import React from 'react'
import Konva from "konva";
import LineConfig = Konva.LineConfig;

const minDegree = 360
const distance = 200
let maxDistance = 0
export function BloodPool(
  { maxHp, curHp, config }
    : { curHp: number, maxHp: number, config: LineConfig}) {
  let maxHpDegree = accurateNumberToDegree(maxHp)
  let curHpDegree = accurateNumberToDegree(curHp)
  maxDistance = maxHpDegree / minDegree * distance
  let curHpPoints = poolFunction(0, curHpDegree)
  let poolShapePoints = shapeFunction(0, maxHpDegree)
  return (
    <Group scaleX={config.scaleX} scaleY={config.scaleY} x={config.x} y={config.y} rotation={270}>
      <Ring
        innerRadius={maxDistance}
        outerRadius={maxDistance+40}
        fillRadialGradientStartPoint={{x: 0, y: 0}}
        fillRadialGradientEndPoint={{x: 0, y: 0}}
        fillRadialGradientStartRadius={maxDistance}
        fillRadialGradientEndRadius={maxDistance+40}
        fillRadialGradientColorStops={[0, 'rgba(255,255,255,1)', 0.8, "rgba(255,255,255,0.6)", 1, 'rgba(255,255,255,0)']}
      />
      <Line
        fill={getHpColor(curHp / maxHp * 100)}
        points={curHpPoints}
        stroke={config.stroke}
        strokeWidth={config.strokeWidth}
        closed={config.closed}
        tension={config.tension}
        rotation={config.rotation}
      />
      <Line
        points={poolShapePoints}
        stroke={'rgba(155,155,155,0.8)'}
        strokeWidth={20}
        // stroke={config.stroke}
        // strokeWidth={config.strokeWidth}
        tension={config.tension}
        fill={config.fill}
        rotation={config.rotation}
      />
    </Group>
  )
}

const baseScaleHp: number = Math.pow(360/Math.sqrt(100/Math.PI*720*minDegree/distance), 2)

function accurateNumberToDegree(a: number): number {
  a = a * baseScaleHp
  return Math.sqrt(
    a / Math.PI * 720
    * minDegree / distance)
}

/**
 * curHp is (accurate Hp Number / accurate MaxHp Number) is a percentage
 * */
function getHpColor (curHp: number) : string {
  let red
  let green = 256
  let blue
  let alpha = 1
  if (curHp > 50) {
    red = (100 - curHp) / 50 * 256
    blue = (curHp - 50) / 50 * 256
  } else {
    green = curHp / 50 * 256
    blue = 0
    red =  255
  }
  return 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ' )'
}

/*
* get points for line to shape blood pool
* */
function shapeFunction(innerR: number, degree: number) : Array<number> {
  let points = new Array<number>()
  points = points.concat(reversePoints(baseRLine(distance, 0)))
  points = points.concat(spiral(innerR, degree, 0))
  points = points.concat(circle(degree))
  return points
}

function poolFunction(innerR: number, degree: number) : Array<number> {
  let points = new Array<number>()
  points = points.concat(reversePoints(baseRLine(distance, 0)))
  points = points.concat(spiral(innerR, degree, 0))
  points = points.concat(reversePoints(spiral(distance, degree, 0)))
  return points
}

function reversePoints(points: Array<number>) : Array<number> {
  let l = points.length
  points = points.reverse()
  for (let i = 0; i < l - 1; i += 2) {
    points[i] ^= points[i + 1]
    points[i + 1] ^= points[i]
    points[i] ^= points[i + 1]
  }
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
    r = Math.min(r, maxDistance)
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