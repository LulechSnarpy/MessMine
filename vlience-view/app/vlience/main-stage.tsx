'use client'
import {Layer, Line, Stage, Ring } from "react-konva"
import { BloodPool } from "@/app/vlience/blood-pool";
import React from "react";

export function MainStage(
  { stageWidth, stageHeight, maxHp, curHp }
    : { stageWidth : number, stageHeight : number, maxHp : number, curHp : number }) {
  const degree = 360
  // const [maxHpDegree, setMaxHpDegree] = React.useState<number>(degree)
  // const [curHpDegree, setCurHpDegree] = React.useState<number>(degree * 2)
  /*setMaxHpDegree(maxHp / 50 * degree)
  setCurHpDegree(curHp / 50 * (maxHpDegree + degree))*/
  let maxHpDegree = maxHp / 50 * degree
  let curHpDegree = curHp / 100 * (maxHpDegree + degree)
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

  const minDegree = 360
  const distance = 200
  const innerRadius = maxHpDegree / minDegree * distance
  const outerRadius = 1080 / minDegree * distance
  return (
    <Stage width={ stageWidth } height={ stageHeight }  className="border-cyan-500 border-4">
      <Layer>
          {/*<Line key={'_key_' + 'horizontal'} points={[0, stageHeight / 2, stageWidth, stageHeight / 2]} stroke='red'
                strokeWidth={2}/>
          <Line key={'_key_' + 'vertical'} points={[stageWidth / 2, 0, stageWidth / 2, stageHeight]} stroke='red'
                strokeWidth={2}/>*/}
          <BloodPool innerR={0} degree={curHpDegree} isCircle={false} config={{
            fill: 'rgba('+ red + ',' + green + ',' + blue + ',' + alpha + ' )',
            x: stageWidth / 2,
            y: stageHeight / 2,
            closed:true,
            tension: 0.1
          }}/>
          <Ring
            x={stageWidth / 2}
            y={stageHeight / 2}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill={'white'}
          />
          <BloodPool innerR={0} degree={maxHpDegree} isCircle={true} config={{
            stroke: 'gray',
            strokeWidth: 5,
            x: stageWidth / 2,
            y: stageHeight / 2,
            closed:false,
            tension: 0.1
          }}/>
      </Layer>
    </Stage>
  )
}
