'use client'    

import { useState } from "react";
import Link from "next/link";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
    { label: "Works", href: "/works" },
]

function MobileNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMobileMenu}
                className="bg-red-500 text-white p-10 m-5 border-4 border-blue-500"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu-panel"
                aria-label="Open main menu"
            >
                <span className="sr-only">Open main menu</span>
                <div className="space-y-1.5">
                    <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </button>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 flex">
                    <div className="fixed inset-0 bg-black opacity-25" onClick={toggleMobileMenu}></div>

                    <div className="relative flex flex-col w-3/4 max-w-xs h-full bg-white z-50 shadow-xl p-4 transform transition-transform ease-in-out duration-300"
                         style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }}
                    >
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-md text-gray-600 hover:text-skye-primary-blue"
                                aria-label="Close menu"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-skye-primary-blue hover:bg-gray-50"
                                    onClick={toggleMobileMenu}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MobileNav;   