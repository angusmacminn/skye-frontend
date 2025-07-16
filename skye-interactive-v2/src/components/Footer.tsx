'use client'

import Link from "next/link";
import { useState, useEffect } from 'react'

function Footer() {
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
        // Add a small delay to match your GraphQL components
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 500) // Adjust this timing to match your Hero component loading
        
        return () => clearTimeout(timer)
    }, [])

    return (
        <footer className={`bg-skye-gray text-skye-white transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* rest of your footer content stays the same */}
            <div className='container mx-auto px-4 py-8'>
                <h2 className='text-6xl text-skye-white'>
                    Skye <br /> Interactive
                </h2>
            </div>

            <div className='social-links-container flex flex-row justify-between container mx-auto px-4 py-8'>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <p className='text-skye-white'>
                            <Link href='https://www.instagram.com/skyeinteractive/'>Instagram</Link>
                        </p>
                        <p className='text-skye-white'>
                            <Link href='https://www.linkedin.com/company/skyeinteractive/'>LinkedIn</Link>
                        </p>
                        <p>
                            <a href='mailto:info@skyeinteractive.com'>info@skyeinteractive.com</a>
                        </p>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-8'>
                <p className='text-center text-sm'>
                    &copy; {new Date().getFullYear()} Skye Interactive.
                </p>
            </div>
        </footer>
    )
}

export default Footer;
