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
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState("")
    const [newCategory, setNewCategory] = useState("")
    const [filterCategory, setFilterCategory] = useState("")

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
      loadCategories()
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
            difficulty,
            categoryId
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
        setCategoryId("")
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
              difficulty,
              categoryId
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
          setCategoryId("")
          } catch {
            setError("Couldn't update assignment")
          }
        }   

    async function loadCategories(){
      const res = await fetch("/api/categories")

      if (!res.ok) return

      const data = await res.json()
        setCategories(data)
    }

    //creating the UI component
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16">
          <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Assignments</h1>
      {error && <p className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button
          onClick={async () => {
            if (!newCategory) return

            const res = await fetch("/api/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: newCategory })
            })

            if (!res.ok) {
              const err = await res.json()
              setError(err.error)
              return
            }

            setNewCategory("")
            loadCategories()
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

    <form onSubmit={editingId ? updateAssignment : createAssignment} className="flex flex-wrap gap-3 mb-8 items-center">
      <input
      placeholder="Title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
      type="date"
      value={deadline}
      onChange={(e)=>setDeadline(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select status</option>
        <option value="1">Should Start</option>
        <option value="2" >In Progress</option>
        <option value="3">OverDue</option>
      </select>

      <select
      value={difficulty}
      onChange={(e)=>setDifficulty(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select difficulty</option>
        <option value="1">Easy</option>
        <option value="2">Mediocre</option>
        <option value="3">Hard</option>
      </select>

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 cursor-pointer rounded shadow">
        {editingId ? "Update" :"Create"}
      </button>

     
      {editingId && (
        <button 
          type="button"
          onClick={()=>{
          setEditingId(null)
          setTitle("")
          setDeadline("")
          setStatus("")
          setDifficulty("")
        }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded shadow transition cursor-pointer">
          Cancel
        </button>
      )}
      
    </form>


      <div className="mb-4">
      <select
        value={categoryId}
        onChange={(e)=>setCategoryId(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select category</option>

          {categories.map((c:any)=>(
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        </div>

      {assignments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-2">
                No assignments yet
              </p>
              <p className="text-gray-400">
                Create your first assignment!
              </p>
            </div>
          ) : (
            
      <Table>
        <TableHeader>
            <TableRow>
              <TableHead className="text-gray-600 font-semibold">Title</TableHead>
              <TableHead className="text-gray-600 font-semibold">Deadline</TableHead>
              <TableHead className="text-gray-600 font-semibold">Status</TableHead>
              <TableHead className="text-gray-600 font-semibold">Difficulty</TableHead>
              <TableHead className="text-gray-600 font-semibold">Category</TableHead>
              <TableHead className="text-gray-600 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

        <TableBody>
            {assignments
                  .filter((a: any) => {
                    if (!filterCategory) return true
                    return a.categoryId === filterCategory
                  })
                  .map((a: any) => (
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
                  <TableCell>{a.category?.name || "None"}</TableCell>

                  <TableCell>
                    <button onClick={()=> {
                        const confirmDelete = window.confirm("Are you sure you want to delete this assignment?")
                      if (confirmDelete){
                        deleteAssignment(a.id)
                      }
                    }}                    
                    className="bg-red-500 hover:bg-red-800 transition text-white cursor-pointer px-3 py-1 rounded shadow">
                      Delete
                    </button>
                    <button onClick={()=>{
                      setEditingId(a.id)
                      setTitle(a.title)
                      setDeadline(a.deadline.split("T")[0])
                      setStatus(a.status)
                      setDifficulty(a.difficulty.toString())
                      setCategoryId(a.categoryId || "")
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 transition cursor-pointer text-white px-4 py-1 rounded shadow ml-2"
                    >Edit
                    </button>
                  </TableCell>
                </TableRow>
            ))}
        </TableBody>
        </Table>
      )}
        </div>
      </div>
    )
  }