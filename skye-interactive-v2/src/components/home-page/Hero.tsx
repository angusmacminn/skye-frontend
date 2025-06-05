'use client'

import { gql, useQuery } from '@apollo/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useEffect } from 'react';

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
    const pageId = '2'
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

            // Check if all elements exist before animating
            if (!hero || !heroText1 || !heroText2 || !heroText3 || !heroText4) {
                console.log('Hero elements not found:', { hero, heroText1, heroText2, heroText3, heroText4 });
                return;
            }

            console.log('Hero elements found, starting animation');

            // create timeline for multiple animations
            const tl = gsap.timeline()

            // set initial state (small and invisible)
            gsap.set(hero, {
                opacity: 0,
                scaleX: 0.2,
                scaleY: 0.2,
                y: 0,
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
                    duration: 0.8,
                    ease: 'power2.out',
                })
                // stage 2: grow horizontally first
                .to(hero, {
                    scaleX: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                }, "-=0.1")
                // stage 3: then grow vertically
                .to(hero, {
                    scaleY: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                }, "-=0.2")
                // stage 4: fade in text
                .to(heroText1, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                })
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

        console.log('Setting up individual card animations');

        const timer = setTimeout(async () => {
            // Wait for fonts to load
            if (document.fonts) {
                await document.fonts.ready;
            }

            const aboutCards = document.querySelectorAll('.about-card');
            console.log('Found cards:', aboutCards.length);
            
            aboutCards.forEach((card, index) => {
                // Set initial state
                gsap.set(card, {
                    opacity: 0,
                    y: 100,
                    scale: 0.8,
                    rotation: 10,
                    filter: 'blur(10px)',
                    scaleX: 0.0,
                    scaleY: 0.0,
                });

                // Create ScrollTrigger for each card
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    markers: true,
                    onEnter: (self) => {
                        console.log(`Animating card ${index}`);
                        
                        // Animate card in
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            rotation: 0,
                            filter: 'blur(0px)',
                            scaleX: 1,
                            scaleY: 1,
                        });

                        // Animate text with SplitText
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
                                duration: 0.6,
                                stagger: 0.02,
                                ease: "power2.out",
                                delay: 0.3
                            });

                            gsap.to(contentSplit.words, {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                stagger: 0.08, // Slower stagger for words
                                ease: "power2.out",
                                delay: 0.5, // Slightly later delay
                                filter: 'blur(0px)',
                            });
                        }
                        
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

    if (loading) return <p>Loading...</p>
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
                     className='ml-[10px] mr-[10px] py-[10px] h-[100vh]'>
                <div id='hero'
                     className='flex flex-col items-center justify-center px-8 py-4 rounded-tl-[40px] rounded-br-[40px] bg-red-400'>
                    {acfData && 
                        <h1 className='text-left text-5xl text-skye-gray'>
                            <div className='flex flex-col gap-4'>
                                <div id='hero-text-1'>
                                    {h1TextBeforeHighLight}
                                    <span id='hero-text-2' className='text-white mb-1'>{h1TextHighlight}</span>
                                </div>
            
                                <div id='hero-text-3'>
                                    {h1TextAfterHighlight}
                                    <span id='hero-text-4' className='text-white'>{h1TextHighlight2}</span>
                                </div>
                            </div>
                        </h1>
                    }
                </div>
            </section>
    
            <section id='about-section' className='ml-[10px] mr-[10px]'>
                <div className='flex flex-col items-center justify-center gap-16 py-8'>
                    {acfData && aboutCardItems?.map((item, index) => (
                        <div
                            key={index}
                            className='about-card p-[4px] rounded-bl-[40px] rounded-br-[40px] w-full max-w-md'
                            style={{ background: "var(--gradient-card-border)" }}>
                            <div className='rounded-bl-[38px] rounded-br-[38px] p-4 flex flex-col justify-center gap-4'
                                style={{ background: "var(--gradient-card-inner)" }}>
                                <div className='flex justify-between'>
                                    <h2 className='card-heading text-lg text-skye-gray'>
                                        {item.aboutCardHeading}
                                    </h2>
                                    <h2 className='card-number text-lg text-skye-gray'>
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

