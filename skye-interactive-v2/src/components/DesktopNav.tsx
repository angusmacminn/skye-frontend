import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";

function LogoIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-skye-primary-red">
            <rect className="logo-rect" x="39.0411" y="0.96582" width="10.9589" height="10.9589" fill="currentColor"/>
            <rect className="logo-rect" x="11.387" y="8.92798" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="36.387" y="33.8424" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="28.0822" y="11.9246" width="10.9589" height="10.9589" fill="currentColor"/>
            <rect className="logo-rect" x="5.65076" y="14.5787" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="30.7362" y="39.493" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="17.0377" y="0.96582" width="10.9589" height="10.9589" fill="currentColor"/>
            <rect className="logo-rect" y="8.92798" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="25.0856" y="33.8424" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="17.0377" y="22.8835" width="10.9589" height="10.9589" fill="currentColor"/>
            <rect className="logo-rect" y="20.3151" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="25.0856" y="45.2294" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="39.0411" y="22.8835" width="10.9589" height="10.9589" fill="currentColor"/>
            <rect className="logo-rect" x="11.387" y="20.3151" width="5.65068" height="5.65068" fill="currentColor"/>
            <rect className="logo-rect" x="36.387" y="45.2294" width="5.65068" height="5.65068" fill="currentColor"/>
        </svg>
    )
}

function DesktopNav() {
    const logoRef = useRef<HTMLDivElement>(null);
    const cursorFollowerRef = useRef<HTMLDivElement | null>(null);
    const navLinksRef = useRef<HTMLDivElement | null>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    // Logo hover effect
    useEffect(() => {
        const logoElement = logoRef.current;
        if (!logoElement) return;

        const handleMouseEnter = () => {
            const rects = logoElement.querySelectorAll('.logo-rect');
            
            gsap.to(rects, {
                x: () => gsap.utils.random(-10, 10),
                y: () => gsap.utils.random(-10, 10),
                rotation: () => gsap.utils.random(-30, 30),
                duration: 0.2,
                stagger: 0.03,
            });
        };
    
        const handleMouseLeave = () => {
            gsap.to(logoElement.querySelectorAll('.logo-rect'), {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.2,
                stagger: 0.05,
            });
        };

        logoElement.addEventListener("mouseenter", handleMouseEnter);
        logoElement.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            logoElement.removeEventListener("mouseenter", handleMouseEnter);
            logoElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // Cursor follow effect for nav links
    useEffect(() => {
        const isMobile = () => {
            return window.innerWidth <= 768 || 'ontouchstart' in window;
        };

        if (!isMobile()) {
            // call the references 
            const navLinksContainer = navLinksRef.current;
            const follower = cursorFollowerRef.current;
            const links = linkRefs.current.filter(Boolean);

            if (navLinksContainer && follower && links.length > 0) {
                // Initially hide the follower
                gsap.set(follower, {
                    opacity: 0,
                    scale: 0.8
                });

                links.forEach((link) => {
                    if (!link) return;

                    link.addEventListener('mouseenter', () => {
                        const linkRect = link.getBoundingClientRect();
                        const containerRect = navLinksContainer.getBoundingClientRect();
                        
                        // Calculate position relative to container
                        const left = linkRect.left - containerRect.left;
                        const top = linkRect.top - containerRect.top;
                        
                        gsap.to(follower, {
                            left: left,
                            top: top,
                            width: linkRect.width,
                            height: linkRect.height,
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    });
                });

                // Hide follower when leaving the nav container
                navLinksContainer.addEventListener('mouseleave', () => {
                    gsap.to(follower, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                });
            }
        }
    }, []);

    return (
        <div className='desktop-nav'>
            <div className='desktop-nav-container px-4 py-8 flex flex-row justify-between items-center text-skye-gray-light w-full'>
                <div className='desktop-nav-logo' ref={logoRef} style={{ cursor: 'pointer' }}>
                    <Link href='/'>
                        <LogoIcon />
                    </Link>
                </div>
                <nav 
                    ref={navLinksRef}
                    className='desktop-nav-links flex flex-row gap-6 relative'
                >
                    {/* Cursor follower element */}
                    <div 
                        ref={cursorFollowerRef}
                        className='cursor-follower absolute pointer-events-none z-10 rounded-bl-[20px] border border-red-400 bg-red-400/10 backdrop-blur-sm'
                    />
                    
                    <Link 
                        ref={(el) => { linkRefs.current[0] = el; }}
                        className='desktop-nav-link filter-invert transition-all duration-300 hover:text-skye-white px-3 py-2 relative z-20' 
                        href='/'
                    >
                        Home
                    </Link>
                    <Link 
                        ref={(el) => { linkRefs.current[1] = el; }}
                        className='desktop-nav-link filter-invert transition-all duration-300 hover:text-skye-white px-3 py-2 relative z-20' 
                        href='/studio'
                    >
                        Studio
                    </Link>
                    <Link 
                        ref={(el) => { linkRefs.current[2] = el; }}
                        className='desktop-nav-link filter-invert transition-all duration-300 hover:text-skye-white px-3 py-2 relative z-20' 
                        href='/contact'
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default DesktopNav;