'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react';
import ThreeScene from '../r3f/ProcessGeometry';
import ServiceCards from './ServiceCards';
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

const GET_SERVICES_DATA = gql`
    query GetServicesData ($id: ID!, $idType: PageIdType!) {
        page(id: $id, idType: $idType) {
            title
            homePage {
                statsHeading
                    statisticCard {
                        statCategory
                        statNumber
                    }

                processHeading
                processSteps {
                    processNumber
                    stepHeading
                    stepDescription
                }
                
            }
        }
    }
`

interface StatisticCardData {
    statCategory?: string;
    statNumber?: string;
}

interface ProcessStepData {
    processNumber?: string;
    stepHeading?: string;
    stepDescription?: string;
}

interface HomePageAcfData {
    processHeading?: string;
    processSteps?: ProcessStepData[];
    statsHeading?: string;
    statisticCard?: StatisticCardData[];
}

interface PageData {
    id: string;
    title?: string;
    homePage?: HomePageAcfData;
}

interface QueryData {
    page?: PageData;
}

// Register plugins
gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)
gsap.registerPlugin(ScrambleTextPlugin) 

function Services() {
    // Move these BEFORE useEffect
    const pageId = '126'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_SERVICES_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    });

    const acfData = data?.page?.homePage
    const statsHeading = acfData?.statsHeading
    const statisticCard = acfData?.statisticCard    
    const processHeading = acfData?.processHeading
    const processSteps = acfData?.processSteps

    // STATS ANIMATIONS
    useEffect(() => {
        if (statisticCard && statisticCard.length > 0) {
            setTimeout(() => {
                const statsHeading = document.querySelector('.stats-heading');
                const statisticCards = document.querySelectorAll('#statistic-card');
                const statCategory = document.querySelectorAll('.stat-category');
                const statNumber = document.querySelectorAll('.stat-number');

                if (statsHeading) {
                    const initAnimation = async () => {
                        if (document.fonts) {
                            await document.fonts.ready;
                        }

                        const splitHeading = new SplitText(statsHeading, { 
                            type: "lines"
                        });

                        if (splitHeading.lines.length > 0) {
                            // Set initial state (hidden)
                            gsap.set(splitHeading.lines, {
                                yPercent: 100,
                                opacity: 0
                            });

                            gsap.set(statsHeading, {
                                overflow: "hidden"
                            });

                            // Add ScrollTrigger for the heading
                            ScrollTrigger.create({
                                trigger: statsHeading,
                                start: "top 50%",
                                end: "bottom 20%",
                                markers: false,
                                
                                onEnter: () => {
                                    gsap.to(splitHeading.lines, {
                                        duration: 1.5,
                                        yPercent: 0,
                                        opacity: 1,
                                        stagger: 0.2,
                                        ease: "power2.out"
                                    });
                                }
                            });
                        }
                    };

                    initAnimation();
                }


                if (statisticCards && statisticCards.length > 0 && statCategory.length > 0 && statNumber.length > 0) {
                    // Set initial state for cards, categories and numbers
                    statisticCards.forEach((card) => {
                        gsap.set(card, {
                            opacity: 0,
                            x: -100,
                            scale: 0.3,
                            filter: "blur(10px)",
                        });
                    });
                    
                    gsap.set(statCategory, {
                        opacity: 0,
                        y: 50,
                        filter: "blur(10px)"
                    });
                
                    gsap.set(statNumber, {
                        opacity: 0,
                        y: 50,
                        filter: "blur(10px)"
                    });
                
                    // Create ScrollTrigger for stat cards
                    ScrollTrigger.create({
                        trigger: statisticCards[0], // Use first card as trigger
                        start: "top 50%",
                        end: "bottom 20%",
                        markers: false,
                        onEnter: () => {
                            // Animate the cards with stagger
                            gsap.to(statisticCards, { // Use statisticCards instead of card
                                opacity: 1,
                                x: 0,
                                scale: 1,
                                duration: 0.6,
                                filter: "blur(0px)",
                                stagger: 0.5, 
                                ease: "power2.out",
                            });

                            // Animate categories in after cards start
                            gsap.to(statCategory, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                stagger: 0.2,
                                delay: 0.3, // Small delay after cards start
                                ease: "power2.out",
                                filter: "blur(0px)"
                            });
                
                            // Then animate numbers with scramble effect
                            statNumber.forEach((numberEl, index) => {
                                const originalText = numberEl.textContent || '';
                                
                                gsap.to(numberEl, {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.8,
                                    delay: 0.3 + (index * 0.2),
                                    ease: "power2.out",
                                    filter: "blur(0px)"
                                });
                
                                // Scramble text effect
                                gsap.to(numberEl, {
                                    duration: 2,
                                    delay: 0.5 + (index * 0.2),
                                    scrambleText: {
                                        text: originalText,
                                        chars: "0123456789+$",
                                        revealDelay: 0.3,
                                        speed: 0.5
                                    }
                                });
                            });
                        }
                    });
                }
            }, 500);
        }
    }, [statisticCard]);

    // PROCESS ANIMATIONS
    useEffect(() => {
        if (processSteps && processSteps.length > 0) {
            setTimeout(() => {
                const processSection = document.getElementById('process-section');
                const statisticsSection = document.getElementById('statistics-section');

                if ( processSection && statisticsSection) {
                    // Set initial state for process section scaled down and positioned off-screen
                    gsap.set(processSection, {
                        y: 100,
                        transformOrigin: "center bottom",
                        position: "relative",
                        zIndex: 100,
                    })

                    // Create the scroll-jacked animation
                    ScrollTrigger.create({
                        trigger: statisticsSection,
                        start: "bottom bottom", // When bottom of stats section hits bottom of viewport
                        end: "bottom top",      // Until bottom of stats section hits top of viewport
                        pin: true,              // Pin the statistics section
                        pinSpacing: false,      // Don't add extra spacing
                        scrub: 1,               // Smooth scrubbing tied to scroll position
                        markers: false,         // Set to true for debugging
                        onUpdate: (self) => {
                            // As user scrolls, animate the process section to grow in
                            const progress = self.progress;

                            gsap.to(processSection, {                                
                                y: 100 - (100 * progress),
                                duration: 0.1,
                                ease: "none",
                            })
                        },
                        
                    })
                }


                // Process step animations
                if (processSteps && processSteps.length > 0) {
                    processSteps.forEach((step, index) => {
                        const stepElement = document.getElementById(`process-step-${index}`);

                        if (stepElement) {
                            // Set initial state
                            gsap.set(stepElement, {
                                opacity: 0,
                                x: 100,
                                filter: "blur(10px)",
                            })

                            ScrollTrigger.create({
                                trigger: stepElement,
                                start: "top 90%",       // When element enters viewport
                                end: "top 30%",        // When top of element hits 30% - earlier trigger
                                markers: false,          // Keep this true to see what's happening
                                onEnter: () => {
                                    
                                    gsap.to(stepElement, {
                                        opacity: 1,
                                        x: 0,
                                        filter: "blur(0px)",
                                        duration: 0.8,
                                        ease: "power2.out",
                                    })
                                },
                                onLeave: () => {
                                    
                                    gsap.to(stepElement, {
                                        opacity: 0,
                                        x: -100,
                                        filter: "blur(10px)",
                                        duration: 0.5,
                                        ease: "power2.in",
                                    })
                                },
                                onEnterBack: () => {
                                    
                                    gsap.to(stepElement, {
                                        opacity: 1,
                                        x: 0,
                                        filter: "blur(0px)",
                                        duration: 0.8,
                                        ease: "power2.out",
                                    })
                                },
                                onLeaveBack: () => {
                                    
                                    gsap.to(stepElement, {
                                        opacity: 0,
                                        x: 100,
                                        filter: "blur(10px)",
                                        duration: 0.5,
                                        ease: "power2.in",
                                    })
                                }
                            });
                        }
                    })
                }
            }, 500);
        }
    }, [processSteps]);

    // STATS CARD GRADIENTS
    const cardGradientsMobile = [
        'bg-gradient-to-b from-[#FCA5A5] to-red-400', // Card 1
        'bg-gradient-to-b from-red-400 to-red-600', // Card 2  
        'bg-gradient-to-b from-red-600 to-red-400' // Card 3
    ]

    // Move the conditional returns after all hooks
    if (loading) return null;
    if (error) {
        console.error("GraphQL Error:", error);
        return <p className="p-8 text-center text-red-500">Error loading hero data. Check console.</p>;
    }

    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Services content not found. Check ACF and query.</p>;
    } 

    return (
        <>
            <ServiceCards />

            <section id='statistics-section'
                     className='bg-black py-16'>
                <div id='statistics-container'
                className='flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4'>
                    <h2 className='stats-heading text-center text-4xl text-white mb-8'>{statsHeading}</h2>
                    {statisticCard?.map((card, index) => (
                        <div key={index}
                             id='statistic-card'
                             className={`flex flex-col items-left justify-center w-full gap-4 p-8 min-h-[300px] rounded-lg ${cardGradientsMobile[index] || 'bg-gray-500'}`}>
                            <h3 className='stat-category text-left text-2xl text-white'>{card.statCategory}</h3>
                            <p className='stat-number text-left text-4xl font-bold text-white drop-shadow-md'>{card.statNumber}</p>
                        </div>
                    ))}
                </div>
            </section>
    
            <section id='process-section'
            className='bg-skye-white py-16'>
                <div id='process-container'
                className='flex flex-col items-center gap-8 mt-10 w-full max-w-lg mx-auto px-4'>
                    <h2 className='process-heading text-center text-4xl sticky top-20 font-bold'>{processHeading}</h2>

                    <ThreeScene />
                    
                    {processSteps?.map((step, index) => (
                        <div key={index}
                             id={`process-step-${index}`}
                             className='flex flex-col items-left h-[70vh] gap-4'>
                            <h3 className='text-left text-2xl font-bold'>{step.stepHeading}</h3>
                            <p className='text-left text-lg'>{step.stepDescription}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}   

export default Services;

