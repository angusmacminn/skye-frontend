import Link from "next/link";
import MobileNav from "./MobileNav";


function Header() {
    return (
        <header>
            <div className="header-nav-container">
                
                    <MobileNav />
                
            </div>
        </header>
    )
}

export default Header;