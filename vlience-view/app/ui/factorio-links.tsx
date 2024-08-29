'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LinkData} from './datatype-links'

export function FactorioLinks( { linkdatas } : { linkdatas: LinkData[]} ) {
  const pathname = usePathname()
  return (
     <nav>
       {
         linkdatas.map((data : LinkData) => (
         <Link key= {`link_%${data.title}`}
               href={`${data.url}`}
               className={`line-clamp-1 ${pathname == data.url ? 'active' : ''}`}>
           {data.title}
         </Link>
       ))}
     </nav>
  );
}