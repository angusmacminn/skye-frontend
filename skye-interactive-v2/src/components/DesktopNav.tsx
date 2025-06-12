import Link from "next/link";



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
    return (
        <div className='desktop-nav'>
            <div className='desktop-nav-container px-4 py-8 flex flex-row justify-between items-center text-white w-full'>
                <nav className='desktop-nav-logo'>
                    <Link href='/'>
                        <LogoIcon />
                    </Link>
                </nav>
                <div className='desktop-nav-links
                                flex flex-row gap-4'>
                    <Link className='desktop-nav-link' href='/studio'>Studio</Link>
                    <Link className='desktop-nav-link' href='/works'>Works</Link>
                    <Link className='desktop-nav-link' href='/contact'>Contact</Link>
                </div>
            </div>
        </div>
    )
}

export default DesktopNav;