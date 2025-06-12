import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";



function LogoIcon() {
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

function DesktopNav() {
    const logoRef = useRef<HTMLDivElement>(null);
    const navLinksRef = useRef(null);

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

        // event listeners
        logoElement.addEventListener("mouseenter", handleMouseEnter);
        logoElement.addEventListener("mouseleave", handleMouseLeave);

        console.log(handleMouseEnter);
        // Cleanup
        return () => {
            logoElement.removeEventListener("mouseenter", handleMouseEnter);
            logoElement.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <div className='desktop-nav'>
            <div className='desktop-nav-container px-4 py-8 flex flex-row justify-between items-center text-white w-full'>
                <div className='desktop-nav-logo' ref={logoRef} style={{ cursor: 'pointer' }}>
                    <Link href='/'>
                        <LogoIcon />
                    </Link>
                </div>
                <nav className='desktop-nav-links
                                flex flex-row gap-4'>
                    <Link className='desktop-nav-link' href='/studio'>Studio</Link>
                    <Link className='desktop-nav-link' href='/works'>Works</Link>
                    <Link className='desktop-nav-link' href='/contact'>Contact</Link>
                </nav>
            </div>
        </div>
    )
}

export default DesktopNav;