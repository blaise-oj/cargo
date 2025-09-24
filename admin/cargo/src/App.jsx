import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
import CargoCharters from './Pages/CargoCharters/CargoCharters'
import PassengerCharters from './Pages/PassengerCharters/PassengerCharters'
import ReportsAnalytics from './Pages/ReportsAnalytics/ReportsAnalytics'

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className='app-content'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/cargocharters/*' element={<CargoCharters/>} />
          <Route path='/passengercharters/*' element={<PassengerCharters/>} />
          <Route path='/reports' element={<ReportsAnalytics/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
