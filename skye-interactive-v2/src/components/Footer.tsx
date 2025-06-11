import Link from "next/link";



function Footer() {
    return (
        <footer className='bg-skye-gray text-skye-white'>

            <div className='container mx-auto px-4 py-8'>
                <h2 className='text-6xl text-skye-white'>
                    Skye <br /> Interactive
                </h2>
            </div>

            <div className='social-links-container flex flex-row justify-between container mx-auto px-4 py-8'>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col'>
                        <p className='text-skye-white'>
                            <Link href='https://www.instagram.com/skyeinteractive/'>Instagram</Link>
                        </p>
                        <p className='text-skye-white'>
                            <Link href='https://www.linkedin.com/company/skyeinteractive/'>LinkedIn</Link>
                        </p>
                        <p>
                            <a href='mailto:info@skyeinteractive.com'>info@skyeinteractive.com</a>
                        </p>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-8'>
                <p className='text-center text-sm'>
                    &copy; {new Date().getFullYear()} Skye Interactive.
                </p>
            </div>
        </footer>
    )
}

export default Footer;
