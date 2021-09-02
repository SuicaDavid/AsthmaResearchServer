import './App.css'
import {fetchAllUserHealthData, fetchUserHealthData} from "./request/healthDataRequest"
import {AppBar, Tab, Tabs} from "@material-ui/core"
import TabPanel from './component/TabPanel'
import {createContext, useState} from "react"
import UserPage from "./page/UserPage"
import HeartRatePage from "./page/HeartRatePage"
import BloodOxygenPage from "./page/BloodOxygenPage"
import ActivityPage from "./page/ActivityPage"
import DrugPage from "./page/DrugPage"

function App() {
    const [tabIndex, setTabIndex] = useState(0)
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
                <HeartRatePage/>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <BloodOxygenPage/>
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                <ActivityPage/>
            </TabPanel>
            <TabPanel value={tabIndex} index={4}>
                <DrugPage/>
            </TabPanel>
        </div>
    )
}

export default App
