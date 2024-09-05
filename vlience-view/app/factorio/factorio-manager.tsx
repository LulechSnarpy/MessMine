import Konva from "konva"
import fs from 'fs'

export interface FactorioItemCost {
  costItemId: string
  cost: number
}

export interface FactorioItem {
  id: string
  name: string
  description: string
  costTimes: number
  costs:  Array<FactorioItemCost>
  consumed: Array<string>
}

export interface FactorioImageData extends Konva.ImageConfig {
  url: string
  x: number
  y: number
}

export interface FactorioNode extends FactorioItem {
  deep: number
}

export interface Point {
  x: number,
  y: number
}

const images: FactorioImageData[] = new Array<FactorioImageData>()
const lines: Konva.LineConfig[] = new Array<Konva.LineConfig>()
const imageMap : Map<string, FactorioImageData> = new Map<string, FactorioImageData>()
class IsLoading {
  isLoading : boolean
  constructor() {
     this.isLoading = false
  }
  isLoaded () { return this.isLoading }
  onLoaded() {
   this.isLoading = true
  }
}
const isLoading = new IsLoading()

const width = 1728
const height = 604
const itemMap = new Map<string, FactorioItem>()
const itemUsed = new Map<string, boolean>()

function analyseFactorioItems (items : FactorioItem[]) {
  const itemQueue = new Array<FactorioNode>()
  const itemBase = new Array<FactorioItem>()
  const uniqueItems = new Array<FactorioItem>()
  const deepMap = new Map<string, number>()
  items.forEach(item => { // init flag and map and distinct
    if (!itemMap.get(item.id)) uniqueItems.push(item) // distinct
    itemMap.set(item.id, item) // map
    itemUsed.set(item.id, false) // flag
  })
  let points: Array<Point> =
    [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: 0, y: height }, { x: width, y: height }]
  let idx = 0
  uniqueItems.forEach(item => { // init queue base item
   if (item.costs && item.costs.length == 0) {
     if ('Stone, Coal, Iron_ore, Copper_ore'.includes(item.id)) {
       itemBase.push(item)  // remind base items
       deepMap.set(item.id, getDeep(item)) // remind consume deep for an item
       itemQueue.push({ // add queue base
         ...item,
         deep: 1
       })
       let point = getPoint(points[idx++])
       let image = {
         ...point,
         id: item.id,
         url: item.description,
         alt: item.name,
         image: undefined,
       }
       images.push(image)
       imageMap.set(item.id, image)
     }/* else {
       let image = {
         x: width / 2,
         y: height / 2,
         id: item.id,
         url: item.description,
         alt: item.name,
         image: undefined,
       }
       images.push(image)
       imageMap.set(item.id, image)
     }*/
   }
  })
  let xPoint = width / 2  // center x
  let yPoint = height / 2 // center y
  let r = Math.sqrt(xPoint * xPoint + yPoint * yPoint)
  while(itemQueue.length > 0) {
    let item = itemQueue.shift()
    if (!item) continue
    let image = imageMap.get(item.id)
    if (!image) continue
    item.costs.forEach(p => { // init link lines for one item
      let preImage = imageMap.get(p.costItemId)
      if (!preImage) return
      let x1 = preImage.x + 20
      let y1 = preImage.y + 20
      let x3 = image.x + 20
      let y3 = image.y + 20
      let x2 = ( x1 + x3 ) / 2
      let y2 = ( y1 + y3 ) / 2
      lines.push({
        id: p.costItemId + '-*-' + item.id ,
        points: [x1, y1, x2, y2, x3, y3],
        stroke: 'blue'
      })
    })
    let x = image.x
    let y = image.y
    let count = 1
    let deep = deepMap.get(item.id)
    if (!deep) return
    item.consumed.forEach(d => {
      let next = itemMap.get(d)
      if (!next || itemUsed.get(d)) return
      let nextDeep = getDeepBefore(next)
      if (nextDeep !== item.deep + 1) return
      count = count + 1
    })
    let basePi =
      Math.floor(
        Math.atan2((y - yPoint), (x - xPoint))
        * 2 / Math.PI)
      * Math.PI / 2
    let growPi = Math.asin(xPoint / (r * (deep - item.deep) / deep))
    if (xPoint > (r * (deep - item.deep) / deep)) growPi = Math.PI / 2
    growPi = growPi / count
    let pi = basePi
    item.consumed.forEach(d => { // add next item in queue
      let next = itemMap.get(d)
      if (next && !itemUsed.get(d)) {
        let nextDeep = getDeepBefore(next)
        if (nextDeep !== item.deep + 1) return
        itemQueue.push({
          ...next,
          deep: item.deep + 1
        })
        deepMap.set(next.id, deep)
        pi = pi + growPi
        pi = Math.atan2((y - yPoint), (x - xPoint))
        let point= getPointByPI(pi, r * (deep - item.deep) / deep)
        let image = {
          ...point,
          id: next.id,
          url: next.description,
          alt: next.name,
          image: undefined
        }
        images.push(image)
        imageMap.set(next.id, image)
        itemUsed.set(d, true)
      }
    })
  }
  function getPointByPI (pi: number, r: number) {
    let x = Math.cos(pi) * r + xPoint
    let y = Math.sin(pi) * r + yPoint
    return  getPoint({
      x: x,
      y: y
    })
  }
}

function getDeep(item : FactorioItem) : number {
  let deep = 0;
  let queue = new Array<FactorioNode>()
  queue.push({
    ...item,
    deep: 1
  })
  while(queue.length > 0) {
    let node = queue.shift()
    if (!node) continue
    deep = Math.max(deep, node.deep)
    node.consumed.forEach(d => {
      let next = itemMap.get(d)
      if (!next) return
      queue.push({
        ...next,
        deep: node.deep + 1
      })
    })
  }
  return deep
}

function getDeepBefore(item : FactorioItem) : number {
  let deep = 0;
  let queue = new Array<FactorioNode>()
  queue.push({
    ...item,
    deep: 1
  })
  while (queue.length > 0) {
    let node = queue.shift()
    if (!node) continue
    deep = Math.max(deep, node.deep)
    node.costs.forEach(d => {
      let next = itemMap.get(d.costItemId)
      if (!next) return
      queue.push({
        ...next,
        deep: node?.deep + 1
      })
    })
  }
  return deep
}

function getPoint(point: Point) : Point {
  point.x = inRange(point.x, width - 40)
  point.y = inRange(point.y, height - 40)
  return point;
}

function inRange(a: number, ceil: number, floor: number = 0) : number {
  if (a < floor) a = floor
  if (a > ceil) a = ceil
  return a
}

const filePath: string = process.cwd() + '/app/factorio/analysed_data.json'
const sourceFilePath: string = process.cwd() + '/app/factorio/source_data.json'

async function getBaseData() {
  if (isLoading.isLoaded()) return
  let stringData = fs.readFileSync(filePath, 'utf8')
  if (stringData && stringData.length > 0) {
    let data: { images: FactorioImageData[], lines: Konva.LineConfig[] } =
      JSON.parse(stringData)
    if (data && data.images.length && data.lines.length) {
      images.concat(data.images)
      lines.concat(data.lines)
      return
    }
  }
  stringData = fs.readFileSync(sourceFilePath, 'utf-8')
  if (stringData && stringData.length > 0) {
    let sourceData: FactorioItem[] =
      JSON.parse(stringData)
    if (sourceData) {
      analyseFactorioItems(sourceData)
      return
    }
  }
  await fetch('http://localhost:8989/getFactorioData')
  .then(res => res.json())
  .then(data => {
    fs.writeFile(sourceFilePath, JSON.stringify(data), () => {})
    analyseFactorioItems(data)
  }).catch(
    rejected => {
      console.log(rejected)
    }
  ).finally(() =>{
  })
}

export default async function handler(req : Request, res : Response) {
  if (req.method === 'POST') {
    fs.writeFileSync(filePath, JSON.stringify(req.body))
    return res
  }
}

export async function getFactorioData () {
  await getBaseData().finally(() => { isLoading.onLoaded() })
  return { images, lines }
}
