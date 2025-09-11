import type { InputHTMLAttributes, ReactNode } from 'react'

export type InputAuthProps = {
  icon: ReactNode
  labelContent: string
  type: InputHTMLAttributes<HTMLInputElement>['type']
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange']
  placeholder: string
}

export function InputAuth({
  icon,
  labelContent,
  type,
  placeholder,
  onChange
}: InputAuthProps) {
  return (
    <div className="w-full max-w-sm min-w-[380px]">
      <label className="block mb-2 text-sm text-amaranth-950 font-semibold">
        {labelContent}
      </label>
      <div className="relative">
        {icon}
        <input
          type={type}
          onChange={onChange}
          className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none shadow-sm focus:shadow"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
