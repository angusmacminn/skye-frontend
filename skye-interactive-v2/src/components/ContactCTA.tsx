'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// components/ContactCTA.tsx
export default function ContactCTA() {
  const [isVisible, setIsVisible] = useState(false)
    
  useEffect(() => {
      // Add a small delay to match your GraphQL components
      const timer = setTimeout(() => {
          setIsVisible(true)
      }, 800) // Adjust this timing to match your Hero component loading
      
      return () => clearTimeout(timer)
  }, [])
  
  return (
    <section className={`bg-skye-primary-red text-white py-16 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-screen-2xl mx-auto text-center flex flex-col items-center justify-center gap-8">
        <h2 className='text-h3-mobile text-white md:text-h3-desktop'>Ready to build something together?</h2>
        <p className='text-p-mobile text-white md:text-p-desktop'>We’re always open to working with thoughtful people on meaningful digital projects. Let’s start a conversation.</p>
        <Link href="/contact" className="btn-primary bg-skye-white text-skye-primary-red mt-8 border-2 border-white rounded-bl-[20px] px-8 py-4">
          Contact Us
        </Link>
      </div>
    </section>
  )
}
