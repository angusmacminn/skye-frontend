'use client'

import { gql, useQuery } from '@apollo/client'


const GET_SERVICES_DATA = gql`
    query GetServicesData ($id: ID!, $idType: PageIdType!) {
        page(id: $id, idType: $idType) {
            title
            homePage {
                servicesHeading
                serviceCard {
                    serviceTitle
                    serviceList {
                        serviceItem
                    }
                }
            }
        }
    }
`
interface ServiceCardData {
    serviceTitle?: string;
    serviceList?: {
        serviceItem?: string;
    }[];
}   

interface HomePageAcfData {
    servicesHeading?: string;
    serviceCard?: ServiceCardData[];
}

interface PageData {
    id: string;
    title?: string;
    homePage?: HomePageAcfData;
}

interface QueryData {
    page?: PageData;
}





function Services() {

    const pageId = '2'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_SERVICES_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    });

    if (loading) return <p>Loading...</p>
    if (error) {
        console.error("GraphQL Error:", error); // Log the full error for more details
        return <p className="p-8 text-center text-red-500">Error loading hero data. Check console.</p>;
    }

    const acfData = data?.page?.homePage
    const servicesHeading = acfData?.servicesHeading
    const serviceCard = acfData?.serviceCard

    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Services content not found. Check ACF and query.</p>;
    } 


    return (
        <section id='services-section'>
            <div id='services-container'
            className='flex flex-col items-center gap-4 mt-10 w-full max-w-lg mx-auto px-4'>
                <h2 className='text-center text-4xl font-bold'>{servicesHeading}</h2>
                {serviceCard?.map((card, index) => (
                    <div key={index}
                         id='service-card'
                         className='flex flex-col items-center w-full gap-4 border-2 border-gray-300 rounded-lg p-4'>
                            
                        <h3 className='text-center text-2xl font-bold'>{card.serviceTitle}</h3>
                        <ul className='flex flex-col items-start w-full gap-2'>
                            {card.serviceList?.map((item, index) => (
                                <li key={index}>{item.serviceItem}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
}   

export default Services;

