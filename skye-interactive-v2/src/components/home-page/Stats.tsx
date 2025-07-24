'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react';
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { prefersReducedMotion } from '@/app/lib/gsapConfig'

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
            }
        }
    }
`

interface StatisticCardData {
    statCategory?: string;
    statNumber?: string;
}

interface HomePageAcfData {
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

function Stats() {
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

    // STATS ANIMATIONS
    useEffect(() => {
        if (statisticCard && statisticCard.length > 0) {
            setTimeout(() => {
                const statsHeading = document.querySelector('.stats-heading');
                const statisticCards = document.querySelectorAll('#statistic-card');
                const statCategory = document.querySelectorAll('.stat-category');
                const statNumber = document.querySelectorAll('.stat-number');

                if (prefersReducedMotion()) {
                    gsap.set(statsHeading, {
                        opacity: 1,
                    })
                    gsap.set(statisticCards, {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                    })
                    gsap.set(statCategory, {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                    })
                    gsap.set(statNumber, {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                    })
                    return;
                }

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
                                    duration: 1,
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

    // STATS CARD GRADIENTS - Updated approach  
    const getCardGradientClass = (index: number) => {
        const gradients = [
            'bg-gradient-to-b md:bg-gradient-to-r from-[#FCA5A5] to-red-400', // Card 1
            'bg-gradient-to-b md:bg-gradient-to-r from-red-400 to-red-600', // Card 2  
            'bg-gradient-to-b md:bg-gradient-to-r from-red-600 to-red-400' // Card 3
        ];
        return gradients[index] || 'bg-gray-500';
    };

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
        <section id='statistics-section'
                 className='bg-black py-24 relative'>
            {/* Full viewport background to prevent gray showing */}
            <div className='absolute inset-0 bg-black w-full min-h-[100vh]'></div>
                <div id='statistics-container'
                className='flex flex-col items-center gap-4 w-full max-w-lg md:max-w-6xl mx-auto px-4 relative z-10'>
                    <h3 className='stats-heading text-center text-h3-mobile text-white mb-8 md:text-h3-desktop'>{statsHeading}</h3>
                    <div className='flex flex-col items-center gap-4 w-full md:flex-row md:gap-2'>
                        {statisticCard?.map((card, index) => (
                            <div key={index}
                                id='statistic-card'
                                className={`flex flex-col items-left justify-center w-full md:w-1/3 gap-4 p-8 md:min-h-[300px] ${getCardGradientClass(index)}`}>
                                <h3 className='stat-category text-left text-subdesktop text-white md:text-subdesktop'>{card.statCategory}</h3>
                                <p className='stat-number text-left text-h2-desktop font-bold text-white drop-shadow-md md:text-h2-desktop'>{card.statNumber}</p>
                            </div>
                        ))}
                    </div>
                </div>
        </section>
    )
}   

export default Stats;
