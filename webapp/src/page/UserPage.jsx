import React, {useContext, useEffect, useState} from 'react'
import TableView from "../component/TableView"
import HealthManagement, {HealthDataContext} from "../model/healthManagement"
import {averageHealthData} from "../utility/healthDataCalculator"
import ChartView from "../component/ChartView"
import {Card} from "@material-ui/core"
import BarChartView from "../component/BarChartView"

export default function UserPage() {
    const [rows, setRows] = useState([])
    const [user, setUser] = useState(null)
    const [heartRateData, setHeartRateData] = useState([])
    const [bloodOxygenData, setBloodOxygenData] = useState([])
    const [activityData, setActivityData] = useState([])
    const [drugData, setDrugData] = useState([])
    const columns = [
        {id: 'userId', label: 'User ID', minWidth: 170},
        {id: 'heartRate', label: 'Heart Rate', minWidth: 100},
        {id: 'bloodOxygen', label: 'Blood Oxygen', minWidth: 100},
        {id: 'activity', label: 'Activity', minWidth: 100},
        {id: 'drug', label: 'Drug', minWidth: 100},
    ]
    useEffect(() => {
        HealthManagement.updateAllHealthData()
            .then(() => {
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

    useEffect(() => {
        console.log("user", user)
        if (user) {
            handleHeartRateChart()
            handleBloodOxygenChart()
            handleActivity()
            handleDrug()
        }
    }, [user])

    function handleClick(row) {
        const currentUser = HealthManagement.healthData.find(data => data.userId == row.userId)
        setUser(currentUser)
    }

    function handleHeartRateChart() {
        const heartRate = {
            data: user.heartRate.map((data, index) => {
                return [index, data.quantity]
            }),
            label: "Heart Rate",
            series: {
                type: 'line'
            },
            axes: [
                {primary: true, type: 'linear', position: 'bottom'},
                {type: 'linear', position: 'left'}
            ]
        }
        setHeartRateData(heartRate)
    }

    function handleBloodOxygenChart() {
        const bloodOxygen = {
            data: user.bloodOxygen.map((data, index) => {
                return [index, data.quantity]
            }),
            label: "Blood Oxygen",
            series: {
                type: 'line'
            },
            axes: [
                {primary: true, type: 'ordinal', position: 'bottom'},
                {type: 'linear', position: 'left'}
            ]
        }
        setBloodOxygenData(bloodOxygen)
    }
    function handleActivity() {
        const activity = {
            data: user.activity.map((data, index) => {
                return {
                    x: index,
                    y: data.quantity,
                    r: undefined
                }
            }),
            label: "Activity",
            series: {
                type: 'bar'
            },
            axes: [
                { primary: true, type: 'ordinal', position: 'bottom' },
                { position: 'left', type: 'linear', stacked: true }
            ]
        }
        setActivityData(activity)
    }
    function handleDrug() {
        const drug = {
            data: user.drug.map((data, index) => {
                return {
                    x: index,
                    y: data.quantity,
                    r: undefined
                }
            }),
            label: "Drug",
            series: {
                type: 'bar'
            },
            axes: [
                { primary: true, type: 'ordinal', position: 'bottom' },
                { position: 'left', type: 'linear', stacked: true }
            ]
        }
        setDrugData(drug)
    }

    return (
        <>
            <TableView rows={rows} columns={columns} onRowClick={handleClick}/>
            {
                user && <Card style={{marginTop: 20, padding: 10}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flexFlow: 'wrap'}}>
                        <ChartView data={heartRateData.data} label={heartRateData.label} axes={heartRateData.axes} series={heartRateData.series}/>
                        <ChartView data={bloodOxygenData.data} label={bloodOxygenData.label} axes={bloodOxygenData.axes} series={bloodOxygenData.series}/>
                        <BarChartView data={activityData.data} label={activityData.label} axes={activityData.axes} series={activityData.series}/>
                        <BarChartView data={drugData.data} label={drugData.label} axes={drugData.axes} series={drugData.series}/>
                    </div>
                </Card>
            }
        </>
    )
}