'use client'

import { gql, useQuery } from '@apollo/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react';
import HeroVideo from './HeroVideo'
import { SplitText } from 'gsap/SplitText'
import Link from 'next/link'
import { prefersReducedMotion } from '@/app/lib/gsapConfig'


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
                    aboutCardNumber
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
    aboutCardNumber?: string;
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

gsap.registerPlugin(ScrollTrigger, useGSAP, SplitText)

export default function Hero() {
    const pageId = '126'
    const pageIdType = 'DATABASE_ID'
    
    // Container ref for useGSAP scope
    const containerRef = useRef<HTMLElement>(null)
    const aboutSectionRef = useRef<HTMLElement>(null) // Add this new ref
    
    // Element refs
    const heroRef = useRef<HTMLDivElement>(null)
    const heroText1Ref = useRef<HTMLDivElement>(null)
    const heroText2Ref = useRef<HTMLSpanElement>(null)
    const heroText3Ref = useRef<HTMLDivElement>(null)
    const heroText4Ref = useRef<HTMLSpanElement>(null)
    const discoverBtnRef = useRef<HTMLDivElement>(null)

    const { loading, error, data } = useQuery<QueryData>(GET_HERO_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    });

    const acfData = data?.page?.homePage
    const h1TextBeforeHighLight = acfData?.h1TextBeforeHighLight
    const h1TextHighlight = acfData?.h1TextHighlight
    const h1TextAfterHighlight = acfData?.h1TextAfterHighlight
    const h1TextHighlight2 = acfData?.h1TextHighlight2
    const aboutCardItems = acfData?.aboutCard

    // Hero animations with useGSAP
    useGSAP(() => {
        if (!acfData) return;

        const hero = heroRef.current
        const heroText1 = heroText1Ref.current
        const heroText2 = heroText2Ref.current
        const heroText3 = heroText3Ref.current
        const heroText4 = heroText4Ref.current
        const heroVideo = document.getElementById('hero-video')

        if (!hero || !heroText1 || !heroText2 || !heroText3 || !heroText4) {
            return;
        }

        // Check for reduced motion preference
        if (prefersReducedMotion()) {
            // Set final states immediately, no animations
            gsap.set(hero, {
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                borderTopLeftRadius: '40px',
                borderBottomRightRadius: '40px',
            })

            gsap.set([heroText1, heroText2, heroText3, heroText4], {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
            })

            if (heroVideo) {
                gsap.set(heroVideo, {
                    opacity: 1,
                    filter: 'blur(0px)',
                })
            }
            return; // Exit early, skip animations
        }

        // if not reduced motion, set initial states
        gsap.set(hero, {
            opacity: 0,
            scaleX: 0.01,
            scaleY: 0.01,
            y: 0,
        })

        gsap.set([heroText1, heroText3], {
            opacity: 0,
            y: 30,
        })

        gsap.set([heroText2, heroText4], {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)',
        })

        if (heroVideo) {
            gsap.set(heroVideo, {
                opacity: 0,
                filter: 'blur(10px)',
            })
        }


        // Create animation timeline
        const tl = gsap.timeline()

        tl
            .to(hero, {
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
            
            // All text elements animate together right after hero animation
            .to([heroText1, heroText2, heroText3, heroText4], {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.1, 
            }, "-=0.1") // Start slightly before hero animation ends

        if (heroVideo) {
            tl.to(heroVideo, {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.5,
                ease: 'power2.out',
            }, ) // Start with the text animation
        }

        

    }, { 
        scope: containerRef, 
        dependencies: [acfData], // Re-run when data changes
        revertOnUpdate: true // Clean up previous animations when dependencies change
    })

    // About cards animations with useGSAP
    useGSAP(() => {
        if (!aboutCardItems || aboutCardItems.length === 0) {
            return;
        }

        // Search in the about section
        const aboutCards = aboutSectionRef.current?.querySelectorAll('.about-card-content') || 
                          document.querySelectorAll('.about-card-content')
        if (!aboutCards || aboutCards.length === 0) {
            return;
        }

        aboutCards.forEach((card) => {
            const aboutCardContent = card.querySelector('.card-content')

            // Check for reduced motion preference
            if (prefersReducedMotion()) {
                // Set final states immediately
                gsap.set(card, { 
                    opacity: 1,
                    y: 0,
                })

                if (aboutCardContent) {
                    gsap.set(aboutCardContent, {
                        overflow: 'visible' // Reset overflow
                    });
                }
                return; // Skip animations for this card
            }

            // Original animation code (only runs if motion is preferred)
            gsap.set(card, { 
                opacity: 0,
                y: 30,
            })

            if (aboutCardContent) {
                // create splitText variable -- split by lines
                const splitBody = new SplitText(aboutCardContent, {
                    type: 'lines'
                })

                if(splitBody.lines.length > 0) {
                    // set initial state
                    gsap.set(splitBody.lines, {
                        yPercent: 100,
                        opacity: 0
                    });
                    // set to overflow hidden
                    gsap.set(aboutCardContent, {
                        overflow: 'hidden'
                    });

                    // add scrollTrigger for splitText content
                    ScrollTrigger.create({
                        trigger: aboutCardContent,
                        start: "top 70%",
                        once: true,
                        markers: false,

                        onEnter: () => {
                            gsap.to(splitBody.lines, {
                                duration: 1,
                                yPercent: 0,
                                opacity: 1,
                                stagger: 0.2,
                                ease: "power2.out"
                            })
                        }
                    })
                }   
            }

            // card animation -- for heading and number
            ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                once: true,
                markers: false,
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out",
                    })
                }
            })
        })

        // Refresh ScrollTrigger after setting up all animations
        ScrollTrigger.refresh()

    }, { 
        scope: aboutSectionRef, // Change scope to about section
        dependencies: [aboutCardItems],
        revertOnUpdate: true
    })

    // if (loading) return <div className="p-8 text-center">Loading...</div>
    if (error) {
        console.error("GraphQL Error:", error);
        return <p className="p-8 text-center text-red-500">Error loading hero data. Check console.</p>;
    }

    if (!acfData && !loading) {
        return <p className="p-8 text-center">Hero content not found. Check ACF and query.</p>;
    } 

    return (
        <>
            <section ref={containerRef} id='hero-section' className='py-[10px] md:max-w-screen-2xl md:mx-auto'>
                <div 
                    ref={heroRef}
                    className='hero-initial-hidden px-[10px] flex flex-col items-center justify-center py-4 bg-skye-primary-red ml-[10px] mr-[10px]'
                >
                    {acfData && 
                        <h1 className='text-left text-h1-mobile text-skye-gray md:text-[6rem] lg:text-h1-desktop'>
                            <div className='flex flex-col gap-4'>
                                <div ref={heroText1Ref} className='hero-text-initial-hidden'>
                                    {h1TextBeforeHighLight}
                                    <span ref={heroText2Ref} className='hero-text-blur-initial-hidden text-white mb-1'>
                                        {h1TextHighlight}
                                    </span>
                                </div>
            
                                <div ref={heroText3Ref} className='hero-text-initial-hidden'>
                                    {h1TextAfterHighlight}
                                    <span ref={heroText4Ref} className='hero-text-blur-initial-hidden text-white'>
                                        {h1TextHighlight2}
                                    </span>
                                </div>
                            </div>
                        </h1>
                    }
                </div>

                <div className='hero-video mt-24 mx-[10px] py-[10px] md:py-24'>
                    <HeroVideo/>
                </div>
            </section>

            <section ref={aboutSectionRef} id='about-section' className='mx-[10px] mt-24 md:max-w-screen-2xl md:mx-auto'>
                <div className='about-cards-container flex flex-col gap-8 divide-y-2 divide-skye-primary-red md:gap-16 '>
                    {aboutCardItems && aboutCardItems.map((item, index) => (
                        
                            <div key={index} className='about-card-content p-4 pb-8 flex flex-col justify-center gap-4 w-full max-w-[800px] mx-auto md:max-w-[1200px] md:pb-16'>
                                <div className='flex justify-between'>
                                    <h2 className='card-heading text-submobile text-skye-primary-red md:text-subdesktop'>
                                        {item.aboutCardHeading}
                                    </h2>
                                    <h2 className='card-number text-submobile text-skye-primary-red md:text-subdesktop'>
                                        {item.aboutCardNumber}
                                    </h2>
                                </div>
                                <p className='card-content text-h2-mobile text-white drop-shadow-lg md:text-h2-desktop'>
                                    {item.aboutCardContent}
                                </p>
                            </div>
                        
                    ))}
                </div>

                <div ref={discoverBtnRef} className='discover-cta flex justify-center opacity-0'>
                    <Link href="/studio" className="btn-secondary bg-skye-primary-red text-skye-white mt-8 border-2 border-white rounded-bl-[20px] px-8 py-4 hover:bg-skye-white hover:text-skye-primary-red transition-all duration-300 ease-in-out">
                    More About Skye
                    </Link>
                </div>
            </section>
        </>
    )
}

