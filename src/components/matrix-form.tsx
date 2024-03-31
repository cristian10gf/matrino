"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef, use } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "./ui/textarea"
import { set } from "date-fns"
import { parse } from "path"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const matrixFormSchema = z.object({
  matrix: z
    .number()
    .array()
    .array()
})

type MatrixFormValues = z.infer<typeof matrixFormSchema>

const defaultValues: Partial<MatrixFormValues> = {
  matrix: []
}

export function MatrixForm() {
  const [width, setWidth] = useState(3)
  const [height, setHeight] = useState(3)
  const [dimension, setDimension] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [move, setMove] = useState(2)
  const [codigos, setCodigos] = useState<string[]>([])
  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: height }, () => Array.from({ length: width }, () => 0))
  );

  const randomMatrix = () => {
    const newMatrix = Array.from({ length: height }, () => Array.from({ length: width }, () => Math.floor(Math.random() * move)))
    setMatrix(newMatrix)
  }
  useEffect(() => {
    setCodigos([])
  }, [width, move])
  useEffect(() => {
    setMatrix(Array.from({ length: height }, () => Array.from({ length: width }, () => 0)))
  }, [height, width, move])
  const form = useForm<MatrixFormValues>({
    resolver: zodResolver(matrixFormSchema),
    defaultValues,
  })

  async function onSubmit() {
    await fetch("https://code-theory-api.onrender.com/lineal-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        matrix: matrix,
        z: move,
      })
    }).then(async (res) => {
      const response = await res.json()
      setCodigos(response.codewords)
      setLongitude(response.n)
      setDimension(response.k)
    })
  }
  return (
    <Form {...form}>

      <form  onSubmit={(e)=>{e.preventDefault()}} className="flex flex-col gap-4 w-fit h-fit">
        <h1 className="text-4xl mx-auto max-w-[600px] mb-10 font-bold text-warp text-center">Matrino: Generador de Parámetros y códigos lineales</h1>
        <div className="flex flex-col gap-4 md:flex-row">
            <Card className="w-fit h-fit">
              <CardHeader>
                <CardTitle>Características Principales</CardTitle>
                <CardDescription>
                  Introduce las características principales de la matriz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-5">
                  <FormItem>
                    <FormLabel>Altura</FormLabel>
                    <FormControl>
                      <Input placeholder="3" value={'' + height} onChange={(e) => /^[2-7]$/.test(e.target.value) ? setHeight(parseInt(e.target.value)) : setHeight(2)}
                        className="w-28 h-12 text-center" />

                    </FormControl>

                  </FormItem>
                  <FormItem>
                    <FormLabel>Ancho</FormLabel>
                    <FormControl>
                      <Input placeholder="3" value={'' + width} onChange={(e) => /^[2-7]$/.test(e.target.value) ? setWidth(parseInt(e.target.value)) : setWidth(2)}
                        className="w-28 h-12 text-center" />
                    </FormControl>

                  </FormItem>
                  <FormItem>
                    <FormLabel>Nos Movemos</FormLabel>
                    <FormControl>
                      <Input placeholder="2" value={'' + move} onChange={(e) => /^[2-7]$/.test(e.target.value) ? setMove(parseInt(e.target.value)) : setMove(2)}
                        className="w-28 h-12 text-center" />
                    </FormControl>

                  </FormItem>
                </div>
              </CardContent>
            </Card>
            <Card className="w-fit h-fit">
              <CardHeader>
                <CardTitle>Parámetros De La Matriz</CardTitle>
                <CardDescription>
                  Podrás encontrar los parámetros de la matriz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-5">
                  <FormItem>
                    <FormLabel>Longitud</FormLabel>
                    <FormControl>
                      <Input placeholder="Valor" readOnly value={longitude}
                        className="w-28 h-12 bg-gray-100" />
                    </FormControl>

                  </FormItem>

                  <FormItem>
                    <FormLabel>Dimension</FormLabel>
                    <FormControl>
                      <Input placeholder="Valor" readOnly value={dimension}
                        className="w-28 h-12 bg-gray-100" />
                    </FormControl>

                  </FormItem>
                </div>
              </CardContent>
            </Card>
          </div>
        <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Códigos Lineales</CardTitle>
              <CardDescription>
                Introduce los códigos lineales
              </CardDescription>
            </CardHeader>
            <CardContent>
              
            <div className="grid gap-2 grid-cols-3">
                {codigos.map((codigo, i) => (
                  <div key={i} className="flex justify-center items-center bg-slate-100 py-2 px-4 rounded-md text-center hover:bg-slate-200 hover:cursor-pointer">
                    <p>{codigo}</p>
                  </div>
                ))}
                {codigos.length === 0 && <p className="col-span-3 text-center">No hay códigos</p>}
              </div>
            </CardContent>
          </Card>
          <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Matriz</CardTitle>
              <CardDescription>
                Genera la matriz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({ length: height }).map((_, i) => (
                  <div key={i} className="flex space-x-4 m-auto">
                    {Array.from({ length: width }).map((_, j) => (
                      <Input
                        key={j}
                        className="w-12 h-12 text-center"
                        placeholder="1"
                        value={matrix[i] ? '' + (matrix[i][j] ?? '') : ''}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          const regex = /^\d+$/;
                          if (regex.test('' + newValue) && newValue >= 0 && newValue < move) {
                            const newMatrix = [...matrix];
                            newMatrix[i][j] = newValue;
                            setMatrix(newMatrix);
                          } else {
                            const newMatrix = [...matrix];
                            newMatrix[i][j] = 0;
                            setMatrix(newMatrix);
                          }
                        }}
                      />
                    ))}
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Button onClick={onSubmit} className="w-full">Generar</Button>
                  <Button onClick={randomMatrix} className="w-full">Aleatorio</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}