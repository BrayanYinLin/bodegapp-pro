import { ArrowRight, BarChart, Settings, UserPlus } from 'lucide-react'
import { StepCard } from './StepCard'

export function HowItWorks() {
  return (
    <section className="px-4 py-28 bg-amaranth-50 scroll-mt-16" id="resources">
      <h3 className="text-center text-amaranth-950 text-4xl font-bold">
        Comienza en 3 simples pasos
      </h3>
      <p className="text-center text-lg font-semibold mb-10">
        Diseñado para que puedas empezar inmediatamente, sin complicaciones
        técnicas
      </p>
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 mt-6">
        <StepCard
          step={1}
          icon={
            <UserPlus size={20} stroke="1" className="stroke-amaranth-600" />
          }
          title="Crea tu cuenta"
          content="Regístrate en minutos y configura tu perfil empresarial con información
        básica de tu negocio."
        />
        <ArrowRight
          size={30}
          stroke="1"
          className="hidden lg:inline-block stroke-amaranth-600/50"
        />
        <StepCard
          step={2}
          icon={
            <Settings size={20} stroke="1" className="stroke-amaranth-600" />
          }
          title="Configura tu inventario"
          content="Añade tus productos, categorías y ubicaciones. Importa datos existentes o comienza desde cero."
        />
        <ArrowRight
          size={30}
          stroke="1"
          className="hidden lg:inline-block stroke-amaranth-600/50"
        />
        <StepCard
          step={3}
          icon={
            <BarChart size={20} stroke="1" className="stroke-amaranth-600" />
          }
          title="Monitorea y optimiza"
          content="Accede a reportes en tiempo real, recibe alertas automáticas y toma decisiones basadas en datos."
        />
      </div>
    </section>
  )
}
