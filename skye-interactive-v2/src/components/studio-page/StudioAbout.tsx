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
        <section className='about-section py-[10px] md:max-w-screen-2xl md:mx-auto'>
            <div className='about-content mx-[10px] flex flex-col gap-8 md:flex-row'>
                <div className='about-image'>
                    <img className='max-w-[300px] mx-auto object-cover rounded-br-[40px]' src={aboutImageUrl} alt={aboutImageAlt} />
                </div>
                <div className='about-text flex flex-col gap-8'>
                    <h3 className='text-white text-h3-mobile'>
                        {acfData && aboutHeading}
                    </h3>

                    <p className='text-white text-p-mobile'>
                        {acfData && aboutParagraph}
                    </p>

                    <p className='text-white text-p-mobile'>
                        {acfData && aboutParagraph2}
                    </p>
                </div>
            </div>
        </section>
    )
}