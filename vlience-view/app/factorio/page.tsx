import dynamic from "next/dynamic"
import {getFactorioData, FactorioImageData} from './factorio-manager'

const Canvas = dynamic(() => import("@/app/factorio/factorio")
  .then(mod => mod.FactorioCanvas),{
  ssr: false,
})
/*const Canvas = dynamic(() => import("@/app/components/canvas"),{
  ssr: false,
})*/

export default async function Page() {
  let factorioData = await getFactorioData()
  let images : FactorioImageData[] = factorioData.images
  let lines = factorioData.lines
    return (
      <main className="flex min-h-96 flex-col items-center justify-between pt-5">
        <h1 className="flex-none text-2xl font-semibold pt-5 pb-5">Main Page</h1>
        <div className="flex-auto items-center justify-center min-h-96">
          <Canvas images={ images } lines={ lines } />
        </div>
      </main>
    );
}