'use client'
import dynamic from "next/dynamic"

const Canvas = dynamic(() => import("@/app/vlience/main-stage"), {
  ssr: false
})

export default function Page() {
  const stageWidth = window.innerWidth-10// 1728
  const stageHeight = window.innerHeight-10 // 604
  return (
    <main>
      <Canvas stageWidth={stageWidth} stageHeight={stageHeight} />
    </main>
  )
}