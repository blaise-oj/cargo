import React from 'react'
import "./Sidebar.css"
import {assets} from "../../assets/assets"
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className='sidebar-options'>
            <NavLink to="/" className='sidebar-option'>
                <img src={assets.order_icon} alt="" />
                <p>Dashboard</p>
            </NavLink>
            <NavLink to= "/cargocharters" className='sidebar-option'>
                <img src={assets.add_icon} alt="" />
                <p>Cargo Charters</p>
            </NavLink>
            <NavLink to = "/passengercharters" className='sidebar-option'>
                <img src={assets.order_icon} alt="" />
                <p>Passenger Charters</p>
            </NavLink>
            <NavLink to= "/reports" className='sidebar-option'>
                <img src={assets.order_icon} alt="" />
                <p>Reports and Analytics</p>
            </NavLink>
        </div>
      
    </div>
  )
}

export default Sidebar
