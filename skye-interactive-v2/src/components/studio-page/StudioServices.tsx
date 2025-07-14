'use client'

import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

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
    const pageId = '8'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_STUDIO_SERVICES_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })
    
    // Add these error handling checks BEFORE trying to access data
    if (loading) return <div className="p-8 text-center">Loading services...</div>
    if (error) {
        console.error("GraphQL Error:", error);
        return <p className="p-8 text-center text-red-500">Error loading services data. Check console.</p>;
    }

    // defensive checks
    if (!data?.page?.studioPage && !loading) {
        return <p className="p-8 text-center">Services content not found. Check ACF and query.</p>;
    }

    const acfData = data?.page?.studioPage
    const serviceHeader = acfData?.serviceHeader
    const fullServiceItem = acfData?.fullServiceItem

    console.log('Full service items array:', fullServiceItem)

    return (
        <section className='services-section'>
            <div className='services-container'>
                <h2 className='services-header'>{serviceHeader}</h2>
                <div className='services-item'>
                    {fullServiceItem && fullServiceItem.map((item, index) => (
                        <div key={index} className='service-item-wrapper'>
                            <h3 className='services-item-header'>{item.serviceItemHeader}</h3>
                            <p className='services-item-description'>{item.serviceDescription}</p>
                            <p className='services-item-include'>{item.servicesInclude}</p>
                            
                            {/* Handle the nested specificService array */}
                            {item.specificService && item.specificService.length > 0 && (
                                <ul className='specific-services'>
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
        </section>
    )
}




