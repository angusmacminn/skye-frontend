'use client'

import { useEffect, useState } from "react";
import MobileNav2 from "./MobileNav2";
import DesktopNav from "./DesktopNav";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header 
            className={`
                fixed top-0 left-0 right-0 z-50 
                transition-all duration-300 ease-in-out
                ${isScrolled ? 'bg-skye-gray/95 backdrop-blur-sm' : 'bg-transparent'}
                max-w-screen-2xl mx-auto
            `}
        >
            {/* Always render both, let CSS handle visibility */}
            <div className="md:hidden">
                <MobileNav2 />
            </div>
            <div className="hidden md:block">
                <DesktopNav />
            </div>
        </header>
    )
}

export default Header;