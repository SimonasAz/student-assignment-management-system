"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

//Creating main component Register
export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    

    async function handleSubmit(e: any) {
        e.preventDefault()

        await fetch("/api/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
        },
            body: JSON.stringify({ name, email, password})
        })
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
                <Button type="submit">Register</Button>
            </form>
        </CardContent>
        </Card>
        </div>
    )
}
