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
    aboutImage?: aboutImage
}

interface PageData {
    id?: string
    title?: string
    studioPage?: studioAboutPageAcfData
}

interface QueryData {
    pageData: PageData
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
    const acfData = data?.pageData.studioPage
    const aboutImage = acfData?.aboutImage
    const aboutImageUrl = aboutImage?.node?.sourceUrl
    const aboutImageAlt = aboutImage?.node?.altText
    const aboutHeading = acfData?.aboutIntroHeading
    const aboutParagraph = acfData?.aboutIntroParagraph


    return(
        <section className='about-section py-[10px] md:max-w-screen-2xl md:mx-auto'>
            <div className='about-content'>
                <div className='about-image'>
                    <img src={aboutImageUrl} alt={aboutImageAlt} />
                </div>
                <div className='about-text'>
                    <h3>
                        {acfData && aboutHeading}
                    </h3>

                    <p>
                        {acfData && aboutParagraph}
                    </p>
                </div>
            </div>
        </section>
    )
}