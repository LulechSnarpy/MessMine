import {FactorioLinks} from "@/app/ui/factorio-links";
import {LinkData} from '@/app/ui/datatype-links';
import {Router} from "next/router";

const linkdatas = [{
  url: '/factorio',
  title: 'Tool Home'
},{
  url: '/factorio',
  title: 'Calculator'
}];

export default function FactorioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="mb-3 text-4xl font-semibold">Factorio Tools</h1>
      <FactorioLinks linkdatas={linkdatas}/>
      {children}
    </section>
  );
}