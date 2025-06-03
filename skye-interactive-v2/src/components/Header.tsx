import Link from "next/link";
import MobileNav from "./MobileNav";
import MobileNav2 from "./MobileNav2";


function Header() {
    return (
        <div 
            className="z-50 bg-transparent"
            style={{ position: 'sticky', top: '1.25rem '}}
        >
            <MobileNav2 />
        </div>
    )
}

export default Header;