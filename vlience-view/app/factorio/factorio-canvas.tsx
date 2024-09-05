'use client'
import {Layer, Stage, Image, Line} from "react-konva"
import React, {useState} from "react"
import useImage from 'use-image'
import {FactorioImageData} from "./factorio-manager"
import Konva from "konva"
import LineConfig = Konva.LineConfig;
export function FactorioCanvas({ images, lines } : { images: FactorioImageData[], lines: LineConfig[] }) {
  const stageWidth = 1728
  const stageHeight = 604
  const [factorImages,setFactorioImages] = useState(images)
  const [factorLinkLines,setFactorioLinkLines] = useState(lines)
  const imageMap = new Map<string, FactorioImageData>()
  const lineMap = new Map<string, LineConfig>()
  const imageLineMap = new Map<string, LineConfig[]>()
  factorImages.forEach(image => {
    if (!image.id) return
    imageMap.set(image.id, image)
  })
  factorLinkLines.forEach(line => {
    if(!line.id) return
    let ids = line.id.split('-*-')
    if(ids.length != 2) return
    let lineArr = getMapArray(ids[0], imageLineMap)
    lineArr.push(line)
    lineArr = getMapArray(ids[1], imageLineMap)
    lineArr.push(line)
    lineMap.set(line.id, line)
  })

  function getMapArray<Key, Type> (key : Key, map: Map<Key, Array<Type>>) : Array<Type>{
    let data = map.get(key)
    if (!data) {
      data = new Array<Type>()
      map.set(key, data)
    }
    return data
  }

  function reCalcLinePoints(line: LineConfig) {
    if(!line.id) return
    let ids = line.id.split('-*-')
    if(ids.length != 2) return
    let preImage = imageMap.get(ids[0])
    let nextImage = imageMap.get(ids[1])
    if (!preImage || !nextImage) return
    let x1 = preImage.x + 20
    let y1 = preImage.y + 20
    let x3 = nextImage.x + 20
    let y3 = nextImage.y + 20
    let x2 = ( x1 + x3 ) / 2
    let y2 = ( y1 + y3 ) / 2
    line.points = [x1, y1, x2, y2, x3, y3]
  }

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    let image = imageMap.get(id)
    if (!image) return
    image.isDragging = true
    let lineArr = getMapArray(image.id, imageLineMap)
    lineArr.forEach(line => {
      line.isDragging = true
    })
  }

  const handleDragEnd = (e : Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id()
    let image = imageMap.get(id)
    if (!image) return
    image.x = e.target.x()
    image.y = e.target.y()
    image.isDragging = false
    let lineArr = getMapArray(image.id, imageLineMap)
    let ids = ""
    lineArr.forEach(line => {
      ids = ids + "," + line.id
      reCalcLinePoints(line)
      line.isDragging = false
    })
    let lineNext = new Array<LineConfig>()
    factorLinkLines.forEach(line => {
      if (!line.id) return
      if (ids.includes(line.id)) return
      lineNext.push(line)
    })
    lineNext = lineNext.concat(lineArr)
    setFactorioLinkLines(lineNext)
  }

  const handleDragLineStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id()
    let line = lineMap.get(id)
    if (!line) return
    line.isDragging = true
  }

  const handleDragLineEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const id = e.target.id()
    let line = lineMap.get(id)
    if (!line || !line.points) return
    reCalcLinePoints(line)
    line.points[2] = e.target.x()
    line.points[3] = e.target.y()
    line.isDragging = false
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

/*  const FactorioLinkLine =  ({ config }: { config: LineConfig }) => {
    return ;
  }*/

  const [points,setPoints] = useState([0, 0, stageWidth / 2, stageHeight / 2, stageWidth, stageHeight])
  return (
      <div>
        {/*<input type={'number'} name='_name_01' placeholder={ points[2] + '' } onChange={ event => { setPoints([0, 0, Number(event.target.value), points[3], stageWidth, stageHeight ]) } }/>
        <input type={'number'} name='_name_02' placeholder={ points[3] + '' } onChange={ event => { setPoints([0, 0, points[2], Number(event.target.value), stageWidth, stageHeight ]) } }/>*/}
        <Stage width={ stageWidth } height={ stageHeight }  className="border-cyan-500 border-4">
          <Layer>
            {/*<Line key={'_key_' + 1 +  '_demo_'} points={points} stroke={'red'} strokeWidth={2} tension={0.5} />*/}
            <Line key={'_key_' + 'horizontal'} points={[0, stageHeight / 2, stageWidth, stageHeight / 2]} stroke='red'
                  strokeWidth={2}/>
            <Line key={'_key_' + 'vertical'} points={[stageWidth / 2, 0, stageWidth / 2, stageHeight]} stroke='red'
                  strokeWidth={2}/>
            {
              factorLinkLines.map((config) => (
               /* <FactorioLinkLine key={'factorio_link_line_' + data.id} config={data} />*/
                <Line
                  key={config.id}
                  id={config.id}
                  points={config.points}
                  stroke={config.stroke}
                  strokeWidth={2}
                  closed={false}
                  tension={0.5}
                  x={config.x}
                  y={config.y}
                /*  draggable
                  onDragStart={handleDragLineStart}
                  onDragEnd={handleDragLineEnd}*/
                />
              ))
            }
            {
              factorImages.map((data) => (
                <FactorioImage key={"factorio_image_" + data.id} config={data} />
              ))
            }
          </Layer>
        </Stage>
      </div>
  )
}
