'use client'

import MobileNav2 from "./MobileNav2";
import DesktopNav from "./DesktopNav";

function Header() {
    return (
        <header 
            className="z-50 bg-transparent sticky top-[1.25rem] md:top-0"
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