"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleSubmit(e:any){
    e.preventDefault()

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if(!res.ok){
      setError(data.error || "Login failed")
      return
    }

    setError("")
    router.push("/assignments")
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <Card className="w-[400px] shadow-lg">

        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome Back !
          </CardTitle>
          <CardDescription>
            Log back in to view your assignments
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                  {error}
                </div>
              )}
            <Button className="w-full cursor-pointer">
              Login
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/register" className="underline">
                Register
              </a>
            </p>

          </form>
        </CardContent>

      </Card>

    </div>
  )
}