import React from 'react'
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'

const Hero = () => {
  return (
    <div className='hero container'>
        <div className='hero-text'> 
            <h1>GOLDSTRIKE ENTERPRISE LIMITED</h1>
            <p>Your Trusted Partner in Air Freight and Charter Services</p>
            <button className='btn'>Explore more<img src={dark_arrow} alt=''></img></button>
        </div>
      
    </div>
  )
}

export default Hero
