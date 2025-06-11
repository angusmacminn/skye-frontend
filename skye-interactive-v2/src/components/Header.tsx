'use client'

import MobileNav2 from "./MobileNav2";
import DesktopNav from "./DesktopNav";

function Header() {
    return (
        <div 
            className="z-50 bg-transparent"
            style={{ position: 'sticky', top: '1.25rem '}}
        >
            {/* Always render both, let CSS handle visibility */}
            <div className="md:hidden">
                <MobileNav2 />
            </div>
            <div className="hidden md:block">
                <DesktopNav />
            </div>
        </div>
    )
}

export default Header;