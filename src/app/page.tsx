'use client'
import Link from "next/link"

export default function Home() {

  return (
    <div className="relative min-h-screen">
      <div className="w-full h-full px-4 py-10 overflow-auto flex flex-col gap-4 items-center">
      <h1 className="text-5xl mx-auto max-w-[600px] mb-10 font-bold text-warp text-center">Matrino - El Padrino de las Matrices</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

<Link className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100" href="/tarea3">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Generador de Matrices control</h5>
    <p className="mb-3 font-normal">En esta sección podrás generar matrices de control de paridad</p>

</Link>
<Link className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100" href="/tarea1">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Generador de Parámetros y códigos lineales</h5>

    <p className="mb-3 font-normal">En esta sección podrás generar parámetros y códigos lineales</p>

</Link>
<Link className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100" href="/tarea2">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Generador de Matrices y parámetros</h5>

    <p className="mb-3 font-normal">En esta sección podrás generar matrices y parámetros</p>

</Link>
</div>

      </div>
    </div>
  )
}
