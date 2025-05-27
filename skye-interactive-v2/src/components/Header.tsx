import Link from "next/link";
import MobileNav from "./MobileNav";



function Header() {
    return (
        <div 
            className="z-50 bg-transparent"
            style={{ position: 'sticky', top: '1.25rem '}}
        >
            <MobileNav />
        </div>
    )
}

export default Header;