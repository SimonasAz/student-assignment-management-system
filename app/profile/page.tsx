"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
export default function Profile() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const router = useRouter()

    useEffect(() => {
        loadUser()
    }, [])

    async function loadUser() {
        const res = await fetch("/api/user")

        if (!res.ok) return

        const data = await res.json()
        setName(data.name)
        setEmail(data.email)
    }

    async function updateUser(e: any) {
        e.preventDefault()

        const res = await fetch("/api/user", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        })

        const data = await res.json()
        if (res.ok) {
                setMessage("Profile updated successfully")
                router.push("/assignments")
            } else {
                setMessage(data.error || "Failed to update profile")
            }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={updateUser}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold">Profile</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Save Changes
        </button>

        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
    )

}