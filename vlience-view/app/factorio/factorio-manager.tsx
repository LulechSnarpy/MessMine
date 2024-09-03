import Konva from "konva"
import {number} from "prop-types";

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
}

const images: FactorioImageData[] = new Array<FactorioImageData>()
class IsLoading {
  isLoading : boolean
  constructor() {
     this.isLoading = false
  }
  isLoaded () {return this.isLoading }
  onLoaded() {
   this.isLoading = true
  }
}
const isLoading = new IsLoading()

const width = 1728
const height = 604

function analyseFactorioItems (items : FactorioItem[]) {
  const itemMap = new Map<string, FactorioItem>()
  const itemUsed = new Map<string, boolean>()
  const itemQueue = new Array<FactorioItem>()
  const itemBase = new Array<FactorioItem>()
  const itemBaseConsumed = new Map<string, Map<string, string>>()
  const uniqueItems = new Array<FactorioItem>()
  items.forEach(item => {
    if (!itemMap.get(item.id)) uniqueItems.push(item)
    else console.log(item)
    itemMap.set(item.id, item)
    itemUsed.set(item.id, false)
  })
  uniqueItems.forEach(item => {
    if (item.costs && item.costs.length == 0) {
      itemQueue.push(item) // add queue base
      itemBase.push(item)  // remind base items
      itemBaseConsumed.set(item.id, new Map<string, string>()) // init consumed map
    }
  })
  while(itemQueue.length > 0) {
    let item = itemQueue.shift()
    if (!item) continue
    let costMap = new Map<string, FactorioItemCost>()
    let costs = new Array<FactorioItemCost>()
    let costTimes = 0
    item.costs.forEach(p => {
      let childCost = itemMap.get(p.costItemId)
      if (childCost && childCost.costs) {
        childCost.costs.forEach((c) => {
          let id = c.costItemId
          let cost = costMap.get(id)
          if (!cost) {
            cost = {
              costItemId: id,
              cost: 0
            }
            costMap.set(id, cost)
            costs.push(cost)
            itemBaseConsumed.get(id)?.set(item.id, item.id)
          }
          cost.cost += p.cost * c.cost
        })
        costTimes += p.cost * childCost.costTimes
      }
    })
    item.costTimes += costTimes
    item.costs = costs
    item.consumed.forEach(d => {
      let next = itemMap.get(d)
      if (next && itemUsed.get(d)) itemQueue.push(next)
      itemUsed.set(d, true)
    })
  }
  let total = 0;
  itemBase.forEach((item) => {
    item.consumed = new Array<string>()
    itemBaseConsumed.get(item.id)?.forEach((_, key) => {
      item.consumed.push(key)
    })
    total += item.consumed.length
  })
  let xPoint = width / 2
  let yPoint = height / 2
  let r = Math.sqrt(xPoint * xPoint + yPoint * yPoint)
  let linePI = new Map<string, number>()
  let preLinePI = 0
  itemBase.sort((a, b) => (a.consumed.length - b.consumed.length))
  itemBase.forEach((item, i) => {
    if (item.consumed.length) {
      let pi = Math.PI * item.consumed.length / total
      linePI.set( item.id, pi * 2 + preLinePI )
      pi += preLinePI
      preLinePI = Number(linePI.get(item.id))
      let point = getPointByPI( pi )
      images.push({
        id: item.id,
        url: item.description,
        alt: item.name,
        image: undefined,
        x: point.x,
        y: point.y
      })
    }
  })
  function getPointByPI (pi: number) {
    let x = 0
    let y = 0
    x = Math.cos(pi) * r + xPoint
    y = Math.sin(pi) * r + yPoint
    if (x + 40 > width) x = width - 40
    if (x < 0) x = 0
    if (y + 40 > height) y = height - 40
    if (y < 0) y = 0
    return {
      x: x,
      y: y
    }
  }
}


async function getBaseData() {
  if (isLoading.isLoaded()) return
   await fetch('http://localhost:8989/getFactorioData')
    .then(res => res.json())
    .then(data => {
      analyseFactorioItems(data)
    }).catch(
      rejected => {
        console.log(rejected)
      }
    )
}

export async function getFactorioImages () {
  await getBaseData().finally(() => { isLoading.onLoaded() })
  return images
}
