import './App.css'
import {fetchUserHealthData} from "./request/healthDataRequest"
import {AppBar, Tab, Tabs} from "@material-ui/core"
import TabPanel from './component/TabPanel'
import {useState} from "react"
import healthManagement from "./model/healthManagement"

function App() {
    const [tabIndex, setTabIndex] = useState(0)
    console.log(healthManagement)
    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex)
    }
    return (
        <div className="App">
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Item One"/>
                    <Tab label="Item Two"/>
                    <Tab label="Item Three"/>
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                Item Three
            </TabPanel>
        </div>
    )
}

export default App
