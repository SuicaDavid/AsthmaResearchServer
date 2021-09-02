import React, {useEffect, useState} from "react"
import HealthManagement from "../model/healthManagement"
import TableView from "../component/TableView"

export default function DrugPage({}) {
    const [rows, setRows] = useState([])
    const columns = [
        {id: 'type', label: 'Type', minWidth: 100},
        {id: 'drug', label: 'Drug', minWidth: 100},
        {id: 'userId', label: 'User ID', minWidth: 170},
        {id: 'time', label: 'Time', minWidth: 100},
    ]
    useEffect(()=>{
        HealthManagement.updateAllDrug()
            .then(() =>{
                setRows(HealthManagement.drugData.map(data => {
                    return {
                        drug: data.quantity,
                        userId: data.userId,
                        type: data.name,
                        time: data.time
                    }
                }))
            })
    }, [])
    function handleClick(row) {
        console.log(row)
    }
    return (
        <>
            <TableView rows={rows} columns={columns} onRowClick={handleClick}/>
        </>
    )
}