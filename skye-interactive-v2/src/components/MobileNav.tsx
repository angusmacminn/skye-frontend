'use client'    

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
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

    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
    const expandingBgRef = useRef<HTMLDivElement>(null);   // Ref for the element that will expand
    const menuPanelRef = useRef<HTMLDivElement>(null);     // Ref for the menu content panel
    const navLinksRef = useRef<HTMLDivElement>(null);      // Ref for the container of nav links (for staggered animation)

    const tl = useRef<gsap.core.Timeline | null>(null); // GSAP Timeline

    useEffect(() => {
        // Initialize the timeline
        // We create it here so it persists across re-renders
        if (!tl.current) {
            tl.current = gsap.timeline({ paused: true });

            // Define the animation - initially hidden and matching the button
            if (mobileMenuButtonRef.current && expandingBgRef.current && menuPanelRef.current && navLinksRef.current) {
                const buttonRect = mobileMenuButtonRef.current.getBoundingClientRect();
                
                // Initial state of the expanding background (matching the button)
                gsap.set(expandingBgRef.current, {
                    width: buttonRect.width,
                    height: buttonRect.height,
                    top: buttonRect.top,
                    left: buttonRect.left,
                    borderRadius: window.getComputedStyle(mobileMenuButtonRef.current).borderRadius, // Get button's current border radius
                    backgroundColor: window.getComputedStyle(mobileMenuButtonRef.current).backgroundColor, // Get button's current bg color
                    display: 'block', // Make it visible for animation
                    opacity: 0,
                });
                
                // Initial state of menu panel (for fade-in)
                gsap.set(menuPanelRef.current, { display: 'none', opacity: 0 });
                gsap.set(navLinksRef.current.children, { opacity: 0, y: 20 });


                tl.current
                    .to(expandingBgRef.current, {
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        borderRadius: '0px', // Expand to be rectangular
                        duration: 0.5,
                        ease: 'power3.inOut',
                    })
                    .to(mobileMenuButtonRef.current, { // Hide original button quickly
                        opacity: 0,
                        duration: 0.1,
                    }, "<0.1") // Start slightly after bg expansion starts
                    .set(menuPanelRef.current, { display: 'flex' }) // Show panel before link animation
                    .to(menuPanelRef.current, {
                        opacity: 1,
                        duration: 0.3,
                    }, "-=0.2") // Overlap with end of bg expansion
                    .to(navLinksRef.current.children, { // Stagger links
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        stagger: 0.05,
                        ease: 'power2.out',
                    }, "-=0.1"); // Start animation of links
            }
        }
    }, []); // Empty dependency array: setup GSAP timeline once on mount

    useEffect(() => {
        // Play or reverse the timeline based on isMobileMenuOpen state
        if (tl.current) {
            if (isMobileMenuOpen) {
                // Before playing, ensure the expandingBg has the button's current properties
                if (mobileMenuButtonRef.current && expandingBgRef.current) {
                    const buttonRect = mobileMenuButtonRef.current.getBoundingClientRect();
                    gsap.set(expandingBgRef.current, {
                        width: buttonRect.width,
                        height: buttonRect.height,
                        top: buttonRect.top,
                        left: buttonRect.left,
                        borderRadius: window.getComputedStyle(mobileMenuButtonRef.current).borderRadius,
                        backgroundColor: window.getComputedStyle(mobileMenuButtonRef.current).backgroundColor,
                        opacity: 1, // Make sure it's visible before animation
                        display: 'block',
                    });
                    gsap.set(mobileMenuButtonRef.current, { opacity: 1 }); // Ensure original button is visible
                }
                tl.current.play();
            } else {
                // Before reversing, ensure the original button is ready to reappear
                gsap.set(mobileMenuButtonRef.current, { opacity: 1 });
                tl.current.reverse();
            }
        }
    }, [isMobileMenuOpen]);

    
    return (
        <div className="md:hidden"> {/* This div is for md:hidden logic */}
            {/* Actual Menu Button */}
                <div className="m-5 flex justify-end"> {/* Wrapper for button positioning */}
                    <button
                        ref={mobileMenuButtonRef}
                        id="mobile-menu-button"
                        onClick={toggleMobileMenu}
                        className="bg-red-400 text-white p-2 rounded-tl-[20px] relative z-[60]" // Ensure button is initially on top
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu-panel" // This should point to the ID of the panel holding the links
                        aria-label="Open main menu"
                    >
                        <span className="sr-only">Open main menu</span>
                        <div className="space-y-1.5 p-1"> {/* Hamburger icon lines */}
                            <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-5 h-0.5 bg-current transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </div>
                    </button>
                </div>
    
                {/* Expanding Background Element - Positioned fixed to cover screen */}
                <div
                    ref={expandingBgRef}
                    className="fixed top-0 left-0 z-[50] hidden" // Initially hidden, GSAP will show it. High z-index but below menu content.
                    // Initial style will be set by GSAP to match the button
                ></div>
                
                {/* Menu Panel - This will contain the links and appear ON TOP of the expanding background */}
                {/* We use GSAP to control its display and opacity instead of isMobileMenuOpen directly for smoother transitions */}
                <div
                    ref={menuPanelRef}
                    id="mobile-menu-panel" // For aria-controls
                    className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none" // Higher z-index, initially hidden by GSAP
                >
                    <div 
                        // This inner div is for styling the actual content area if needed,
                        // or the links can be direct children of menuPanelRef.
                        // For simplicity, let's put nav links directly in navLinksRef.
                        className="relative flex flex-col w-auto max-w-xs p-4 pointer-events-auto" // Make content area interactive
                    >
                        {/* Close button inside the menu (optional, if you want one here) */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={toggleMobileMenu}
                                className={`p-2 rounded-md text-gray-700 hover:text-skye-primary-blue ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} // Example for a close button within the panel
                                aria-label="Close menu"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav ref={navLinksRef}> {/* Ref for staggering link animations */}
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
                        </nav>
                    </div>
                </div>
            </div>
        );
}

export default MobileNav;   