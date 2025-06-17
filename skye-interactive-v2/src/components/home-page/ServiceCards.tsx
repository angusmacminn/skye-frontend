'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import './ServiceCards.css'

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

interface HomePageAcfData {
    servicesHeading?: string;
    serviceCard?: ServiceCardData[];
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
gsap.registerPlugin(ScrollTrigger)

function ServiceCards() {
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

    // SERVICES ANIMATIONS
    useEffect(() => {
        if (!serviceCard || serviceCard.length === 0) return;

        // Copy the ref value to a variable at the start of the effect
        const currentServiceCards = serviceCardsRef.current;
        
        // Store event listeners for proper cleanup
        const eventListeners = new Map();

        // Check if device is mobile
        const isMobile = () => {
            return window.innerWidth <= 768 || 'ontouchstart' in window;
        };

        // Delay to ensure Works section ScrollTriggers are set up first
        const initServicesAnimations = () => {
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

                // Setup animations based on device type - ONLY for mobile now
                if (isMobile()) {
                    currentServiceCards.forEach((card) => {
                        if (!card) return;
                        const listItems = card.querySelectorAll('.service-item');
                        const serviceList = card.querySelector('.service-list');

                        // Set initial state for list items (hidden) on mobile
                        if (serviceList) {
                            gsap.set(serviceList, {
                                opacity: 0,
                                height: 0,
                                overflow: "hidden"
                            });
                        }

                        gsap.set(card, {
                            backgroundColor: "#000",
                        })

                        if (listItems.length > 0) {
                            gsap.set(listItems, {
                                opacity: 0,
                                y: 20,
                                scale: 0.9
                            });
                        }

                        // MOBILE: Use ScrollTrigger
                        ScrollTrigger.create({
                            trigger: card,
                            start: "top 70%",
                            end: "bottom 30%",
                            markers: false,
                            refreshPriority: -1,
                            onEnter: () => {
                                // Show list container first
                                if (serviceList) {
                                    gsap.to(serviceList, {
                                        opacity: 1,
                                        height: "auto", 
                                        duration: 0.4,
                                        ease: "power2.inOut"
                                    });

                                    gsap.to(card, {
                                        backgroundColor: "#EF4444",
                                        duration: 0.6,
                                        ease: "power2.inOut"
                                    })
                                }

                                // Then animate list items with stagger
                                if (listItems.length > 0) {
                                    gsap.to(listItems, {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        duration: 0.3,
                                        stagger: 0.1,
                                        ease: "power2.inOut",
                                        delay: 0.2
                                    });
                                }
                            },
                        });
                    });
                }
                // Desktop hover animations are now handled by CSS
            }

            // Force ScrollTrigger to recalculate positions after Works section is set up
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        };

        // Wait for the Works section to initialize its ScrollTriggers first
        setTimeout(initServicesAnimations, 1000);

        // Cleanup function - properly remove event listeners
        return () => {
            currentServiceCards.forEach((card) => {
                if (card && eventListeners.has(card)) {
                    const { hoverEnter, hoverLeave } = eventListeners.get(card);
                    card.removeEventListener('mouseenter', hoverEnter);
                    card.removeEventListener('mouseleave', hoverLeave);
                }
            });
            eventListeners.clear();
        };

    }, [serviceCard]); // Updated dependency array

    // Move the conditional returns after all hooks
    if (loading) return null;
    if (error) {
        console.error("GraphQL Error:", error);
        return <p className="p-8 text-center text-red-500">Error loading service data. Check console.</p>;
    }

    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Services content not found. Check ACF and query.</p>;
    } 

    return (
        <section id='services-section'
                 className='bg-black py-16'>
            <div id='services-container'
                 className='flex flex-col items-center gap-4 w-full max-w-lg md:max-w-6xl mx-auto px-[20px]'>
                <h2 className='text-center text-4xl text-white'>{servicesHeading}</h2>
                
                <div className='services-cards-container flex flex-col md:flex-row items-center md:items-stretch gap-4 w-full'>
                    {serviceCard?.map((card, index) => (
                        <div key={index} ref={(el) => {
                                if (el) {
                                    serviceCardsRef.current[index] = el;
                                }
                            }} id='service-card' className='service-card flex flex-col items-center w-full md:w-1/3 gap-4 border-red-400 p-8 min-h-[300px] rounded-br-[0px]'>
                            {/* ANIMATION FILL */}
                            <div className='animated-fill'></div>
                            <div className='card-content flex flex-col items-start w-full gap-8'>
                                {/* VISIBLE CONTENT */}
                                <h3 className='service-title text-left text-2xl text-white'>{card.serviceTitle}</h3>
                                {/* HIDDEN CONTENT */}
                                <div className='hidden-content'>
                                    <ul className='service-list flex flex-col items-start w-full gap-2'>
                                        {card.serviceList?.map((item, itemIndex) => (
                                            <li key={itemIndex} className='service-item text-left text-white'>
                                                {item.serviceItem}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServiceCards;