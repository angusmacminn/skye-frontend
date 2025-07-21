'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react';
import ThreeScene from '../r3f/ProcessGeometry';
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

const GET_PROCESS_DATA = gql`
    query GetProcessData ($id: ID!, $idType: PageIdType!) {
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

export default function Process() {
    const pageId = '126'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<QueryData>(GET_PROCESS_DATA, {
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

                if (processSection && statisticsSection) {
                    // Set initial state for process section scaled down and positioned off-screen
                    gsap.set(processSection, {
                        y: 100,
                        transformOrigin: "center bottom",
                        position: "relative",
                    })

                    // Create the scroll-jacked animation
                    ScrollTrigger.create({
                        trigger: statisticsSection,
                        start: "bottom 65%", // When bottom of stats section hits bottom of viewport
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
                                start: "top 95%",       // When element enters viewport
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
        return <p className="p-8 text-center text-red-500">Error loading process data. Check console.</p>;
    }

    // defensive checks
    if (!acfData && !loading) {
        return <p className="p-8 text-center">Process content not found. Check ACF and query.</p>;
    } 

    return (
        <section id='process-section' className='bg-skye-white py-16'>
            <div id='process-container' className='flex flex-col items-center gap-10 md:gap-32 mt-10 w-full max-w-6xl mx-auto px-4'>
                <h3 className='process-heading text-center text-h3-mobile sticky top-20 font-bold md:text-h3-desktop'>{processHeading}</h3>

                <div id='process-row' className='process-row flex flex-col md:flex-row items-center gap-8 '>
                    <div className='steps-container sticky top-20 flex flex-col items-left gap-4 w-full md:w-1/2'>
                        {processSteps?.map((step, index) => (
                            <div key={index}
                                 id={`process-step-${index}`}
                                 className='flex flex-col items-left h-[20vh] md:h-[40vh] gap-4'>
                                <div className='step-heading flex flex-row-reverse gap-4 items-center justify-between w-full'>
                                    <h3 className='text-left text-skye-primary-red text-submobile font-bold md:text-subdesktop'>{step.processNumber}</h3>
                                    <h3 className='text-left text-skye-primary-red text-submobile font-bold md:text-subdesktop'>{step.stepHeading}</h3>
                                </div>
                                <p className='text-left text-p-mobile md:text-p-desktop'>{step.stepDescription}</p>
                            </div>
                        ))}
                    </div> 

                    <div className='three-scene-container self-start md:h-auto w-full md:w-1/2'>
                        <ThreeScene />
                        </div>
                </div>
            </div>
        </section>
    )
}