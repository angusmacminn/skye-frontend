'use client'

import { gql, useQuery } from '@apollo/client'
import gsap from 'gsap'
import { useEffect, useRef } from 'react';

const GET_HERO_DATA = gql`
    query GetHeroData ($id: ID!, $idType: PageIdType!) {
        page(id: $id, idType: $idType) {
            id # ID of the page
            title # Title of the page
            
            homePage {
                h1TextBeforeHighLight
                h1TextHighlight
                h1TextAfterHighlight
                h1TextHighlight2
                aboutCard {
                    aboutCardHeading
                    aboutCardContent
                    aboutCardBackground {
                        node {
                            sourceUrl(size: THUMBNAIL)
                            altText
                        }
                    }
                }
            }
        }
    }
`

// Interface for each item (row) in the 'aboutCard' repeater
interface AboutCardData {
    aboutCardHeading?: string;
    aboutCardContent?: string;
    aboutCardBackground?: {
        node?: {
            sourceUrl?: string;
            altText?: string;
        };
    };
}

// Interface for the 'homePage' ACF field group
interface HomePageAcfData {
    h1TextBeforeHighLight?: string;
    h1TextHighlight?: string;
    h1TextAfterHighlight?: string;
    h1TextHighlight2?: string;
    aboutCard?: AboutCardData[]; // 'aboutCard' is an array of AboutCardData objects
}

// Interface for the 'page' object
interface PageData {
    id: string;
    title?: string;
    homePage?: HomePageAcfData;
}

// Interface for the overall query response data
interface QueryData {
    page?: PageData;
}








export default function Hero() {

    const pageId = '2'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_HERO_DATA, {
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
    const h1TextBeforeHighLight = acfData?.h1TextBeforeHighLight
    const h1TextHighlight = acfData?.h1TextHighlight
    const h1TextAfterHighlight = acfData?.h1TextAfterHighlight
    const h1TextHighlight2 = acfData?.h1TextHighlight2
    const aboutCardItems = acfData?.aboutCard


    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Hero content not found. Check ACF and query.</p>;
    } 
    


    return (
        <>
            <section id='hero-section'>
                <div id='hero'
                     className='flex flex-col items-center justify-center px-8 py-4 rounded-tl-[40px] rounded-br-[40px] bg-red-400'>
                    {acfData && 
                        <h1 className='text-left text-5xl'>
                            <div className='flex flex-col gap-4'>
                                <div>
                                    {h1TextBeforeHighLight}
                                    <span className='text-white mb-1'>{h1TextHighlight}</span>
                                </div>
            
                                <div>
                                    {h1TextAfterHighlight}
                                    <span className='text-white'>{h1TextHighlight2}</span>
                                </div>
                            </div>
                        </h1>
                    }
                </div>
            </section>
    
            <section id='about-section'>
                <div id='about-section-content'
                     className='flex flex-col items-center justify-center gap-4 mt-40'>
                    {acfData &&
                        aboutCardItems?.map((item, index) => (
                            <div
                             id='about-card'
                             key={index}
                             className='ml-4 mr-4 rounded-bl-[40px] rounded-br-[40px] p-4'
                            //  style={{
                            //     backgroundImage: `url(${item.aboutCardBackground?.node?.sourceUrl})`,
                            //     backgroundSize: '',
                            //     backgroundPosition: 'center',
                            //     backgroundRepeat: 'no-repeat'
                            //  }}
                             >
                                <h2 className='text-lg text-424141'>
                                    {item.aboutCardHeading}
                                </h2>
                                <p className='text-2xl text-424141'>
                                    {item.aboutCardContent}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </section>
        </>
    )
}

