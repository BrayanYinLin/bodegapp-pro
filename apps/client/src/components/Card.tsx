import type { ReactNode } from 'react'

export type CardProps = {
  icon: ReactNode
  title: string
  description: string
}

export function Card({ icon, title, description }: CardProps) {
  return (
    <article className="max-w-full flex flex-col gap-4 p-6 rounded-xl border border-black/20 hover:border-amaranth-400 hover:shadow-amaranth transition-all duration-300">
      <div>
        <div className="inline-block rounded-md bg-amaranth-100 p-2">
          {icon}
        </div>
      </div>
      <h4 className="font-semibold cursor-default text-amaranth-950 text-xl">
        {title}
      </h4>
      <p className="text-black/75 cursor-default">{description}</p>
    </article>
  )
}
