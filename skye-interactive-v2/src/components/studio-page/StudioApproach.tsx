'use client'

import {gql, useQuery} from '@apollo/client'

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

    const pageId = '8'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_STUDIO_APPROACH_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })

    const acfData = data?.page?.studioPage
    const approachHeading = acfData?.approachHeading
    const approachCardItems = acfData?.approachItems

    return(
        <section>
            <div className='approach-content flex flex-col items-center justify-center py-8'>
                <h2 className='text-h2-mobile text-white'>
                    {approachHeading}
                </h2>

                <div className='approach-cards flex flex-col gap-4 '>
                    {approachCardItems?.map((card, index) => (
                        <div key={index} className='flex flex-col gap-2'>
                            <h3 className='text-white'>{card.approachItemHeader}</h3>
                            <p className=''>{card.approachBody}</p>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}