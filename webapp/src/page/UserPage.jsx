import React, {useContext, useEffect, useState} from 'react'
import TableView from "../component/TableView"
import HealthManagement, {HealthDataContext} from "../model/healthManagement"
import {averageHealthData} from "../utility/healthDataCalculator"

export default function UserPage() {
    const [rows, setRows] = useState([])
    const columns = [
        {id: 'userId', label: 'User ID', minWidth: 170},
        {id: 'heartRate', label: 'Heart Rate', minWidth: 100},
        {id: 'bloodOxygen', label: 'Blood Oxygen', minWidth: 100},
        {id: 'activity', label: 'Activity', minWidth: 100},
        {id: 'drug', label: 'Drug', minWidth: 100},
    ]
    useEffect(()=>{
        HealthManagement.updateAllHealthData()
            .then(() =>{
                setRows(HealthManagement.healthData.map(user => {
                    return {
                        userId: user.userId,
                        heartRate: averageHealthData(user.heartRate),
                        bloodOxygen: averageHealthData(user.bloodOxygen),
                        activity: user.activityType.name,
                        drug: user.drugType.name
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