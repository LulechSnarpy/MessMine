'use client'
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("@/app/components/canvas"),{
  ssr: false,
});

export default function Page() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="mb-3 text-2xl font-semibold">Main Page</h1>
        <div>
          <Canvas />
        </div>
      </main>
    );
}