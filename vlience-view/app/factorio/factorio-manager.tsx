import Konva from "konva"

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
const itemMap = new Map<string, FactorioItem>()
const itemUsed = new Map<string, boolean>()
const itemQueue = new Array<FactorioItem>()
const width = 1728
const height = 384

function analyseFactorioItems (items : FactorioItem[]) {
  let x = 0
  let y = 0
  let uniqueItems = new Array<FactorioItem>()
  items.forEach(item => {
    if (!itemMap.get(item.id)) uniqueItems.push(item)
    itemMap.set(item.id, item)
    itemUsed.set(item.id, false)
  })
  items = uniqueItems;
  items.forEach(item => {
    if (item.costs && item.costs.length == 0) {
      itemQueue.push(item)
    }
  })
  itemQueue.forEach(item => {
    images.push({
      id: item.id,
      url: item.description,
      alt: item.name,
      image: undefined,
      x: x,
      y: y
    })
    x += 40
    if (x + 22 >= width) {
      x = 0
      y += 40
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

  let xPoint = width / 2
  let yPoint = height / 2

}

async function getBaseData() {
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
  await getBaseData().finally()
  return images
}
