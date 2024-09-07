'use client'
import dynamic from "next/dynamic"
import {useState} from "react";

const Canvas = dynamic(() => import("@/app/vlience/main-stage")
    .then(mod => mod.MainStage)
  , {
  ssr: false
})

export default function Page() {
  const stageWidth = window.innerWidth-10// 1728
  const stageHeight = window.innerHeight-50 // 604
  const [maxHp, setMaxHp] = useState(50)
  const [curHp, setCurHp] = useState(50)
  function onChangeMaxHp(e: React.ChangeEvent<HTMLInputElement>) {
    let tempHp =  Number(e.target.value)
    setMaxHp(tempHp > 50? tempHp: 50)
  }
  function onChangeCurHp(e: React.ChangeEvent<HTMLInputElement>) {
    setCurHp(Number(e.target.value))
  }
  return (
    <main>
      <div className="flex">
        <div>
          <label>MAX_HP:</label>
          <input type={'range'} className="min-w-96" onChange={onChangeMaxHp}/>
        </div>
        <div>
          <label>CUR_HP:</label>
          <input type={'range'} className="min-w-96"onChange={onChangeCurHp} />
        </div>
      </div>
      <Canvas stageWidth={stageWidth} stageHeight={stageHeight} maxHp={maxHp} curHp={curHp} />
    </main>
  )
}