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
    const [priority, setPriority] = useState("")
    const [showOverdueOnly, setShowOverdueOnly] = useState(false)
    const [sortBy, setSortBy] = useState("deadline")
    const [filterCategory, setFilterCategory] = useState("")
    const [sortDirection, setSortDirection] = useState("asc")
    const today = new Date()
    
    today.setHours(0,0,0,0)

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
            categoryId,
            priority
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
        setPriority("")
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
              categoryId,
              priority
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
          setPriority("")
          } catch {
            setError("Couldn't update assignment")
          }
        }   

        // Second itteration - adding categories
    async function loadCategories(){
      const res = await fetch("/api/categories")

      if (!res.ok) return

      const data = await res.json()
        setCategories(data)
    }

    //creating the UI component
    return(
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16">
          <div className="w-full max-w-6xl space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Assignments</h1>
      {error && <p className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{error}</p>}

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Categories </h2>    
          

          <div className="flex gap-2">
            <input
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
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
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <span>{c.name}</span>
                <button
                  className="text-gray-500 hover:text-red-500"
                  onClick={async () => {
                    if (!confirm("Delete category?")) return

                    const res = await fetch(`/api/categories/${c.id}`, {
                      method: "DELETE"
                    })

                    if (!res.ok) {
                      const err = await res.json()
                      setError(err.error)
                      return
                    }

                    loadCategories()
                    loadAssignments()
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Assignment" : "Create Assignment"}
        </h2>

      <form onSubmit={editingId ? updateAssignment : createAssignment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <input
      placeholder="Title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
      type="date"
      value={deadline}
      onChange={(e)=>setDeadline(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
      value={status}
      onChange={(e)=>setStatus(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select status</option>
        <option value="1">Not Started</option>
        <option value="2" >In Progress</option>
        <option value="3">Completed</option>
      </select>

      <select
      value={difficulty}
      onChange={(e)=>setDifficulty(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select difficulty</option>
        <option value="1">Easy</option>
        <option value="2">Mediocre</option>
        <option value="3">Hard</option>
      </select>
      
      <select
        value={priority}
        onChange={(e)=>setPriority(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select priority</option>
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High (ASAP)</option>
      </select>
      
      <select
        value={categoryId}
        onChange={(e)=>setCategoryId(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select category</option>

          {categories.map((c:any)=>(
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>        

      <button type="submit" className="col-span-1 md:col-span-2 lg:col-span-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
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
    </div>
    
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOverdueOnly}
                onChange={(e) => setShowOverdueOnly(e.target.checked)}
              />
              Show only overdue
            </label>
          <span className="text-gray-600 font-medium">Filter:</span>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select 
          value={sortBy}
          onChange={(e)=>setSortBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="deadline">Sort by deadline</option>            
            <option value="priority">Sort by priority</option>
          </select>

          <select
            value={sortDirection}
            onChange={(e)=>setSortDirection(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
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
            
            
    <div className="bg-white shadow-md rounded-xl p-4">
      <Table>
        <TableHeader>
            <TableRow>
              <TableHead className="text-gray-600 font-semibold">Title</TableHead>
              <TableHead className="text-gray-600 font-semibold">Deadline</TableHead>
              <TableHead className="text-gray-600 font-semibold">Status</TableHead>
              <TableHead className="text-gray-600 font-semibold">Difficulty</TableHead>
              <TableHead className="text-gray-600 font-semibold">Priority</TableHead>
              <TableHead className="text-gray-600 font-semibold">Category</TableHead>
              <TableHead className="text-gray-600 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

        <TableBody>
                      
            {assignments
                .filter((a: any) => {
                  const deadlineDate = new Date(a.deadline)
                  deadlineDate.setHours(0, 0, 0, 0)

                  const isCompleted = Number(a.status) === 3
                  const isOverdue = deadlineDate < today && !isCompleted

                  if (filterCategory && String(a.categoryId) !== filterCategory) return false
                  if (showOverdueOnly && !isOverdue) return false

                  return true
                })

                .sort((a: any, b: any) => {                  
                    const aDeadline = new Date(a.deadline)
                    const bDeadline = new Date(b.deadline)

                    aDeadline.setHours(0,0,0,0)
                    bDeadline.setHours(0,0,0,0)

                    const aOverdue = aDeadline < today && Number(a.status) !== 3
                    const bOverdue = bDeadline < today && Number(b.status) !== 3  

                    const direction = sortDirection === "asc" ? 1 : -1


                    const getPriority = (p: any) => {
                        if (p === null || p === undefined) return -1 
                          return Number(p)
                      }
                    
                    if (aOverdue !== bOverdue) {
                      return bOverdue ? 1 : -1
                    }   
                    
                   if (sortBy === "priority") {
                      const diff = (getPriority(a.priority) - getPriority(b.priority)) * direction

                      if (diff !== 0) return diff  

                    return (aDeadline.getTime() - bDeadline.getTime()) * direction
                  }      

                    return (aDeadline.getTime() - bDeadline.getTime()) * direction
                  })
                

                .map((a: any) => {
                  const deadlineDate = new Date(a.deadline)
                  deadlineDate.setHours(0, 0, 0, 0)

                  const statusNumber = Number(a.status)
                  const isCompleted = statusNumber === 3
                  const isOverdue = deadlineDate < today && !isCompleted

                    return (                
                    <TableRow
                        key={a.id}
                        className={`hover:bg-gray-50 transition ${
                          isOverdue ? "bg-red-50" : a.priority == "3" ? "bg-yellow-50" : ""
                        }`}
                      >
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{new Date(a.deadline).toLocaleDateString()}</TableCell>
                    
                    <TableCell>
                      {isOverdue ? (
                        <span className="px-2 py-1 rounded bg-red-500 text-white">
                          Overdue
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                          Completed
                        </span>
                      ) :  statusNumber === 1 ? (
                        <span className="px-2 py-1 rounded bg-gray-200 text-gray-700">
                          Not Started
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                          In Progress
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                            className={
                              a.difficulty == "1"
                                ? "text-green-600 font-medium"
                                : a.difficulty == "2"
                                ? "text-yellow-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {a.difficulty == "1"
                              ? "Easy"
                              : a.difficulty == "2"
                              ? "Mediocre"
                              : "Hard"}
                          </span>
                  </TableCell>
                  <TableCell>
                      <span
                        className={
                          a.priority == "1"
                            ? "text-gray-500"
                            : a.priority == "2"
                            ? "text-yellow-600 font-medium"
                            : "text-red-600 font-bold"
                        }
                      >
                        {a.priority == "1"
                          ? "Low"
                          : a.priority == "2"
                          ? "Medium"
                          : "High"}
                      </span>
                    </TableCell>
                  <TableCell>{a.category?.name || "None"}</TableCell>

                  <TableCell>
                    <button onClick={()=> {
                        const confirmDelete = window.confirm("Are you sure you want to delete this assignment?")
                      if (confirmDelete){
                        deleteAssignment(a.id)
                      }
                    }}                    
                    className="bg-red-400 hover:bg-red-600 transition text-white cursor-pointer px-3 py-1 rounded shadow">
                      Delete
                    </button>
                    <button onClick={()=>{
                      setEditingId(a.id)
                      setTitle(a.title)
                      setDeadline(a.deadline.split("T")[0])
                      setStatus(a.status)
                      setDifficulty(a.difficulty.toString())
                      setCategoryId(a.categoryId || "")
                      setPriority(a.priority?.toString() || "")
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 transition cursor-pointer text-white px-4 py-1 rounded shadow ml-2"
                    >Edit
                    </button>
                  </TableCell>
                </TableRow> 
                )          
              })}
        </TableBody>
        
        </Table>
      </div>
      )}
        </div>
      </div>
    )
  }