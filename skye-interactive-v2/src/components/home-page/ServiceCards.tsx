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

        // directional hover effect
    useEffect(() => {
        // Check if device is mobile - only apply on desktop
        const isMobile = () => {
            return window.innerWidth <= 768 || 'ontouchstart' in window;
        };

        // Only run on desktop
        if (isMobile()) return;

        // Wait for serviceCard data to be available
        if (!serviceCard || serviceCard.length === 0) return;

        /**
       * Calculates which edge of an element the mouse is closest to.
       * @param {MouseEvent} e The mouse event.
       * @param {HTMLElement} element The element being interacted with.
       * @returns {number} 0 for top, 1 for right, 2 for bottom, 3 for left.
       */
  
        const getDirection = (e: MouseEvent, element: HTMLElement): number => {
          const rect = element.getBoundingClientRect()
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
    
          const w = element.offsetWidth;
          const h = element.offsetHeight;
    
          const top = y;
          const bottom = h - y;
          const left = x;
          const right = w - x;
  
          const min = Math.min(top, bottom, left, right);
  
          switch(min){
            case top: return 0; // Top
            case right: return 1; // right
            case bottom: return 2; // bottom
            case left: return 3; // left
            default: return 0; 
          }
        }
  
        // Wait for DOM to be ready and use a longer delay
        const initDirectionalHover = () => {
            console.log('Initializing directional hover effect'); // Debug log
            
            const cards = document.querySelectorAll('.service-card')
            console.log('Found cards:', cards.length); // Debug log
            
            // ✅ Store handlers so cleanup can access them
            const cardHandlers = new Map();
      
            cards.forEach((card, index) => {
              const fill = card.querySelector('.animated-fill') as HTMLElement;
              console.log(`Card ${index} fill element:`, fill); // Debug log
              
              // Skip if fill element doesn't exist
              if (!fill) {
                console.log(`No fill element found for card ${index}`);
                return;
              }

              // Set initial styles to ensure the fill is properly positioned
              fill.style.position = 'absolute';
              fill.style.top = '0';
              fill.style.left = '0';
              fill.style.width = '100%';
              fill.style.height = '100%';
              fill.style.backgroundColor = '#EF4444'; // Use direct color instead of CSS variable
              fill.style.zIndex = '1';
              fill.style.transform = 'translateY(-100%)';
        
              const handleMouseEnter = (e: MouseEvent) => {
                console.log('Mouse enter on card', index); // Debug log
                const direction = getDirection(e, card as HTMLElement)
                console.log('Entry direction:', direction); // Debug log
      
                // remove transition to instantly position fill
                fill.style.transition = 'none'
      
                // position fill based on entry direction
                switch(direction) {
                  case 0: //top
                    fill.style.transform = 'translateY(-100%)';
                    break;
      
                  case 1: // right
                    fill.style.transform = 'translateX(100%)'
                    break;
            
                  case 2: // Bottom
                    fill.style.transform = 'translateY(100%)';
                    break;
      
                  case 3: // Left
                    fill.style.transform = 'translateX(-100%)';
                    break;
                }
                // animate to center
                requestAnimationFrame(() => {
                  fill.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  fill.style.transform = 'translate(0,0)'
                });
              };
      
              const handleMouseLeave = (e: MouseEvent) => {
                console.log('Mouse leave on card', index); // Debug log
                const direction = getDirection(e, card as HTMLElement)
                console.log('Exit direction:', direction); // Debug log
      
                // Animate out in exit direction
                switch (direction) {
                  case 0: // Top
                    fill.style.transform = 'translateY(-100%)';
                    break;
                  case 1: // Right
                    fill.style.transform = 'translateX(100%)';
                    break;
                  case 2: // Bottom
                    fill.style.transform = 'translateY(100%)';
                    break;
                  case 3: // Left
                    fill.style.transform = 'translateX(-100%)';
                    break;
                }
              };
      
              // ✅ Store handlers for cleanup
              cardHandlers.set(card, { handleMouseEnter, handleMouseLeave });
      
              card.addEventListener('mouseenter', handleMouseEnter as EventListener)
              card.addEventListener('mouseleave', handleMouseLeave as EventListener)
              
              console.log(`Event listeners added to card ${index}`); // Debug log
            })
            
            return cardHandlers;
        };

        // Initialize with a longer delay to ensure everything is rendered
        const timer = setTimeout(() => {
            const cardHandlers = initDirectionalHover();
            
            // Store the handlers for cleanup
            (window as any).directionalHoverHandlers = cardHandlers;
        }, 1500); // Increased delay
  
        // ✅ Fixed cleanup function
        return () => {
          clearTimeout(timer);
          const cardHandlers = (window as any).directionalHoverHandlers;
          if (cardHandlers) {
            cardHandlers.forEach((handlers: any, card: Element) => {
              card.removeEventListener('mouseenter', handlers.handleMouseEnter as EventListener)
              card.removeEventListener('mouseleave', handlers.handleMouseLeave as EventListener)
            })
            delete (window as any).directionalHoverHandlers;
          }
        }
  
      }, [serviceCard]) // Add serviceCard as dependency

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
                            }} id='service-card' className='service-card flex flex-col items-center w-full md:w-1/3 gap-4 border-red-400 p-8 min-h-[400px] rounded-br-[0px]'>
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