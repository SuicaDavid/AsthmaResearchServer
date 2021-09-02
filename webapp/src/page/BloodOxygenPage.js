import React, {useEffect, useState} from "react"
import HealthManagement from "../model/healthManagement"
import TableView from "../component/TableView"

export default function BloodOxygenPage({}) {
    const [rows, setRows] = useState([])
    const columns = [
        {id: 'bloodOxygen', label: 'Blood Oxygen', minWidth: 100},
        {id: 'userId', label: 'User ID', minWidth: 170},
        {id: 'startTime', label: 'Start Time', minWidth: 100},
        {id: 'endTime', label: 'End Time', minWidth: 100},
    ]
    useEffect(()=>{
        HealthManagement.updateAllBloodOxygen()
            .then(() =>{
                setRows(HealthManagement.bloodOxygenData.map(data => {
                    return {
                        bloodOxygen: data.quantity,
                        userId: data.userId,
                        startTime: data.startTime,
                        endTime: data.endTime
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