"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

//creating the Assignments component
export default function Assignments(){
    const [assignments, setAssignments] = useState([])
    const [title, setTitle] = useState("")
    const [deadline, setDeadline] = useState("")
    const [status, setStatus] = useState("")
    const [difficulty, setDifficulty] = useState("")

    useEffect(()=>{
        fetch("/api/assignments")
        .then(res=>res.json())
        .then(data=>setAssignments(data))
    },[])

    async function createAssignment(e: any) {
      e.preventDefault()

      await fetch("/api/assignments",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          deadline,
          status,
          difficulty
        })
      })

      const res = await fetch("/api/assignments")
      const data = await res.json()
      setAssignments(data)
      
    }
    
    //creating the UI component
    return(
        <div className="p-10">
      <h1 className="text-2xl mb-6">Assignments</h1>

    <form onSubmit={createAssignment} className="flex gap-2 mb-6">
      <input
      placeholder="Title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      className="border p-2"
      />

      <input
      type="date"
      value={deadline}
      onChange={(e)=>setDeadline(e.target.value)}
      className="border p-2"
      />

      <input
      placeholder="Status"
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
      className="border p-2"
      />

      <select
      value={difficulty}
      onChange={(e)=>setDifficulty(e.target.value)}
      className="border p-2"
      >
        <option value="">Select difficulty</option>
        <option value="1">Easy</option>
        <option value="2">Mediocre</option>
        <option value="3">Hard</option>
      </select>

      <button type="submit" className="bg-blue-500 text-white text-base px-6 py-2">
        Create
      </button>
      
    </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Difficulty</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
            {assignments.map((a:any)=>(
                <TableRow key={a.id}>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{a.deadline}</TableCell>
                    <TableCell>{a.status}</TableCell>
                    <TableCell>{a.difficulty}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
        </div>
    )
}