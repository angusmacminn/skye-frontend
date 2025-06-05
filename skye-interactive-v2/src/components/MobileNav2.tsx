'use client'    

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

// Extract the SVG into a component
function LogoIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <svg width="40" height="40" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect className="logo-rect" x="39.0411" y="0.96582" width="10.9589" height="10.9589" fill="#ffffff"/>
            <rect className="logo-rect" x="11.387" y="8.92798" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="36.387" y="33.8424" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="28.0822" y="11.9246" width="10.9589" height="10.9589" fill="#ffffff"/>
            <rect className="logo-rect" x="5.65076" y="14.5787" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="30.7362" y="39.493" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="17.0377" y="0.96582" width="10.9589" height="10.9589" fill="#ffffff"/>
            <rect className="logo-rect" y="8.92798" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="25.0856" y="33.8424" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="17.0377" y="22.8835" width="10.9589" height="10.9589" fill="#ffffff"/>
            <rect className="logo-rect" y="20.3151" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="25.0856" y="45.2294" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="39.0411" y="22.8835" width="10.9589" height="10.9589" fill="#ffffff"/>
            <rect className="logo-rect" x="11.387" y="20.3151" width="5.65068" height="5.65068" fill="#ffffff"/>
            <rect className="logo-rect" x="36.387" y="45.2294" width="5.65068" height="5.65068" fill="#ffffff"/>
        </svg>
    )
}

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
    { label: "Works", href: "/works" },
]

function MobileNav2() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Refs for GSAP animations
    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
    const expandingBgRef = useRef<HTMLDivElement>(null);
    const menuPanelRef = useRef<HTMLDivElement>(null);
    const navLinksRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mobileMenuButtonRef.current && expandingBgRef.current && menuPanelRef.current && navLinksRef.current) {
            // Set initial states
            gsap.set(expandingBgRef.current, { display: 'none' });
            gsap.set(menuPanelRef.current, { display: 'none', opacity: 0 });
            gsap.set(navLinksRef.current.children, { opacity: 0, y: 20 });
        }
    }, []);

    useEffect(() => {
        if (mobileMenuButtonRef.current && expandingBgRef.current && menuPanelRef.current && navLinksRef.current) {
            if (isMobileMenuOpen) {
                // Get the button's current position and size
                const buttonRect = mobileMenuButtonRef.current.getBoundingClientRect();
                
                // Get the computed styles from the actual button
                const buttonStyles = window.getComputedStyle(mobileMenuButtonRef.current);
                
                console.log('Button rect:', buttonRect); // Debug
                console.log('Button bg color:', buttonStyles.backgroundColor); // Debug

                // Set up the expanding background to exactly match the button
                gsap.set(expandingBgRef.current, {
                    display: 'block',
                    position: 'fixed',
                    width: buttonRect.width + 'px',
                    height: buttonRect.height + 'px',
                    backgroundColor: buttonStyles.backgroundColor, // Get the actual button's background color
                    borderRadius: buttonStyles.borderTopLeftRadius, // Match the button's border radius
                    left: buttonRect.left + 'px',
                    top: buttonRect.top + 'px',
                    transformOrigin: 'center center',
                    scale: 1,
                    opacity: 1,
                    zIndex: 55,
                });

                // Calculate scale needed to cover screen
                const scaleX = window.innerWidth / buttonRect.width;
                const scaleY = window.innerHeight / buttonRect.height;
                const finalScale = Math.max(scaleX, scaleY) * 1.5; // Add extra to ensure full coverage

                console.log('Final scale:', finalScale); // Debug
                
                // Create animation timeline
                const openTl = gsap.timeline();
                
                openTl
                    // Expand the background
                    .to(expandingBgRef.current, {
                        scale: finalScale,
                        borderRadius: 0, // Remove border radius as it expands
                        duration: 0.8,
                        ease: 'power3.inOut',
                    })
                    // Hide the original button
                    .to(mobileMenuButtonRef.current, { 
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                    }, "<0.2") 
                    // Show menu panel
                    .set(menuPanelRef.current, { display: 'flex' }, "-=0.3")
                    .to(menuPanelRef.current, {
                        opacity: 1,
                        duration: 0.4,
                    }, "-=0.3") 
                    // Animate in navigation links
                    .to(navLinksRef.current.children, { 
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out',
                    }, "-=0.2");
                
            } else {
                // Close animation
                const closeTl = gsap.timeline();
                
                closeTl
                    .to(navLinksRef.current.children, { 
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        stagger: 0.05,
                    })
                    .to(menuPanelRef.current, {
                        opacity: 0,
                        duration: 0.3,
                    }, "<0.1")
                    .set(menuPanelRef.current, { display: 'none' })
                    .to(mobileMenuButtonRef.current, { 
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                    }, "<")
                    .to(expandingBgRef.current, {
                        scale: 1,
                        duration: 0.6,
                        borderRadius: '20px 0 0 0',
                        ease: 'power3.inOut',
                    }, "<")
                    .set(expandingBgRef.current, { display: 'none' });
            }
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.to('.logo-rect', {
                scale: 0.8,
                rotation: 180,
                opacity: 0.6,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out',
            })
        } else {
            gsap.to('.logo-rect', {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            })
        }
    }, [isMobileMenuOpen])

    return (
        <div className="md:hidden">
            {/* Sticky button with SVG logo */}
            <div className="m-[10px] flex justify-end">
                <button
                    ref={mobileMenuButtonRef}
                    onClick={toggleMobileMenu}
                    className="bg-red-400 text-white p-3 rounded-tl-[20px] relative z-[60] hover:bg-red-500 transition-colors"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu-panel" 
                    aria-label="Open main menu"
                >
                    <span className="sr-only">Open main menu</span>
                    <LogoIcon isOpen={isMobileMenuOpen} />
                </button>
            </div>
    
            {/* Expanding Background */}
            <div id="nav-menu-bg"
                ref={expandingBgRef}
                className="fixed rounded-tl-[20px] "
                style={{ 
                    pointerEvents: 'none',
                    backgroundColor: '#f87171', // Fallback color
                }}
            ></div>
            
            {/* Menu Panel */}
            <div
                ref={menuPanelRef}
                id="mobile-menu-panel"
                className="fixed rounded-tl-[20px] inset-0 z-[70] flex items-center justify-center pointer-events-none"
            >
                <div className="relative flex flex-col w-auto max-w-xs p-6 pointer-events-auto">
                    {/* Close button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-white hover:text-gray-200 transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Navigation links */}
                    <nav ref={navLinksRef} className="space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 rounded-md text-lg font-medium text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                                onClick={toggleMobileMenu}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default MobileNav2;