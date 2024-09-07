'use client'
import {Layer, Line, Stage} from "react-konva"
import Konva from "konva"
import BloodPool from "@/app/vlience/blood-pool";
import React from "react";

export default function MainStage({ stageWidth, stageHeight } : { stageWidth : number, stageHeight : number }) {
  return (
    <Stage width={ stageWidth } height={ stageHeight }  className="border-cyan-500 border-4">
      <Layer>
          <Line key={'_key_' + 'horizontal'} points={[0, stageHeight / 2, stageWidth, stageHeight / 2]} stroke='red'
                strokeWidth={2}/>
          <Line key={'_key_' + 'vertical'} points={[stageWidth / 2, 0, stageWidth / 2, stageHeight]} stroke='red'
                strokeWidth={2}/>
          <BloodPool innerR={0} outerR={400} />
      </Layer>
    </Stage>
  )
}
