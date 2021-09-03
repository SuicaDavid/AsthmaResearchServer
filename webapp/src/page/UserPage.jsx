import React, {useContext, useEffect, useState} from 'react'
import TableView from "../component/TableView"
import HealthManagement, {HealthDataContext} from "../model/healthManagement"
import {averageHealthData} from "../utility/healthDataCalculator"
import ChartView from "../component/ChartView"
import AddIcon from '@material-ui/icons/Add'
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Fab, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select,
    TextField
} from "@material-ui/core"
import BarChartView from "../component/BarChartView"

export default function UserPage() {
    const [rows, setRows] = useState([])
    const [user, setUser] = useState(null)
    const [heartRateData, setHeartRateData] = useState([])
    const [bloodOxygenData, setBloodOxygenData] = useState([])
    const [activityData, setActivityData] = useState([])
    const [drugData, setDrugData] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openHealthPlanDialog, setOpenHealthPlanDialog] = useState(false)
    const [activityType, setActivityType] = useState(0)
    const [activityQuantity, setActivityQuantity] = useState(1000)
    const [activityTime, setActivityTime] = useState(1)
    const [drugType, setDrugType] = useState(0)
    const [drugQuantity, setDrugQuantity] = useState(1)
    const [drugTime, setDrugTime] = useState(1)
    const columns = [
        {id: 'userId', label: 'User ID', minWidth: 170},
        {id: 'heartRate', label: 'Heart Rate', minWidth: 100},
        {id: 'bloodOxygen', label: 'Blood Oxygen', minWidth: 100},
        {id: 'activity', label: 'Activity', minWidth: 100},
        {id: 'drug', label: 'Drug', minWidth: 100},
    ]

    function updateHealthData() {
        console.log(HealthManagement.healthData)
        setRows(HealthManagement.healthData.map(user => {
            console.log(user.drugType.name)
            return {
                userId: user.userId,
                heartRate: averageHealthData(user.heartRate),
                bloodOxygen: averageHealthData(user.bloodOxygen),
                activity: user.activityType.name,
                drug: user.drugType.name
            }
        }))
    }

    useEffect(() => {
        HealthManagement.updateAllHealthData()
            .then(() => {
                updateHealthData()
            })
    }, [])

    useEffect(() => {
        if (user) {
            handleHeartRateChart()
            handleBloodOxygenChart()
            handleActivity()
            handleDrug()
        }
    }, [user])

    function handleClick(row) {
        if (user && row.userId === user.userId) {
            setUser(null)
        } else {
            const currentUser = HealthManagement.healthData.find(data => data.userId === row.userId)
            setUser(currentUser)
        }
    }

    function handleDeleteOpen() {
        setOpenDeleteDialog(true)
    }

    function handleDeleteClose() {
        setOpenDeleteDialog(false)
    }

    function handleAllHealthPlanOpen() {
        setUser(null)
        setOpenHealthPlanDialog(true)
    }

    function handleHealthPlanOpen() {
        setOpenHealthPlanDialog(true)
    }

    function handleHealthPlanClose() {
        setOpenHealthPlanDialog(false)
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
                {primary: true, type: 'ordinal', position: 'bottom'},
                {position: 'left', type: 'linear', stacked: true}
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
                {primary: true, type: 'ordinal', position: 'bottom'},
                {position: 'left', type: 'linear', stacked: true}
            ]
        }
        setDrugData(drug)
    }

    function addHealthPlan() {
        console.log('one')
        let requestData = {
            userId: user.userId,
        }
        if (activityType !== 0) {
            requestData.activity = {
                name: activityType === 1 ? "walk" : "run",
                quantity: parseInt(activityQuantity, 10),
                timeInterval: `${activityTime}-day`
            }
        }
        if (drugType !== 0) {
            requestData.drug = {
                name: drugType === 1 ? "Xanthine" : "Antileukotriene",
                quantity: parseInt(drugQuantity, 10),
                timeInterval: `${drugTime}-day`
            }
        }
        HealthManagement.allocateHealthPlan(requestData)
            .then(data => {
                console.log(data)
                if (data) {
                    updateHealthData()
                }
            })
            .finally(() => {
                setOpenHealthPlanDialog(false)
            })
    }

    function addAllHealthPlan() {
        console.log('all')
        let requestData = {}
        if (activityType !== 0) {
            requestData.activity = {
                name: activityType === 1 ? "walk" : "run",
                quantity: parseInt(activityQuantity, 10),
                timeInterval: `${activityTime}-day`
            }
        }
        if (drugType !== 0) {
            requestData.drug = {
                name: drugType === 1 ? "Xanthine" : "Antileukotriene",
                quantity: parseInt(drugQuantity, 10),
                timeInterval: `${drugTime}-day`
            }
        }
        HealthManagement.allocateAllHealthPlan(requestData)
            .then(data => {
                console.log(data)
                if (data) {
                    updateHealthData()
                }
            })
            .finally(() => {
                setOpenHealthPlanDialog(false)
            })
    }

    function deleteHealthPlan() {
        HealthManagement.deleteUserHealthData(user.userId)
            .then(data => {
                console.log(data)
                if (data) {
                    updateHealthData()
                }
            })
            .finally(() => {
                setOpenDeleteDialog(false)
            })
    }

    return (
        <>
            <TableView rows={rows} columns={columns} onRowClick={handleClick}/>
            <Fab color="primary" style={{position: 'absolute', right: 50, bottom: 50}}
                 onClick={handleAllHealthPlanOpen}>
                <AddIcon/>
            </Fab>
            {
                user && <Card style={{marginTop: 20, padding: 10}}>
                    <div style={{margin: 20, display: 'flex', justifyContent: 'space-around'}}>
                        <Button variant="contained" color="primary" onClick={handleHealthPlanOpen}>
                            Create Health Plan for {user.userId}
                        </Button>

                        <Button variant="contained" color="secondary" onClick={handleDeleteOpen}>
                            Delete user {user.userId}
                        </Button>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        flexFlow: 'wrap'
                    }}>
                        <ChartView data={heartRateData.data} label={heartRateData.label} axes={heartRateData.axes}
                                   series={heartRateData.series}/>
                        <ChartView data={bloodOxygenData.data} label={bloodOxygenData.label} axes={bloodOxygenData.axes}
                                   series={bloodOxygenData.series}/>
                        <BarChartView data={activityData.data} label={activityData.label} axes={activityData.axes}
                                      series={activityData.series}/>
                        <BarChartView data={drugData.data} label={drugData.label} axes={drugData.axes}
                                      series={drugData.series}/>
                    </div>
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleDeleteClose}
                    >
                        <DialogTitle id="alert-dialog-title">{`Delete user ${user.userId}?`}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to delete the data of {user.user}?
                                This process cannot be reversed.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={deleteHealthPlan} color="secondary" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Card>
            }
            <Dialog open={openHealthPlanDialog} onClose={handleHealthPlanClose}>
                <DialogTitle id="form-dialog-title">Add Health Plan
                    to {user ? user.userId : "All Participants"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to set up health plan to {user ? user.userId : "all participants"}?
                    </DialogContentText>
                    <FormControl>
                        <InputLabel id="activity-type-select-label">Activity</InputLabel>
                        <Select
                            labelId="activity-type-select-label"
                            id="activity-type-select"
                            value={activityType}
                            onChange={(event) => setActivityType(event.target.value)}
                        >
                            <MenuItem value={0}>None</MenuItem>
                            <MenuItem value={1}>Walk</MenuItem>
                            <MenuItem value={2}>Run</MenuItem>
                        </Select>
                        {
                            activityType !== 0 ? <div>
                                <TextField
                                    autoFocus
                                    // margin="dense"
                                    id="name"
                                    label="Daily activity (meter)"
                                    type="number"
                                    fullWidth
                                    min={0}
                                    required
                                    value={activityQuantity}
                                    InputProps={{inputProps: {min: 0}}}
                                    onChange={(event) => setActivityQuantity(event.target.value)}
                                />
                                <RadioGroup value={"day"}>
                                    <FormControlLabel value="day" control={<Radio disabled/>} label="day"/>
                                </RadioGroup>
                                <TextField
                                    autoFocus
                                    id="time"
                                    label="Daily activity times (Daily)"
                                    type="number"
                                    fullWidth
                                    min={0}
                                    required
                                    value={activityTime}
                                    InputProps={{inputProps: {min: 0}}}
                                    onChange={(event) => setActivityTime(event.target.value)}
                                />
                            </div> : null
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel id="drug-type-select-label">Drug</InputLabel>
                        <Select
                            labelId="drug-type-select-label"
                            id="drug-type-select"
                            value={drugType}
                            onChange={(event) => setDrugType(event.target.value)}
                        >
                            <MenuItem value={0}>None</MenuItem>
                            <MenuItem value={1}>Xanthine</MenuItem>
                            <MenuItem value={2}>Antileukotriene</MenuItem>
                        </Select>
                        {
                            drugType !== 0 ? <div>
                                <TextField
                                    autoFocus
                                    // margin="dense"
                                    id="unit"
                                    label="Daily drug (unit)"
                                    type="number"
                                    fullWidth
                                    min={0}
                                    required
                                    value={drugQuantity}
                                    InputProps={{inputProps: {min: 0}}}
                                    onChange={(event) => setDrugQuantity(event.target.value)}
                                />
                                <RadioGroup value={"day"}>
                                    <FormControlLabel value="day" control={<Radio disabled/>} label="day"/>
                                </RadioGroup>
                                <TextField
                                    autoFocus
                                    // margin="dense"
                                    id="time"
                                    label="Daily usage times (Daily)"
                                    type="number"
                                    fullWidth
                                    min={0}
                                    required
                                    value={drugTime}
                                    InputProps={{inputProps: {min: 0}}}
                                    onChange={(event) => setDrugTime(event.target.value)}
                                />
                            </div> : null
                        }
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleHealthPlanClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={user ? addHealthPlan : addAllHealthPlan} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}