"use client"

import {useEffect, useState} from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer  } from "recharts"

export default function Dashboard() {
    const [data, setData] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        overdue: 0
    });

    const chartData = [
        { name: "Completed", value: data.completed || 0 },
        { name: "In Progress", value: data.inProgress || 0 },
        { name: "Not Started", value: data.notStarted || 0 },
        { name: "Overdue", value: data.overdue || 0 }
    ]

    const COLORS = ["#22c55e", "#eab308", "#9ca3af", "#ef4444"]

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
        
        setData({ total,completed, inProgress, notStarted, overdue })
    }
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition">
                <p className="text-gray-500">Total</p>
                <h2 className="text-2xl font-bold">{data.total}</h2>
                </div>

                <div className="bg-green-50 border-green-200 p-5 rounded-xl shadow-sm border">
                <p>Completed</p>
                <h2 className="text-2xl font-bold">{data.completed} ({data.total ? Math.round((data.completed / data.total) * 100) : 0}%)</h2>
                </div>

                <div className="bg-yellow-100 border-yellow-200 p-5 rounded-xl shadow-sm border">
                <p>In Progress</p>
                <h2 className="text-2xl font-bold">{data.inProgress} ({data.total ? Math.round((data.inProgress / data.total) * 100) : 0}%)</h2>
                </div>

                <div className="bg-gray-200 border-gray-200 p-5 rounded-xl shadow-sm border">
                <p>Not Started</p>
                <h2 className="text-2xl font-bold">{data.notStarted} ({data.total ? Math.round((data.notStarted / data.total) * 100) : 0}%)</h2>
                </div>

                <div className="bg-red-100 border-red-200 p-5 rounded-xl shadow-sm border">
                <p>Overdue</p>
                <h2 className="text-2xl font-bold">{data.overdue} ({data.total ? Math.round((data.overdue / data.total) * 100) : 0}%)</h2>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow mt-6 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Assignment Overview</h2>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer>
                    <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}                       
                        label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
                        >
                        {chartData.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                        ))}
                        </Pie>
                    
                    <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                        />
                    <Legend verticalAlign="bottom" height={36} />         
                               
                </PieChart>
                </ResponsiveContainer>
                </div>
            </div>
            

            <button onClick={() => window.location.href = "/assignments"}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg mt-6 transition cursor-pointer">
                Back to Assignments
            </button>
        </div>
    )
}