'use client'


import ServiceCards from './ServiceCards';
import Stats from './Stats';
import Process from './Process';
import { useEffect, useState } from 'react';

function Services() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Add a small delay to match your GraphQL components
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 800) // Adjust this timing to match your Hero component loading
        
        return () => clearTimeout(timer)
    }, [])

    return (
        <section id='services-section' 
                 className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ServiceCards />
            <Stats />
            <Process />
        </section>
    )
}   

export default Services;

