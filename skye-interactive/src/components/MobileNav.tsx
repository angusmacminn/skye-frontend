import { useState } from "react";

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

function MobileNav() {
    return (
        <nav className="mobile-nav">
            <div
            id="mobile-menu" // For aria-controls
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            >
     <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
       {/* Your navigation links go here */}
       <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</a>
       <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Team</a>
       <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Projects</a>
     </div>
   </div>
        </nav>
    )
}

export default MobileNav;   