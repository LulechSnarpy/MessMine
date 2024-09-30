'use client'
import {Layer, Line, Stage, Ring } from "react-konva"
import { BloodPool } from "@/app/vlience/blood-pool";
import React from "react";

export function MainStage(
  { stageWidth, stageHeight, maxHp, curHp }
    : { stageWidth : number, stageHeight : number, maxHp : number, curHp : number }) {
  return (
    <Stage width={ stageWidth } height={ stageHeight }  className="border-cyan-500 border-4">
      <Layer>
          {/*<Line key={'_key_' + 'horizontal'} points={[0, stageHeight / 2, stageWidth, stageHeight / 2]} stroke='red'
                strokeWidth={2}/>
          <Line key={'_key_' + 'vertical'} points={[stageWidth / 2, 0, stageWidth / 2, stageHeight]} stroke='red'
                strokeWidth={2}/>*/}
          <BloodPool curHp={curHp/100 * maxHp} maxHp={maxHp} config={{
            x: 100,
            y: stageHeight - 100,
            closed:true,
            tension: 0.1,
            scaleX: 0.1,
            scaleY: 0.1
          }}/>
      </Layer>
    </Stage>
  )
}
