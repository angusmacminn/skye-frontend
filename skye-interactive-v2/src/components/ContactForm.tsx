'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  timeline: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission - replace with your actual form handling
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="contact-form-success text-center py-16">
        <h3 className="text-h3-mobile md:text-h3-desktop text-skye-primary-red mb-4">
          Thank you for reaching out!
        </h3>
        <p className="text-p-mobile md:text-p-desktop text-skye-gray">
          We'll get back to you within 24 hours to discuss your project.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form space-y-6">
      <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="name" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
            Full Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
            Email Address*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="company" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
            Company/Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop"
            placeholder="Your company name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="projectType" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
            Project Type*
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop bg-white"
          >
            <option value="">Select project type</option>
            <option value="website">Website Design & Development</option>
            <option value="webapp">Web Application</option>
            <option value="branding">Branding & Identity</option>
            <option value="ecommerce">E-commerce</option>
            <option value="mobile">Mobile App</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="budget" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
            Project Budget
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop bg-white"
          >
            <option value="">Select budget range</option>
            <option value="under-10k">Under $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="over-100k">Over $100,000</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="timeline" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop bg-white"
          >
            <option value="">Select timeline</option>
            <option value="asap">ASAP</option>
            <option value="1-2months">1-2 months</option>
            <option value="3-6months">3-6 months</option>
            <option value="6months+">6+ months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message" className="block text-submobile md:text-subdesktop text-skye-gray mb-2">
          Project Details*
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border-2 border-skye-gray-light rounded-bl-[20px] focus:border-skye-primary-red focus:outline-none transition-colors text-p-mobile md:text-p-desktop resize-vertical"
          placeholder="Tell us about your project, goals, and any specific requirements..."
        />
      </div>

      <div className="form-submit pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-skye-primary-red text-white px-8 py-4 rounded-bl-[20px] text-submobile md:text-subdesktop font-medium hover:bg-skye-primary-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
} 