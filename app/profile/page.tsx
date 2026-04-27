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

    const cleanName = name.trim()
    const cleanEmail = email.trim()

    if (!cleanName || !cleanEmail) {
        setMessage("Please fill in all fields")
        return
    }

    if (!cleanEmail.includes("@")) {
        setMessage("Please enter a valid email")
        return
    }

    const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: cleanName, 
            email: cleanEmail 
        })
    })

    const data = await res.json()

    if (res.ok) {
        setMessage("Profile updated successfully")
        setName(cleanName)
        setEmail(cleanEmail)
    } else {
        setMessage(data.error || "Failed to update profile")
    }
}

    async function logout() {
        await fetch("/api/logout", { method: "POST" })
        router.push("/login")
    }

   return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
            
            <div>
                <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your personal account information</p>
            </div>

            <form onSubmit={updateUser} className="space-y-5">
                <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-medium transition cursor-pointer">
                    Save Changes
                </button>
            </form>

            {message && (
                <p className={`text-sm text-center font-medium ${
                    message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-500"
                }`}>
                    {message}
                </p>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.push("/assignments")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition cursor-pointer"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={logout}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
                >
                    Log Out
                </button>
            </div>

        </div>
    </div>
)
}