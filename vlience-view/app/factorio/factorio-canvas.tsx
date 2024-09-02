'use client'
import {Layer, Stage, Image} from "react-konva"
import React from "react"
import useImage from 'use-image'
import {FactorioImageData} from "./factorio-manager"
import Konva from "konva"

export function FactorioCanvas({ images } : { images: FactorioImageData[] }) {
  const stageWidth = 1728
  const stageHeight = 384
  let INITIAL_STATE: FactorioImageData[]

  INITIAL_STATE = images
  const [factorImages, setFactorioImages] = React.useState(INITIAL_STATE)

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    setFactorioImages(
      factorImages.map((image) => {
        return {
          ...image,
          isDragging: image.id === id,
        }
      })
    )
  }
  const handleDragEnd = () => {
    setFactorioImages(
      factorImages.map((image) => {
        return {
          ...image,
          isDragging: false,
        }
      })
    )
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
      <Stage width={stageWidth} height={stageHeight}>
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
