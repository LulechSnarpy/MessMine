'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LinkData } from './datatype-links'

export type { LinkData } from  './datatype-links'
export function FactorioLinks( { linkdatas } : { linkdatas: LinkData[]} ) {
  const pathname = usePathname()
  return (
     <nav className="flex items-center justify-around">
       {
         linkdatas.map((data) => (
         <Link key= {`link_%${data.title}`}
               href={`${data.url}`}
               className={`flex-1 w-12 text-center ${pathname == data.url ? 'active' : ''}`}>
           {data.title}
         </Link>
       ))}
     </nav>
  );
}