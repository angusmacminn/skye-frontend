'use client'

import { gql, useQuery } from '@apollo/client'
import { useState } from 'react';


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

                statsHeading
                    statisticCard {
                        statCategory
                        statNumber
                    }

                processHeading
                processSteps {
                    processNumber
                    stepHeading
                    stepDescription
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

interface StatisticCardData {
    statCategory?: string;
    statNumber?: string;
}

interface ProcessStepData {
    processNumber?: string;
    stepHeading?: string;
    stepDescription?: string;
}

interface HomePageAcfData {
    servicesHeading?: string;
    serviceCard?: ServiceCardData[];
    processHeading?: string;
    processSteps?: ProcessStepData[];
    statsHeading?: string;
    statisticCard?: StatisticCardData[];

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
    
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    const cardGradientsMobile = [
        'bg-gradient-to-b from-[#FCA5A5] to-red-400', // Card 1
        'bg-gradient-to-b from-red-400 to-red-600', // Card 2  
        'bg-gradient-to-b from-red-600 to-red-400' // Card 3
    ]

    const cardGradients = [
        'bg-gradient-to-r from-[#FCA5A5] to-red-400', // Card 1
        'bg-gradient-to-r from-red-400 to-red-600', // Card 2  
        'bg-gradient-to-r from-red-600 to-red-400' // Card 3
    ]

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

    const statsHeading = acfData?.statsHeading
    const statisticCard = acfData?.statisticCard    

    const processHeading = acfData?.processHeading
    const processSteps = acfData?.processSteps
    

    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Services content not found. Check ACF and query.</p>;
    } 


    return (
        <>
            <section id='services-section'
                     className='bg-black py-16'>
                <div id='services-container'
                className='flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4'>
                    <h2 className='text-center text-4xl text-white'>{servicesHeading}</h2>
                    {serviceCard?.map((card, index) => (
                        <div key={index}
                             id='service-card'
                             className={`flex flex-col items-center w-full gap-4 border-red-400 border-r-2 p-4 min-h-[300px] transition-all duration-300 ease-in-out cursor-pointer ${
                                hoveredCard === index ? 'bg-red-400 rounded-br-[40px]' : 'bg-black'
                             }`}
                             onMouseEnter={() => setHoveredCard(index)}
                             onMouseLeave={() => setHoveredCard(null)}>
                            <div className='flex flex-col items-start w-full gap-2'>
                            <h3 className='text-left text-2xl text-white'>{card.serviceTitle}</h3>
                            <ul className={`flex flex-col items-start w-full gap-2 transition-all duration-300 ${
                                hoveredCard === index ? 'opacity-100' : 'opacity-0 max-h-0 overflow-hidden'
                            }`}>
                                {card.serviceList?.map((item, index) => (
                                    <li key={index} className='text-left text-white'>{item.serviceItem}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <section id='statistics-section'
                     className='bg-black py-16'>
                <div id='statistics-container'
                className='flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4'>
                    <h2 className='text-center text-4xl text-white mb-8'>{statsHeading}</h2>
                    {statisticCard?.map((card, index) => (
                        <div key={index}
                             id='statistic-card'
                             className={`flex flex-col items-left justify-center w-full gap-4 p-8 min-h-[200px] rounded-lg ${cardGradientsMobile[index] || 'bg-gray-500'}`}>
                            <h3 className='text-left text-2xl text-white'>{card.statCategory}</h3>
                            <p className='text-left text-4xl font-bold text-white drop-shadow-md'>{card.statNumber}</p>
                        </div>
                    ))}
                </div>
            </section>
    
            <section id='process-section'>
                <div id='process-container'
                className='flex flex-col items-center gap-16 mt-10 w-full max-w-lg mx-auto px-4'>
                    <h2 className='text-center text-4xl font-bold'>{processHeading}</h2>
                    {processSteps?.map((step, index) => (
                        <div key={index}
                             id='process-step'
                             className='flex flex-col items-center h-screen gap-4'>
                            <h3 className='text-center text-2xl font-bold'>{step.stepHeading}</h3>
                            <p className='text-center text-lg'>{step.stepDescription}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}   

export default Services;

