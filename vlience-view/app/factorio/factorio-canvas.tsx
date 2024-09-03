'use client'
import {Layer, Stage, Image} from "react-konva"
import React from "react"
import useImage from 'use-image'
import {FactorioImageData} from "./factorio-manager"
import Konva from "konva"
import isDragging = Konva.isDragging;

export function FactorioCanvas({ images } : { images: FactorioImageData[] }) {
  const stageWidth = 1728
  const stageHeight = 604
  let INITIAL_STATE: FactorioImageData[]

  INITIAL_STATE = images
  const [factorImages, setFactorioImages] = React.useState(INITIAL_STATE)

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    factorImages.forEach(image => {
      image.isDragging = image.id === id
    })
  }
  const handleDragEnd = (e : Konva.KonvaEventObject<DragEvent>) => {
   factorImages.forEach(image => {
     if (image.isDragging) {
       image.x = e.target.x()
       image.y = e.target.y()
       image.isDragging = false
     }
   })
  }

  // the first very simple and recommended way:
  const FactorioImage = ({ config }: { config: FactorioImageData }) => {
    const [image] = useImage(config.url)
    return <Image
      key={config.id}
      id={config.id}
      image={image}
      x={config.x}
      y={config.y}
      alt={config.alt}
      draggable
      isDragging={config.isDragging}
      scaleX={config.isDragging ? 1.2 : 1}
      scaleY={config.isDragging ? 1.2 : 1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  }

  return (
      <Stage width={stageWidth} height={stageHeight}  className="border-cyan-500 border-4">
        <Layer>
          {
            factorImages.map((data) => (
              <FactorioImage key={"factorio_image_" + data.id} config={data}/>
            ))
          }
        </Layer>
      </Stage>
  )
}
