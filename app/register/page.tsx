"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { useRouter } from "next/navigation"

//Creating main component Register
export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();
    const [name, setName] = useState("")
    const [error, setError] = useState("");
    
    

    async function handleSubmit(e: any) {
        e.preventDefault()

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify({ name, email, password})
        })
        const data = await res.json()

        if(!res.ok){
            setError(data.error || "Something went wrong")
            return
        }

        setError("")
        router.push("/login")
    }
    // Returning the UI
    return (
    <div className="flex justify-center mt-20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
           
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Name" onChange={(e)=>setName(e.target.value)} />
                <Input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
                {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-2 py-2 rounded">
                    {error}
                </div>
                )}
                <Button type="submit" className="cursor-pointer">Register</Button>
            </form>
             
        </CardContent>
        </Card>
        </div>
    )
}
