'use client'

import {gql, useQuery} from '@apollo/client'

const GET_STUDIO_ABOUT_DATA = gql`
    query getStudioAboutData($id:ID!, $idType: PageIdType!){
        page(id: $id, idType: $idType) {
            id # ID of the page
            title # Title of the page
            
            studioPage {
                aboutImage1 {
                    node {
                        sourceUrl
                        altText
                    }
                }
                aboutIntroHeading
                aboutIntroParagraph
                aboutIntroParagraph2
            }
        }
    }
`

interface aboutImageNode {
    sourceUrl?: string
    altText?: string
}

interface aboutImage {
    node?: aboutImageNode
}

interface studioAboutPageAcfData {
    aboutIntroParagraph?: string
    aboutIntroHeading?: string
    aboutImage1?: aboutImage
    aboutIntroParagraph2?: string
}

interface PageData {
    id?: string
    title?: string
    studioPage?: studioAboutPageAcfData
}

interface QueryData {
    page?: PageData
}


export default function StudioAbout(){
    const pageId = 8
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_STUDIO_ABOUT_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })

    // define variavbles for data
    const acfData = data?.page?.studioPage
    const aboutImage = acfData?.aboutImage1
    const aboutImageUrl = aboutImage?.node?.sourceUrl
    const aboutImageAlt = aboutImage?.node?.altText
    const aboutHeading = acfData?.aboutIntroHeading
    const aboutParagraph = acfData?.aboutIntroParagraph
    const aboutParagraph2 = acfData?.aboutIntroParagraph2

    return(
        <section className='about-section py-[10px] md:max-w-screen-2xl md:mx-auto md:py-10'>
            <div className='about-content mx-[10px] flex flex-col gap-8 md:flex-row md:items-start'>
                <div className='about-image'>
                    <img className='max-w-[300px] mx-auto object-cover rounded-tl-[40px]' src={aboutImageUrl} alt={aboutImageAlt} />
                </div>
                <div className='about-text flex flex-col gap-8'>
                    <div className='flex flex-col items-center justify-center gap-2 md:items-left'>
                        <h3 className='text-submobile text-skye-primary-red text-center md:text-subdesktop md:text-left'> Our Philosophy</h3>
                        <h3 className='text-white text-center text-h3-mobile md:text-h3-desktop md:text-left'>
                            {acfData && aboutHeading}
                        </h3>
                    </div>

                    <p className='text-white text-p-mobile md:text-p-desktop'>
                        {acfData && aboutParagraph}
                    </p>

                    <p className='text-white text-p-mobile md:text-p-desktop'>
                        {acfData && aboutParagraph2}
                    </p>
                </div>
            </div>
        </section>
    )
}