'use client'

import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { useState, useEffect } from 'react'

const GET_STUDIO_SERVICES_DATA = gql`
    query getStudioServicesData($id:ID!, $idType: PageIdType!){
        page(id: $id, idType: $idType) {
            id #ID of the page
            title #Title of the page

            studioPage {
                serviceHeader
                fullServiceItem {
                    serviceItemHeader
                    serviceDescription
                    servicesInclude
                    specificService {
                        serviceType 
                    }
                }
            }
        }
    }
`



interface specificService {
    serviceType?: string
}

interface fullServiceItem {
    serviceItemHeader?: string
    serviceDescription?: string
    servicesInclude?: string
    specificService?: specificService[] // Array of specific services
}

interface studioPageAcfData {
    serviceHeader?: string
    fullServiceItem?: fullServiceItem[] // Array of service items
}

interface PageData {
    id?: string
    title?: string
    studioPage?: studioPageAcfData
}

interface QueryData {
    page?: PageData
}

export default function StudioServices(){
    const [isVisible, setIsVisible] = useState(false)

    const pageId = '8'
    const pageIdType = 'DATABASE_ID'

    const { loading, data } = useQuery<QueryData>(GET_STUDIO_SERVICES_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })
    


    // defensive checks
    if (!data?.page?.studioPage && !loading) {
        return <p className="p-8 text-center">Services content not found. Check ACF and query.</p>;
    }

    const acfData = data?.page?.studioPage
    const serviceHeader = acfData?.serviceHeader
    const fullServiceItem = acfData?.fullServiceItem

    console.log('Full service items array:', fullServiceItem)

    useEffect(() => {
        if (fullServiceItem && fullServiceItem.length > 0) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 300)
            
            return () => clearTimeout(timer)
        }
    }, [fullServiceItem])

    return (
        <section className='services-section bg-white'>
            <div className={`py-[10px] md:max-w-screen-2xl md:mx-auto md:py-24 md:px-10 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className='services-container mx-[10px] flex flex-col gap-8 max-w-[500px] md:max-w-[800px] md:mx-auto'>
                    <h3 className='services-header text-h3-mobile text-center md:text-h3-desktop'>{serviceHeader}</h3>
                    <div className='services-item flex flex-col gap-4'>
                        {fullServiceItem && fullServiceItem.map((item, index) => (
                            <div key={index} className='service-item-wrapper flex flex-col gap-2 border-b border-gray-200 pb-4 md:gap-4'>
                                <h3 className='services-item-header text-submobile text-skye-primary-red md:text-subdesktop'>{item.serviceItemHeader}</h3>
                                <p className='services-item-description text-p-mobile md:text-p-desktop'>{item.serviceDescription}</p>
                                <p className='services-item-include text-p-mobile md:text-p-desktop'>{item.servicesInclude}</p>
                                
                                {/* Handle the nested specificService array */}
                                {item.specificService && item.specificService.length > 0 && (
                                    <ul className='specific-services pl-4 list-disc'>
                                        {item.specificService.map((service, serviceIndex) => (
                                            <li key={serviceIndex} className='services-item-type'>
                                                {service.serviceType}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}




