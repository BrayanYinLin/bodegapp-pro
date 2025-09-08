import type { ReactNode } from 'react'

export type StepCardProps = {
  step: number
  icon: ReactNode
  title: string
  content: string
}

export function StepCard({ step, icon, title, content }: StepCardProps) {
  return (
    <article className="p-6 bg-white rounded-lg flex flex-col items-center gap-8">
      <div className="flex items-center justify-center text-center w-12 h-12 bg-amaranth-600 text-white font-bold rounded-full">
        {step}
      </div>

      <div className="p-4 rounded-md bg-amaranth-100">{icon}</div>

      <h4 className="text-amaranth-950 text-xl font-medium">{title}</h4>

      <p className="text-center px-4">{content}</p>
    </article>
  )
}
