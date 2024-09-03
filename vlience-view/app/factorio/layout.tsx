import {FactorioLinks, LinkData} from "@/app/ui/factorio-links";

const linkdatas: LinkData[]= [{
  url: '/factorio',
  title: 'Tool Home'
},{
  url: '/factorio',
  title: 'Calculator'
}];

export default function FactorioLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex min-h-screen flex-col justify-center p-20">
      <h1 className="mb-3 text-4xl font-semibold text-center">Factorio Tools</h1>
      <FactorioLinks linkdatas={linkdatas}/>
      {children}
    </section>
  );
}