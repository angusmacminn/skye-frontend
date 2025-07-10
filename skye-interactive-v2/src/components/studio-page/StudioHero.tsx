'use client'

import { gql, useQuery } from '@apollo/client'


const GET_STUDIO_HERO_DATA = gql`
    query getStudioHeroData ($id: ID!, $idType: PageIdType!) {
        page(id: $id, idType: $idType) {
            id # ID of the page
            title # Title of the page

            studioPage {
                heroH1
                heroIntroParagraph
                heroImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
            }
        
        }
    }
`

interface HeroImageNode {
    sourceUrl?: string
    altText?: string
}

interface HeroImage {
    node: HeroImageNode
}

interface studioPageAcfData {
    heroH1?: string
    heroIntroParagraph?: string
    heroImage?: HeroImage
}

interface PageData {
    id?: string
    title?: string
    studioPage?: studioPageAcfData
}

interface QueryData {
    page?: PageData
}


export default function StudioHero() {
    const pageId = '8'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_STUDIO_HERO_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })

    // define variavbles for data
    const acfData = data?.page?.studioPage
    const heroH1 = acfData?.heroH1
    const heroH2 = acfData?.heroIntroParagraph
    // const heroImage = acfData?.heroImage
    // const heroImageUrl = heroImage?.node?.sourceUrl
    // const heroImageAlt = heroImage?.node?.altText


    return (
        <section className='py-[10px] md:max-w-screen-2xl md:mx-auto'>
            <div className='flex flex-col items-center justify-center gap-4 px-8 py-4 bg-red-400 rounded-br-[40px] rounded-tl-[40px] mx-[10px]'>
                <h1 className='text-left text-h1-mobile text-skye-gray md:text-[6rem]'>
                    {heroH1}
                </h1>
                <h2 className='text-h2-mobile text-skye-gray'>
                    {heroH2}
                </h2>
            </div>
        </section>
    )
}