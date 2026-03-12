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
    const[assignments, setAssignments] = useState([])

    useEffect(()=>{
        fetch("/api/assignments")
        .then(res=>res.json())
        .then(data=>setAssignments(data))
    },[])
    
    //creating the UI component
    return(
        <div className="p-10">
      <h1 className="text-2xl mb-6">Assignments</h1>

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