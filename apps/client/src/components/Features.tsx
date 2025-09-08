import { Box, Cloud, Users } from 'lucide-react'
import { Card } from './Card'

const features = [
  {
    icon: <Box size={18} color="#f60850" />,
    title: 'Control de Stock',
    description:
      'Monitorea tu inventario en tiempo real con alertas automáticas de stock bajo y herramientas de reposición inteligente.'
  },
  {
    icon: <Users size={18} color="#f60850" />,
    title: 'Gestión de Equipos',
    description:
      'Asigna roles y permisos a tu equipo para un control granular del acceso a la información.'
  },
  {
    icon: <Cloud size={18} color="#f60850" />,
    title: 'Sincronización',
    description:
      'Accede a tu inventario desde cualquier dispositivo con sincronización automática en la nube.'
  }
]

export function Features() {
  return (
    <section className="px-4 py-28 scroll-mt-16" id="features">
      <h2 className="text-amaranth-950 text-center text-4xl font-bold">
        Todo lo que necesitas para gestionar tu inventario
      </h2>
      <p className="text-center text-lg font-semibold">
        Herramientas potentes y fáciles de usar que se adaptan a cualquier tipo
        de negocio
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
        {features.map((feat, index) => (
          <Card
            key={index}
            icon={feat.icon}
            title={feat.title}
            description={feat.description}
          />
        ))}
      </div>
    </section>
  )
}
