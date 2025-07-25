'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/app/lib/gsapConfig'

// Get works from graphQL
const GET_WORKS_DATA = gql`
    query GetWorksData {
        works {
      nodes {
      title
      slug
      workCategories {
        nodes {
          name
        }
      }
      workAcf {
        thumbnailImage {
          node {
            sourceUrl
            altText
          }
        }
            }
        }
    }
}
`
// define interface so typescript knows exactly what data is coming in 
interface WorkCategoryNode {
  name?: string;
}

interface WorkCategoryConnection {
  nodes?: WorkCategoryNode[];
}

interface ImageNode {
  sourceUrl?: string;
  altText?: string;
}

interface AcfImageField {
  node?: ImageNode;
}

interface WorkAcfData {
  thumbnailImage?: AcfImageField;
  // Add other ACF fields for a "Work" here
}

interface WorkNode {
  title?: string;
  slug?: string;
  workCategories?: WorkCategoryConnection;
  workAcf?: WorkAcfData;
  // Add other Work fields like id, date, content if needed
}

interface WorksConnection {
  nodes?: WorkNode[];
  // pageInfo?: PageInfo; // If using pagination
}

interface GetWorksQueryData {
  works?: WorksConnection;
}






export default function Works() {
    const [isVisible, setIsVisible] = useState(false)


    // 1. Your GraphQL query returns data matching GetWorksQueryData
    const { loading, error, data } = useQuery<GetWorksQueryData>(GET_WORKS_DATA)
    
    // 2. You can safely access nested properties
    const workItems = data?.works?.nodes;

    // Add this useEffect for the opacity delay
    useEffect(() => {
        // Only show after data is loaded
        if (workItems && workItems.length > 0) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 300) // Adjust timing as needed
            
            return () => clearTimeout(timer)
        }
    }, [workItems])

    // Move useEffect BEFORE the early returns
    useEffect(() => {
        if (!workItems || workItems.length === 0) return;

        const worksSection = document.getElementById('works-section');
        const worksGrid = document.getElementById('works-grid');
        const worksGridContainer = document.getElementById('works-grid-container');

        if (!worksSection || !worksGrid || !worksGridContainer) return;

        // Use GSAP's matchMedia for responsive animations
        const mm = gsap.matchMedia();

        // Setup for smaller screens (horizontal scroll)
        mm.add("(max-width: 768px)", () => {
            // This code will only run on screens smaller than 1024px
            const initHorizontalScroll = () => {
                // Ensure content actually overflows before creating the animation
                const scrollDistance = worksGrid.scrollWidth - worksGridContainer.offsetWidth;

                if (scrollDistance <= 0) {
                    return; // Content fits, no scroll needed
                }

                // Check if user prefers reduced motion
                if (prefersReducedMotion()) {
                    // Use native CSS scroll behavior instead of GSAP
                    worksGridContainer.style.overflowX = 'auto';
                    worksGridContainer.style.scrollSnapType = 'x mandatory';
                    worksGridContainer.style.scrollBehavior = 'smooth';
                    
                    // Apply scroll-snap-align to each work card
                    const workCards = worksGrid.querySelectorAll('.work-card');
                    workCards.forEach((card: Element) => {
                        (card as HTMLElement).style.scrollSnapAlign = 'start';
                    });
                    
                    return;
                }
                // Use GSAP for users who don't mind motion
                const horizontalScroll = gsap.to(worksGrid, {
                    x: -scrollDistance,
                    ease: "none",
                });

                ScrollTrigger.create({
                    trigger: worksSection,
                    start: "top top",
                    end: () => `+=${scrollDistance}`, // Scroll for the exact overflow amount
                    pin: true,
                    scrub: 1,
                    animation: horizontalScroll,
                    invalidateOnRefresh: true, // Recalculate on viewport resize
                });
            };

            const images = worksGrid.querySelectorAll('img');
            if (images.length > 0) {
                let loadedImages = 0;
                const totalImages = images.length;

                const onImageLoad = () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        setTimeout(initHorizontalScroll, 100);
                    }
                };

                images.forEach(img => {
                    if (img.complete) {
                        onImageLoad();
                    } else {
                        img.addEventListener('load', onImageLoad);
                    }
                });
            } else {
                setTimeout(initHorizontalScroll, 100);
            }

            // Cleanup function for this media query
            return () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                gsap.set(worksGrid, { clearProps: "x" }); // Reset GSAP inline styles
            };
        });

        // For larger screens, we do nothing here, letting CSS handle the layout.
        // The cleanup function will be called when the component unmounts
        return () => {
            mm.revert();
        };

    }, [workItems]);

    // Now the conditional returns come AFTER all hooks
    if (loading) return 
    if (error) return <p>Error loading works: {error.message}</p>;

    return (
        <section id='works-section' 
                 className={`md:max-w-screen-2xl md:mx-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} overflow-x-hidden`}>
            <div id='works-section-content'
                 className='flex flex-col justify-center items-center gap-16 bg-skye-gray mt-32 md:h-auto md:py-24 relative overflow-x-hidden'>
                <h3 className='text-h3-mobile text-skye-white md:text-h3-desktop'>
                    Selected Works
                </h3>

                <div id='works-grid-container' 
                     className='w-full overflow-x-hidden relative'>
                    <div id='works-grid'
                        className='flex flex-row md:justify-center gap-8 w-full px-4 pb-4'
                        style={{
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE and Edge
                        }}
                    >
                        {workItems && workItems.map((workItem, index) => {
                            const currentThumbnailUrl = workItem?.workAcf?.thumbnailImage?.node?.sourceUrl;
                            const currentThumbnailAlt = workItem?.workAcf?.thumbnailImage?.node?.altText;
                            const currentTitle = workItem?.title;

                            return (
                                <div
                                    className="work-card rounded-bl-[40px] p-4 flex-shrink-0 w-80 min-w-80 relative md:w-1/4 md:flex-shrink-0"
                                    key={workItem?.slug || index}>
                                    <div id='work-card-content'
                                        className='flex flex-col gap-4 relative z-10'>
                                        <div className='flex flex-row justify-between items-center'>
                                            
                                          <h3 className="text-h3-mobile text-white md:text-subdesktop">
                                            {currentTitle || 'Untitled Work'}
                                          </h3>

                                          <img 
                                          src="/assets/icons/project-arrow.svg" 
                                          alt='Project Arrow' 
                                          className='w-4 h-4'
                                          />
                                        </div>

                                        <div id='work-categories'
                                        className='flex flex-row gap-2'>
                                            {workItem?.workCategories?.nodes?.map((category: WorkCategoryNode) => (
                                                <p 
                                                className='text-white text-body-mobile border border-white bg-red-400 px-3.5 py-1 rounded-[40px] md:text-body-desktop '
                                                key={category.name}>{category.name}</p>
                                            ))}
                                        </div>

                                        <div id='work-thumbnail'
                                            className='w-full h-full'>
                                                {currentThumbnailUrl && (
                                                    <img className='rounded-bl-[40px] w-full object-cover'
                                                        src={currentThumbnailUrl} 
                                                        alt={currentThumbnailAlt || currentTitle || 'Work thumbnail'} 
                                                    />
                                                )}
                                            {!currentThumbnailUrl && <p>No thumbnail available.</p>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {!workItems && !loading && <p>No works found.</p>}
                    </div>
                </div>

            </div>
        </section>
    )
}

