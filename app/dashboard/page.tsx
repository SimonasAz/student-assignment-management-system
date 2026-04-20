"use client"

import {useEffect, useState} from "react"

export default function Dashboard() {
    const [data, setData] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        overdue: 0
    });

    useEffect(() => {
        loadDashboard()
    }, [])

    async function loadDashboard() {
        const res = await fetch("/api/assignments")

        if (!res.ok) return

        const result = await res.json()
        const assignments = result.assignments || result
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let total = assignments.length
        let completed = 0
        let inProgress = 0
        let notStarted = 0
        let overdue = 0

        assignments.forEach((a: any) => {
            const deadline = new Date(a.deadline)
            deadline.setHours(0, 0, 0, 0)

            const status = Number(a.status)

            if (status === 3) completed++
            else if (status === 2) inProgress++
            else notStarted++

            if (deadline < today && status !== 3) overdue++
        })

        const completedPercent = total ? Math.round((completed / total) * 100) : 0

        
        setData({ total,completed, inProgress, notStarted, overdue })
    }
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Total</p>
                <h2 className="text-2xl font-bold">{data.total}</h2>
                </div>

                <div className="bg-green-100 p-4 rounded shadow">
                <p>Completed</p>
                <h2 className="text-2xl font-bold">{data.completed} ({data.total ? Math.round((data.completed / data.total) * 100) : 0}%)</h2>
                </div>

                <div className="bg-yellow-100 p-4 rounded shadow">
                <p>In Progress</p>
                <h2 className="text-2xl font-bold">{data.inProgress} ({data.total ? Math.round((data.inProgress / data.total) * 100) : 0}%)</h2>
                </div>

                <div className="bg-gray-200 p-4 rounded shadow">
                <p>Not Started</p>
                <h2 className="text-2xl font-bold">{data.notStarted} ({data.total ? Math.round((data.notStarted / data.total) * 100) : 0}%)</h2>
                </div>

                <div className="bg-red-100 p-4 rounded shadow">
                <p>Overdue</p>
                <h2 className="text-2xl font-bold">{data.overdue} ({data.total ? Math.round((data.overdue / data.total) * 100) : 0}%)</h2>
                </div>
            </div>
        </div>
    )
}