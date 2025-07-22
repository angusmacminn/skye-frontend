'use client'

import {gql, useQuery} from '@apollo/client'
import { useEffect, useState } from 'react'

const GET_STUDIO_APPROACH_DATA = gql`
    query getStudioApproachData($id:ID!, $idType: PageIdType!){
        page(id: $id, idType: $idType) {
            id #ID of the page
            title #Title of the page

            studioPage {
                approachHeading
                approachItems {
                    approachItemHeader
                    approachBody
                }
            }
        }
    }
`

interface approachCardData {
    approachItemHeader?: string
    approachBody?: string
}

interface studioPageAcfData {
    approachItems?: approachCardData[]
    approachHeading?: string
}

interface PageData {
    id?: string
    title?: string
    studioPage?: studioPageAcfData
}

interface QueryData {
    page?: PageData
}



export default function StudioApproach(){
    const [isVisible, setIsVisible] = useState(false)

    const pageId = '8'
    const pageIdType = 'DATABASE_ID'

    const { data } = useQuery<QueryData>(GET_STUDIO_APPROACH_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })

    const acfData = data?.page?.studioPage
    const approachHeading = acfData?.approachHeading
    const approachCardItems = acfData?.approachItems

    useEffect(() => {
        if (approachCardItems && approachCardItems.length > 0) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 300)
            
            return () => clearTimeout(timer)
        }
    }, [approachCardItems])

    return(
        <section className='approach-section mt-24 py-[10px] md:max-w-screen-2xl md:mx-auto md:py-24'>
            <div className={`approach-content mx-[10px] flex flex-col items-center justify-center gap-8 py-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <h2 className='text-submobile text-skye-primary-red text-center md:text-subdesktop'> We Bring</h2>
                    <h2 className='text-h2-mobile text-white text-center md:text-h2-desktop'>
                        {approachHeading}
                    </h2>
                </div>

                <div className='approach-cards flex flex-col gap-4 lg:flex-row'>
                    {approachCardItems?.map((card, index) => (
                        <div key={index} className='approach-card bg-gradient-service-card rounded-[5px] flex flex-col gap-2 p-4 max-w-[500px] md:max-w-[700px] md:gap-8 md:pb-8'>
                            <h3 className='text-white text-submobile md:text-subdesktop'>{card.approachItemHeader}</h3>
                            <p className='text-white text-p-mobile md:text-p-desktop'>{card.approachBody}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}