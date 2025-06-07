'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react';
import ThreeScene from '../r3f/ProcessGeometry';
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
                servicesHeading
                serviceCard {
                    serviceTitle
                    serviceList {
                        serviceItem
                    }
                }

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
interface ServiceCardData {
    serviceTitle?: string;
    serviceList?: {
        serviceItem?: string;
    }[];
}   

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
    servicesHeading?: string;
    serviceCard?: ServiceCardData[];
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
    // Add useRef for card references
    const serviceCardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    const servicesHeading = acfData?.servicesHeading
    const serviceCard = acfData?.serviceCard
    const statsHeading = acfData?.statsHeading
    const statisticCard = acfData?.statisticCard    
    const processHeading = acfData?.processHeading
    const processSteps = acfData?.processSteps

    // NOW the useEffect can reference serviceCard
    useEffect(() => {
        if (!serviceCard || serviceCard.length === 0) return;

        // Copy the ref value to a variable at the start of the effect
        const currentServiceCards = serviceCardsRef.current;

        // SERVICES ANIMATIONS
        const servicesSection = document.getElementById('services-section')
        const servicesContainer = document.getElementById('services-container')
        const serviceTitle = document.querySelectorAll('.service-title')

        if (servicesSection && servicesContainer) {
            // Only animate titles initially, not the lists
        gsap.set(serviceTitle, {
            opacity: 0,
            y: 100,
        })

            gsap.to(serviceTitle, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.inOut",
                stagger: 0.1
            })

            // Set up hover animations for each card
            currentServiceCards.forEach((card) => {
                if (!card) return;

                const title = card.querySelector('.service-title');
                const listItems = card.querySelectorAll('.service-item');
                const serviceList = card.querySelector('.service-list');

                // Set initial state for list items (hidden)
                if (serviceList) {
        gsap.set(serviceList, {
            opacity: 0,
                        height: 0,
                        overflow: "hidden"
                    });
                }

                if (listItems.length > 0) {
                    gsap.set(listItems, {
                        opacity: 0,
                        y: 20,
                        scale: 0.9
                    });
                }

                // Create hover enter animation
                const hoverEnter = () => {
                    // Animate card scale
                    gsap.to(card, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    // Animate title
                    if (title) {
                        gsap.to(title, {
                            y: -10,
                            scale: 1.05,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }

                    // Show list container first
                    if (serviceList) {
                        gsap.to(serviceList, {
                            opacity: 1,
                            height: "auto",
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    }

                    // Then animate list items with stagger
                    if (listItems.length > 0) {
                        gsap.to(listItems, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.1,
                            stagger: 0.1,
                            ease: "power2.inOut",
                            delay: 0.2
                        });
                    }
                };

                // Create hover leave animation
                const hoverLeave = () => {
                    // Animate card back to normal
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    // Animate title back
                    if (title) {
                        gsap.to(title, {
                            y: 0,
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }

                    // Animate list items out first
                    if (listItems.length > 0) {
                        gsap.to(listItems, {
                            opacity: 0,
                            y: -10,
                            scale: 0.9,
                            duration: 0.4,
                            stagger: 0.02,
                            ease: "power2.in"
                        });
                    }

                    // Then hide list container
                    if (serviceList) {
                        gsap.to(serviceList, {
                            opacity: 0,
                            height: 0,
                            duration: 0.3,
                            ease: "power2.in",
                            delay: 0.1
                        });
                    }
                };

                // Add event listeners
                card.addEventListener('mouseenter', hoverEnter);
                card.addEventListener('mouseleave', hoverLeave);
            });
        }

        // STATS ANIMATIONS
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

        // Cleanup function - use the copied variable instead of the ref
        return () => {
            currentServiceCards.forEach((card) => {
                if (card) {
                    card.removeEventListener('mouseenter', () => {});
                    card.removeEventListener('mouseleave', () => {});
                }
            });
        };

    }, [serviceCard, statisticCard]); // Updated dependency array


    // STATS CARD GRADIENTS
    const cardGradientsMobile = [
        'bg-gradient-to-b from-[#FCA5A5] to-red-400', // Card 1
        'bg-gradient-to-b from-red-400 to-red-600', // Card 2  
        'bg-gradient-to-b from-red-600 to-red-400' // Card 3
    ]

    // const cardGradients = [
    //     'bg-gradient-to-r from-[#FCA5A5] to-red-400', // Card 1
    //     'bg-gradient-to-r from-red-400 to-red-600', // Card 2  
    //     'bg-gradient-to-r from-red-600 to-red-400' // Card 3
    // ]

    // Move the conditional returns after all hooks
    if (loading) return 
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
            <section id='services-section'
                     className='bg-black py-16'>
                <div id='services-container'
                className='flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-[20px]'>
                    <h2 className='text-center text-4xl text-white'>{servicesHeading}</h2>
                    {serviceCard?.map((card, index) => (
                        <div 
                            key={index}
                            ref={(el) => {
                                if (el) {
                                    serviceCardsRef.current[index] = el;
                                }
                            }}
                             id='service-card'
                            className='service-card flex flex-col items-center w-full gap-4 border-red-400 border-r-2 p-8 min-h-[300px] bg-black  rounded-br-[0px] hover:border-r-0'
                        >
                            <div className='flex flex-col items-start w-full gap-2'>
                            <h3 className='service-title text-left text-2xl text-white'>{card.serviceTitle}</h3>
                                <ul className='service-list flex flex-col items-start w-full gap-2 opacity-0 overflow-hidden'>
                                    {card.serviceList?.map((item, itemIndex) => (
                                        <li key={itemIndex} className='service-item text-left text-white'>
                                            {item.serviceItem}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            <section id='statistics-section'
                     className='bg-black py-16'>
                <div id='statistics-container'
                className='flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4'>
                    <h2 className='stats-heading text-center text-4xl text-white mb-8'>{statsHeading}</h2>
                    {statisticCard?.map((card, index) => (
                        <div key={index}
                             id='statistic-card'
                             className={`flex flex-col items-left justify-center w-full gap-4 p-8 min-h-[200px] rounded-lg ${cardGradientsMobile[index] || 'bg-gray-500'}`}>
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
                    <h2 className='text-center text-4xl font-bold'>{processHeading}</h2>

                    <ThreeScene />
                    
                    {processSteps?.map((step, index) => (
                        <div key={index}
                             id='process-step'
                             className='flex flex-col items-left h-[80vh] gap-4'>
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

