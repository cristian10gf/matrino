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

export function Matrix4Form() {
  const [width, setWidth] = useState(3)
  const [dimension, setDimension] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [move, setMove] = useState(2)
  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: 1 }, () => Array.from({ length: width }, () => 0))
  );
  
  const [codigos, setCodigos] = useState<string[]>([])
  const [codigo, setCodigo] = useState('')
  useEffect(() => {
    setMatrix(Array.from({ length: 1 }, () => Array.from({ length: width }, () => 0)))
  }, [width, move])
  
  useEffect(() => {
    setCodigo(generarString())
    setCodigos([])
  }, [width, move])
  const form = useForm<MatrixFormValues>({
    resolver: zodResolver(matrixFormSchema),
    defaultValues,
  })

  async function onSubmit() {
    console.log({
      z: move,
      code: codigos,
    })
    await fetch("https://code-theory-api.onrender.com/code-to-generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        z: move,
        code: codigos,
      })
    }).then(async (res) => {

      const response = await res.json()
      if (response.success) {
        setDimension(response.k)
        setLongitude(response.n)
        setMatrix(response.matrix)
      }
    })
  }
  
  function verificaString(string: string) {
    if (string.length !== width) {
      return false;
    }
    for (let i = 0; i < width; i++) {
      if (isNaN(parseInt(string[i]))) {
        return false;
      }
    }
    for (let i = 0; i < width; i++) {
      if (parseInt(string[i]) < 0 || parseInt(string[i]) >= move) {
        return false;
      }
    }
    return true;
  }
  function verificaString2(string: string) {
    for (let i = 0; i < width; i++) {
      if (isNaN(parseInt(string[i]))) {
        return false;
      }
    }
    for (let i = 0; i < width; i++) {
      if (parseInt(string[i]) < 0 || parseInt(string[i]) >= move) {
        return false;
      }
    }
    return true;
  }
  const generarString = () => {
    let string = "";
    for (let i = 0; i < width; i++) {
      string += 0;
    }
    return string;
  }
  return (
    <Form {...form}>

      <form onSubmit={(e)=>{e.preventDefault()}} className="flex flex-col gap-4 w-fit h-fit">
        <h1 className="text-4xl mx-auto max-w-[600px] mb-10 font-bold text-warp text-center">Matrino: Generador de Matrices y parámetros</h1>
  
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
              <div className="flex flex-col gap-5">
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="" value={codigo} onChange={(e) => {
                      if (verificaString2(e.target.value)) {
                        setCodigo(e.target.value)
                      } else {
                        setCodigo(generarString())
                      }
                    }}
                      className="h-12 text-center" />

                  </FormControl>

                </FormItem>
                
                <div className="flex space-x-2">
                  <Button onClick={onSubmit} className="w-full">Generar</Button>
                <Button onClick={() => {
                  if (!codigos.includes(codigo) && verificaString(codigo)) {
                    setCodigos([...codigos, codigo])
                  }
                }} className="w-full"
                >Agregar</Button>

                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full flex-1">
            <CardContent>
              <div className="grid gap-2 py-6 grid-cols-3">
                {codigos.map((codigo, i) => (
                  <div key={i} className="flex justify-center items-center bg-slate-100 py-2 px-4 rounded-md text-center hover:bg-slate-200 hover:cursor-pointer"
                    onClick={() => {
                      setCodigos(codigos.filter((c) => c !== codigo))
                    }}>
                    <p>{codigo}</p>
                  </div>
                ))}
                {codigos.length === 0 && <p className="col-span-3 text-center">No hay códigos</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col md:flex-row  md:justify-between gap-4">
        <Card className="w-fit h-fit">
            <CardHeader>
              <CardTitle>Matriz</CardTitle>
              <CardDescription>
                Genera la matriz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({ length: matrix.length }).map((_, i) => (
                  <div key={i} className="flex space-x-4 m-auto">
                    {Array.from({ length: matrix[0].length }).map((_, j) => (
                      <Input
                        key={j}
                        className="w-12 h-12 text-center"
                        placeholder="1"
                        readOnly
                        value={matrix[i] ? '' + (matrix[i][j] ?? '') : ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}