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
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null)

    async function loadAssignments() {
      try {
        setError("")

        const res = await fetch("/api/assignments")

        if (!res.ok) {
          const errorData = await res.json()
          setError(errorData.error || "Failed to fetch assignments")
          return
        }
        const data = await res.json()
        setAssignments(data)

      } catch {        
        setError("Couldn't fetch assignments")
      }
    }

    useEffect(() => {
      loadAssignments()
    }, [])   
    

    async function createAssignment(e: any) {
        e.preventDefault()
        setError("")        

        try {
          const res = await fetch("/api/assignments",{       
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

        if (!res.ok) {
          const errorData = await res.json()
          setError(errorData.error || "Failed to create assignment")
          return
        }
        
        await loadAssignments()

        setTitle("")
        setDeadline("")
        setStatus("")
        setDifficulty("")
        } catch {
          setError("Couldn't create assignment")
        }         
    }

    async function deleteAssignment(id: string) {
      setError("")

        try{
            const res = await fetch(`/api/assignments/${id}`, {
                method: "DELETE"
              })

            if (!res.ok) {
              const errorData = await res.json()
              setError(errorData.error || "Failed to delete assignment")
              return
            }
            await loadAssignments()
        } catch {
          setError("Couldn't delete assignment")
        }
    }

    async function updateAssignment(e: any) {
            e.preventDefault()

            if(!editingId) return
            setError("")

            try {
            const res = await fetch(`/api/assignments/${editingId}`, {
            method: "PUT",
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

          if (!res.ok) {
            const errorData = await res.json()
            setError(errorData.error || "Failed to update assignment")
            return
          }
          await loadAssignments()

          setEditingId(null)
          setTitle("")
          setDeadline("")
          setStatus("")
          setDifficulty("")
          } catch {
            setError("Couldn't update assignment")
          }
        }   

    //creating the UI component
    return(
        <div className="p-10">
      <h1 className="text-2xl mb-6">Assignments</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

    <form onSubmit={editingId ? updateAssignment : createAssignment} className="flex gap-2 mb-6 flex-wrap ">
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

      <select
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
      className="border p-2"
      >
        <option value="">Select status</option>
        <option value="1">Should Start</option>
        <option value="2">In Progress</option>
        <option value="3">OverDue</option>
      </select>

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

      <button type="submit" className="bg-blue-500 text-white text-base px-6 py-2 cursor-pointer">
        {editingId ? "Update" :"Create"}
      </button>
      
    </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
            {assignments.map((a:any)=>(
                <TableRow key={a.id}>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{new Date(a.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{a.status == "1"
                      ? "Should Start"
                    : a.status == "2"
                      ? "In Progress"
                    : "OverDue"}
                  </TableCell>
                    <TableCell>
                      {a.difficulty == "1"
                      ? "Easy"
                    : a.difficulty == "2"
                    ? "Mediocre"
                  : "Hard"}
                  </TableCell>

                  <TableCell>
                    <button onClick={()=> deleteAssignment(a.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer">
                      Delete
                    </button>
                    <button onClick={()=>{
                      setEditingId(a.id)
                      setTitle(a.title)
                      setDeadline(a.deadline.split("T")[0])
                      setStatus(a.status)
                      setDifficulty(a.difficulty.toString())
                    }}
                    className="bg-yellow-500 text-white px-4 py-1 rounded cursor-pointer ml-2"
                    >Edit
                    </button>
                  </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
        </div>
    )
  }