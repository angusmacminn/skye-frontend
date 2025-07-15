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
       * @param {MouseEvent} e The mouse event containing cursor coordinates
       * @param {HTMLElement} element The card element we're hovering over
       * @returns {number} Direction code: 0=top, 1=right, 2=bottom, 3=left
       */
        
        // directional hover effect
        const getDirection = (e: MouseEvent, element: HTMLElement): number => {
          
          // Calculate mouse position RELATIVE to the element (not the viewport)
          // e.clientX/Y gives viewport coordinates, rect.left/top gives element position
          const rect = element.getBoundingClientRect()
          const x = e.clientX - rect.left; // mouse x position inside the element
          const y = e.clientY - rect.top; // mouse y position inside the element
            
          // get element dimensions
          const w = element.offsetWidth;
          const h = element.offsetHeight;
          
          // calculate distance from mouse to each edge
          // these represent how far the mouse is from each edge
          const top = y;           // Distance from top edge
          const bottom = h - y;    // Distance from bottom edge  
          const left = x;          // Distance from left edge
          const right = w - x;     // Distance from right edge
  
          // Find the smallest distance - this tells us which edge is closest
          const min = Math.min(top, bottom, left, right);
  
           // Return direction code based on which edge had the minimum distance
          switch(min){
            case top: return 0; // Top
            case right: return 1; // right
            case bottom: return 2; // bottom
            case left: return 3; // left
            default: return 0; 
          }
        }
  
        // Initialize the directional hover effect for all service cards
        const initDirectionalHover = () => {
            
            const cards = document.querySelectorAll('.service-card')
            
            // Store handlers so cleanup can access them
            const cardHandlers = new Map();
      
            // setup effect for each card
            cards.forEach((card, index) => {
              // find empty div for animated fill
              const fill = card.querySelector('.animated-fill') as HTMLElement;
              
              // Skip if fill element doesn't exist (safety check)
              if (!fill) {
                console.log(`No fill element found for card ${index}`);
                return;
              }

              /**
              * SETUP PHASE: Configure the fill element's initial styles
              * The fill element needs to be absolutely positioned and cover the entire card
              * Initially positioned OUTSIDE the card (translateY(-100%)) so it's invisible*/
              fill.style.position = 'absolute';
              fill.style.top = '0';
              fill.style.left = '0';
              fill.style.width = '100%';
              fill.style.height = '100%';
              fill.style.backgroundColor = '#EF4444'; 
              fill.style.zIndex = '1';
              fill.style.transform = 'translateY(-100%)';
        
              /**
                 * MOUSE ENTER HANDLER: Animates fill sliding IN from entry direction
                 * This is where the magic happens!
                 */
              const handleMouseEnter = (e: MouseEvent) => {
                console.log('Mouse enter on card', index); // Debug log
                const direction = getDirection(e, card as HTMLElement)
                console.log('Entry direction:', direction); // Debug log
      
                // remove transition to instantly position fill
                fill.style.transition = 'none'
      
                  /**
                     * POSITIONING PHASE: Place fill element outside the card 
                     * based on entry direction so it can slide in
                     */
                  switch(direction) {
                    case 0: // Entered from TOP - position fill above the card
                        fill.style.transform = 'translateY(-100%)';
                        break;
  
                    case 1: // Entered from RIGHT - position fill to the right
                        fill.style.transform = 'translateX(100%)'
                        break;
        
                    case 2: // Entered from BOTTOM - position fill below the card
                        fill.style.transform = 'translateY(100%)';
                        break;
  
                    case 3: // Entered from LEFT - position fill to the left
                        fill.style.transform = 'translateX(-100%)';
                        break;
                }
                /**
                     * ANIMATION PHASE: Slide the fill INTO the card
                     * Use requestAnimationFrame to ensure the positioning happens first
                     * then animate smoothly to cover the entire card
                     */
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
  
        // CLEANUP: Remove event listeners when component unmounts
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
                 className='bg-black py-24'>
            <div id='services-container'
                 className='mx-auto px-[10px] flex flex-col items-center gap-16 w-full max-w-6xl'>
                <h3 className='text-center text-h3-mobile text-white md:text-h3-desktop'>{servicesHeading}</h3>
                
                <div className='services-cards-container flex flex-col md:flex-row items-center md:items-stretch gap-2 w-full max-w-full'>
                    {serviceCard?.map((card, index) => (
                        <div key={index} 
                             ref={(el) => {
                                if (el) {
                                    serviceCardsRef.current[index] = el;
                                }
                             }} 
                             id='service-card' 
                             className='service-card items-center w-full md:w-1/3 gap-2 border-red-400 min-h-[400px] rounded-br-[0px] overflow-hidden relative'>
                            {/* ANIMATION FILL */}
                            <div className='animated-fill'></div>
                            <div className='card-content w-full gap-8 relative z-10 p-6'>
                                {/* VISIBLE CONTENT */}
                                <h3 className='service-title text-left text-submobile text-white md:text-subdesktop'>{card.serviceTitle}</h3>
                                {/* HIDDEN CONTENT */}
                                <div className='hidden-content absolute inset-6 top-16'>
                                    <ul className='service-list flex flex-col items-start w-full gap-2 py-4'>
                                        {card.serviceList?.map((item, itemIndex) => (
                                            <li key={itemIndex} className='service-item text-left text-white text-p-mobile md:text-p-desktop'>
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