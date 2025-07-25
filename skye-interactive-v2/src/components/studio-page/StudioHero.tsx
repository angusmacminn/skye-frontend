'use client'

import { gql, useQuery } from '@apollo/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react';
import { prefersReducedMotion } from '@/app/lib/gsapConfig'


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


gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function StudioHero() {
    const pageId = '8'
    const pageIdType = 'DATABASE_ID'

    // Container ref for useGSAP scope
    const containerRef = useRef<HTMLElement>(null)
    
    // Element refs
    const heroRef = useRef<HTMLDivElement>(null)
    const heroText1Ref = useRef<HTMLHeadingElement>(null)
    const heroText2Ref = useRef<HTMLHeadingElement>(null)

    const { loading, error, data } = useQuery<QueryData>(GET_STUDIO_HERO_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })

    // define variavbles for data
    const acfData = data?.page?.studioPage
    const heroH1 = acfData?.heroH1
    // const heroH2 = acfData?.heroIntroParagraph


    // Hero animations with useGSAP
    useGSAP(() => {
        if (!acfData) return;

        const hero = heroRef.current
        const heroText1 = heroText1Ref.current
        const heroText2 = heroText2Ref.current

        if (!hero || !heroText1 || !heroText2) {
            return;
        }

        if (prefersReducedMotion()) {
            gsap.set(hero, {
                autoAlpha: 1,
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                borderTopLeftRadius: '40px',
                borderBottomRightRadius: '40px',
            })
            gsap.set([heroText1, heroText2], {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
            })
            return;
        }

        // Set initial states
        gsap.set(hero, {
            autoAlpha: 0,
            opacity: 0,
            scaleX: 0.01,
            scaleY: 0.01,
            y: 0,
        })

        gsap.set([heroText1, heroText2], {
            opacity: 0,
            y: 30,
        })

        // Create animation timeline
        const tl = gsap.timeline()

        tl
            .to(hero, {
                autoAlpha: 1,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',                    
            })
            .to(hero, {
                scaleX: 1,
                duration: 0.5,
                ease: 'power3.out',
            }, "-=0.1")
            .to(hero, {
                scaleY: 1,
                borderTopLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                duration: 0.5,
                ease: 'power2.out',
            }, "-=0.2")
            .to(heroText1, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out',    
            })
            .to(heroText2, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
            }, "-=0.1")

    }, { 
        scope: containerRef, 
        dependencies: [acfData], // Re-run when data changes
        revertOnUpdate: true // Clean up previous animations when dependencies change
    })

    if (error) {
        console.error("GraphQL Error:", error);
        return <p className="p-8 text-center text-red-500">Error loading studio hero data. Check console.</p>;
    }

    if (!acfData && !loading) {
        return <p className="p-8 text-center">Studio hero content not found. Check ACF and query.</p>;
    }

    return (
        <section ref={containerRef} className='py-[10px] md:max-w-screen-2xl md:mx-auto md:py-24'>
            <div 
                ref={heroRef}
                className='opacity-0 flex flex-col items-center justify-center gap-4 px-8 py-4 bg-skye-primary-red mx-[10px]'
            >
                <h1 
                    ref={heroText1Ref}
                    className='text-left text-h1-mobile text-skye-gray md:text-[6rem]'
                >
                    {heroH1}
                </h1>
                <h2 
                    ref={heroText2Ref}
                    className='text-h2-mobile text-white md:text-h2-desktop'
                >
                    {/* {heroH2} */}
                </h2>
            </div>
        </section>
    )
}