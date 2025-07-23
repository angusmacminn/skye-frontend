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
        <footer className={`bg-skye-gray text-skye-white transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} mt-24 relative`}>
            {/* Main Footer Content */}
            <div className='container mx-auto px-4 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                    
                    {/* Company Info */}
                    <div className='lg:col-span-2'>
                        <h2 className='text-h2-desktop text-skye-white mb-6'>
                            Skye  
                            <span className='text-skye-primary-red'> Interactive</span>
                        </h2>
                        <p className='text-lg text-gray-300 mb-6 max-w-md'>
                            Ideas that perform. Designs that speak. We create digital experiences that drive results and tell your story.
                        </p>
                        <Link 
                            href="/contact" 
                            className="inline-block bg-skye-primary-red text-white px-8 py-3 rounded-bl-[20px] hover:bg-white hover:text-skye-primary-red transition-all duration-300 font-medium"
                        >
                            Let&apos;s work together
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className='flex flex-col'>
                        <h3 className='text-xl text-skye-white mb-6 border-b border-skye-primary-red pb-2'>
                            Navigation
                        </h3>
                        <div className='space-y-3'>
                            <Link href='/' className='block text-gray-300 hover:text-skye-primary-red transition-colors duration-200'>
                                Home
                            </Link>
                            <Link href='/studio' className='block text-gray-300 hover:text-skye-primary-red transition-colors duration-200'>
                                Studio
                            </Link>
                            <Link href='/contact' className='block text-gray-300 hover:text-skye-primary-red transition-colors duration-200'>
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Contact & Social */}
                    <div className='flex flex-col'>
                        <h3 className='text-xl text-skye-white mb-6 border-b border-skye-primary-red pb-2'>
                            Connect
                        </h3>
                        <div className='space-y-3'>
                            <a 
                                href='mailto:info@skyeinteractive.com' 
                                className='block text-gray-300 hover:text-skye-primary-red transition-colors duration-200'
                            >
                                info@skyeinteractive.com
                            </a>
                            <a 
                                href='https://www.instagram.com/skyeinteractive/' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='block text-gray-300 hover:text-skye-primary-red transition-colors duration-200'
                            >
                                Instagram
                            </a>
                            <a 
                                href='https://www.linkedin.com/company/skyeinteractive/' 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='block text-gray-300 hover:text-skye-primary-red transition-colors duration-200'
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Divider */}
            <div className='container mx-auto px-4'>
                <div className='h-px bg-gradient-to-r from-transparent via-skye-primary-red to-transparent'></div>
            </div>

            {/* Bottom Bar */}
            <div className='container mx-auto px-4 py-6'>
                <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                    <p className='text-sm text-gray-400'>
                        &copy; {new Date().getFullYear()} Skye Interactive. All rights reserved.
                    </p>
                    <div className='flex space-x-6 text-sm'>
                        <Link href='/privacy' className='text-gray-400 hover:text-skye-primary-red transition-colors duration-200'>
                            Privacy Policy
                        </Link>
                        <Link href='/terms' className='text-gray-400 hover:text-skye-primary-red transition-colors duration-200'>
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-5 pointer-events-none'>
                <div className='h-full w-full' style={{
                    backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255, 0, 0, 0.1) 0%, transparent 50%), 
                                     radial-gradient(circle at 80% 20%, rgba(255, 0, 0, 0.1) 0%, transparent 50%)`
                }}>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
