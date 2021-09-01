import './App.css'
import {fetchAllUserHealthData, fetchUserHealthData} from "./request/healthDataRequest"
import {AppBar, Tab, Tabs} from "@material-ui/core"
import TabPanel from './component/TabPanel'
import {createContext, useState} from "react"
import healthManagement from "./model/healthManagement"
import UserPage from "./page/UserPage"

function App() {
    const [tabIndex, setTabIndex] = useState(0)
    const [showingDiagram, setShowingDiagram] = useState(false)
    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex)
    }
    return (
        <div className="App">
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleChange}>
                    <Tab label="All user data"/>
                    <Tab label="Heart rate"/>
                    <Tab label="Blood oxygen"/>
                    <Tab label="Activity"/>
                    <Tab label="Drug"/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                <UserPage/>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                Heart Rate
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                Blood Oxygen
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                Activity
            </TabPanel>
            <TabPanel value={tabIndex} index={4}>
                Drug
            </TabPanel>
        </div>
    )
}

export default App
