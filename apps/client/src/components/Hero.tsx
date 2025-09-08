import { ArrowRight, BarChart, Package } from 'lucide-react'
import { Button, buttonVariants } from './Button'

export function Hero() {
  return (
    <section className="px-14 py-24 bg-amaranth-50 flex flex-col-reverse lg:flex-row gap-4">
      <div className="flex flex-col items-start gap-4 pr-6">
        <h1 className="text-amaranth-950 text-5xl font-bold">
          Gestiona tu inventario <br /> de forma{' '}
          <span className="text-amaranth-500">inteligente</span>
        </h1>
        <p className="text-xl">
          La plataforma completa para el control de inventarios que tu negocio
          necesita. Simple, potente y diseñada para crecer contigo.
        </p>
        <Button variant={buttonVariants({ size: 'lg', variant: 'default' })}>
          Comienza gratis
          <ArrowRight size={20} />
        </Button>
      </div>

      <div className="relative p-6 lg:max-w-1/2">
        <img
          className="w-full rounded-2xl border border-accent"
          src="https://preview--stock-blossom.lovable.app/assets/dashboard-hero-ip2xy9tg.jpg"
          alt=""
        />

        <div className="absolute -left-4 top-1/4 bg-white border border-slate-200 shadow-amaranth rounded-lg p-3 hidden lg:block">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Análisis en tiempo real</span>
          </div>
        </div>

        <div className="absolute -right-4 bottom-1/4 bg-white border border-slate-200 shadow-amaranth rounded-lg p-3 hidden lg:block">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Control total</span>
          </div>
        </div>
      </div>
    </section>
  )
}
