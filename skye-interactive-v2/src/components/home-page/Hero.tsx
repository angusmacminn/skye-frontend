'use client'

import { gql, useQuery } from '@apollo/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useEffect } from 'react';
import HeroVideo from './HeroVideo'


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

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(SplitText)

export default function Hero() {
    const pageId = '126'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_HERO_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    });

    // Move these definitions BEFORE the useEffect
    const acfData = data?.page?.homePage
    const h1TextBeforeHighLight = acfData?.h1TextBeforeHighLight
    const h1TextHighlight = acfData?.h1TextHighlight
    const h1TextAfterHighlight = acfData?.h1TextAfterHighlight
    const h1TextHighlight2 = acfData?.h1TextHighlight2
    const aboutCardItems = acfData?.aboutCard

    // gsap animation for hero section
    useEffect(() => {
        // Only run when we have data
        if (!acfData) return;

        // Wait a bit for DOM to be ready after data loads
        const timer = setTimeout(() => {
            const hero = document.getElementById('hero')
            const heroText1 = document.getElementById('hero-text-1')
            const heroText2 = document.getElementById('hero-text-2')
            const heroText3 = document.getElementById('hero-text-3')
            const heroText4 = document.getElementById('hero-text-4')
            const heroVideo = document.getElementById('hero-video')

            // Check if all elements exist before animating
            if (!hero || !heroText1 || !heroText2 || !heroText3 || !heroText4) {
                console.log('Hero elements not found:', { hero, heroText1, heroText2, heroText3, heroText4 });
                return;
            }
            // create timeline
            const tl = gsap.timeline()

            // set hero to invisible and small
            gsap.set(hero, {
                opacity: 0,
                scaleX: 0.05,
                scaleY: 0.05,
                y: 0,
            })

            // set video to invisible and blurred
            gsap.set(heroVideo, {
                opacity: 0,
                filter: 'blur(10px)',
            })

            // set text to invisible
            gsap.set(heroText1, {
                opacity: 0,
                y: 30,
            })
            gsap.set(heroText2, {
                opacity: 0,
                y: 30,
                filter: 'blur(10px)',
            })
            gsap.set(heroText3, {
                opacity: 0,
                y: 30,
            })
            gsap.set(heroText4, {
                opacity: 0,
                y: 30,
                filter: 'blur(10px)',
            })

            tl
                // stage 1: fade in with small scale
                .to(hero, {
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',                    
                })
                // stage 2: grow horizontally first
                .to(hero, {
                    scaleX: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                }, "-=0.1")
                // stage 3: then grow vertically
                .to(hero, {
                    scaleY: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                }, "-=0.2")

                // change border radius
                .to(hero, {
                    borderTopLeftRadius: '40px',
                    borderBottomRightRadius: '40px',
                    duration: 0.6,
                    ease: 'power2.out',
                }, "-=0.1")

                
                // stage 4: fade in text
                .to(heroText1, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',    
                },)
                .to(heroText2, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'power2.out',
                }, "-=0.1")
                .to(heroText3, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                }, "-=0.1")
                .to(heroText4, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.7,
                    ease: 'power2.out',
                }, "-=0.1")

            // stage 5: fade in video (only if it exists)
            if (heroVideo) {
                tl.to(heroVideo, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.5,
                    ease: 'power2.out',
                }, '-=0.5')
            }

            return () => {
                tl.kill();
            };
        }, 100); // Wait 100ms for DOM to be ready

        return () => {
            clearTimeout(timer);
        };
    }, [acfData]) // Depend on acfData instead of empty array

    // gsap animation for about section
    useEffect(() => {
        if (!aboutCardItems || aboutCardItems.length === 0) return;

        const timer = setTimeout(async () => {
            // Wait for fonts to load
            if (document.fonts) {
                await document.fonts.ready;
            }

            const aboutCards = document.querySelectorAll('.about-card');
            
            aboutCards.forEach((card, index) => {
                // Remove CSS class and let GSAP take control
                card.classList.remove('about-card-initial-hidden');
                
                // // Set initial state
                gsap.set(card, {
                    opacity: 0,
                    // y: 100,
                    // scale: 0.8,
                    // rotation: 10,
                    // filter: 'blur(10px)',
                    // scaleX: 0.0,
                    // scaleY: 0.0,
                });

                // Create ScrollTrigger for each card
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 50%",
                    end: "bottom 20%",
                    markers: false,
                    onEnter: (self) => {
                        console.log(`Animating card ${index}`);
                        
                        // Animate card in
                        gsap.to(card, {
                            opacity: 1,
                            // y: 0,
                            // duration: 0.5,
                            // ease: "power2.out",
                            // rotation: 0,
                            // filter: 'blur(0px)',
                            // scaleX: 1,
                            // scaleY: 1,
                        });

                        // COMMENTED OUT - This is what's causing the error:
                        /*
                        const heading = card.querySelector('.card-heading');
                        const number = card.querySelector('.card-number');
                        const content = card.querySelector('.card-content');

                        if (heading && number && content) {
                            const headingSplit = new SplitText(heading, { 
                                type: "chars",
                                charsClass: "split-char"
                            });
                            const numberSplit = new SplitText(number, { 
                                type: "chars",
                                charsClass: "split-char"
                            });
                            const contentSplit = new SplitText(content, { 
                                type: "words", // Use words for longer content
                                wordsClass: "split-word"
                            });

                            gsap.set([headingSplit.chars, numberSplit.chars], {
                                display: "inline-block",
                                opacity: 0,
                                filter: 'blur(10px)',
                                y: 30
                            });

                            gsap.set(contentSplit.words, {
                                display: "inline-block",
                                opacity: 0,
                                filter: 'blur(10px)',
                                y: 30
                            });

                            gsap.to([headingSplit.chars, numberSplit.chars], {
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                                duration: 0.3,
                                stagger: 0.02,
                                ease: "power2.out",
                                delay: 0.3
                            });

                            gsap.to(contentSplit.words, {
                                opacity: 1,
                                y: 0,
                                duration: 0.5,
                                stagger: 0.08, // Slower stagger for words
                                ease: "power2.out",
                                delay: 0.9, // Slightly later delay
                                filter: 'blur(0px)',
                            });
                        }
                        */
                        
                        self.kill();
                    }
                });
            });
        }, 500); // Increased timeout for about cards

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };

    }, [aboutCardItems])

    if (loading) return <div className="p-8 text-center">Loading...</div>
    if (error) {
        console.error("GraphQL Error:", error);
        return <p className="p-8 text-center text-red-500">Error loading hero data. Check console.</p>;
    }

    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Hero content not found. Check ACF and query.</p>;
    } 

    return (
        <>
            <section id='hero-section'
                     className='py-[10px] md:max-w-screen-2xl md:mx-auto'>
                <div id='hero'
                     className='hero-initial-hidden flex flex-col items-center justify-center px-8 py-4 bg-red-400 md:ml-[10px] mr-[10px]'>
                    {acfData && 
                        <h1 className='text-left text-5xl text-skye-gray md:text-[6rem]'>
                            <div className='flex flex-col gap-4'>
                                <div id='hero-text-1' className='hero-text-initial-hidden'>
                                    {h1TextBeforeHighLight}
                                    <span id='hero-text-2' className='hero-text-blur-initial-hidden text-white mb-1'>{h1TextHighlight}</span>
                                </div>
            
                                <div id='hero-text-3' className='hero-text-initial-hidden'>
                                    {h1TextAfterHighlight}
                                    <span id='hero-text-4' className='hero-text-blur-initial-hidden text-white'>{h1TextHighlight2}</span>
                                </div>
                            </div>
                        </h1>
                    }
                </div>

                <div className='hero-video ml-[10px] mr-[10px] py-[10px] md:py-24'>
                    <HeroVideo/>
                </div>
            </section>

    
            <section id='about-section' className=' ml-[10px] mr-[10px] border-2 border-skye-gray-light rounded-tl-[40px] rounded-tr-[40px] md:max-w-screen-2xl md:mx-auto'>
                <div className='flex flex-col items-center justify-center py-8 divide-y-2 divide-skye-gray-light md:max-w-screen-2xl md:mx-auto'>
                    {acfData && aboutCardItems?.map((item, index) => (
                        <div
                            key={index}
                            className='about-card w-full max-w-md p-[4px] py-12 md:max-w-xl'>
                            <div className='p-4 flex flex-col justify-center gap-4'>
                                <div className='flex justify-between'>
                                    <h2 className='card-heading text-lg text-skye-white'>
                                        {item.aboutCardHeading}
                                    </h2>
                                    <h2 className='card-number text-lg text-skye-primary-red'>
                                        {item.aboutCardNumber}
                                    </h2>
                                </div>
                                <p className='card-content text-2xl text-white drop-shadow-lg'>
                                    {item.aboutCardContent}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

