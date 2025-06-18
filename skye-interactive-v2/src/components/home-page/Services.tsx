'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react';
import ThreeScene from '../r3f/ProcessGeometry';
import ServiceCards from './ServiceCards';
import Stats from './Stats';
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

interface ProcessStepData {
    processNumber?: string;
    stepHeading?: string;
    stepDescription?: string;
}

interface HomePageAcfData {
    processHeading?: string;
    processSteps?: ProcessStepData[];
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
    const processHeading = acfData?.processHeading
    const processSteps = acfData?.processSteps

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
                        start: "bottom 50%", // When bottom of stats section hits bottom of viewport
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
                        onEnter: () => {
                            // Change body background to black when pinning starts
                            document.body.style.backgroundColor = '#000000';
                        },
                        onLeave: () => {
                            // Restore original body background when pinning ends
                            document.body.style.backgroundColor = 'var(--background)';
                        },
                        onEnterBack: () => {
                            // Change body background to black when scrolling back
                            document.body.style.backgroundColor = '#000000';
                        },
                        onLeaveBack: () => {
                            // Restore original body background when leaving back
                            document.body.style.backgroundColor = 'var(--background)';
                        }
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
            <Stats />

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

