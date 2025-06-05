'use client'

import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


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

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(SplitText)


export default function Works() {
    const { loading, error, data } = useQuery<GetWorksQueryData>(GET_WORKS_DATA)
    
    const workItems = data?.works?.nodes;

    // Move useEffect BEFORE the early returns
    useEffect(() => {
        if (!workItems || workItems.length === 0) return;

        const worksSection = document.getElementById('works-section');
        const worksGrid = document.getElementById('works-grid');

        if (!worksSection || !worksGrid) return;

        // Wait for images to load and then calculate widths
        const initHorizontalScroll = () => {
            // Get all work cards
            const workCards = worksGrid.querySelectorAll('#work-card');
            
            if (workCards.length === 0) return;

            // Calculate total scroll distance
            // Get the width of container and total content width
            const containerWidth = worksGrid.offsetWidth;
            const totalContentWidth = Array.from(workCards).reduce((total, card) => {
                return total + (card as HTMLElement).offsetWidth + 32; // +32 for gap
            }, 0);
            
            const scrollDistance = totalContentWidth - containerWidth;
            
          

            // Create the horizontal scroll animation
            const horizontalScroll = gsap.to(worksGrid, {
                x: -scrollDistance,
                ease: "none",
                duration: 1
            });

            // Create ScrollTrigger
            ScrollTrigger.create({
                trigger: worksSection,
                start: "top top",
                end: `+=${scrollDistance * 2}`, // Adjust multiplier to control scroll speed
                pin: true,
                scrub: 1, // Smooth scrubbing
                animation: horizontalScroll,
                markers: false, // Remove this in production
                onUpdate: (self) => {
                }
            });
        };

        // Wait for images to load before calculating
        const images = worksGrid.querySelectorAll('img');
        if (images.length > 0) {
            let loadedImages = 0;
            const totalImages = images.length;

            const onImageLoad = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    setTimeout(initHorizontalScroll, 100); // Small delay to ensure layout is complete
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
            // No images, init immediately
            setTimeout(initHorizontalScroll, 100);
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };

    }, [workItems]);

    // Now the conditional returns come AFTER all hooks
    if (loading) return <p>Loading works...</p>;
    if (error) return <p>Error loading works: {error.message}</p>;

    return (
        <section id='works-section'>
            <div id='works-section-content'
                 className='flex flex-col justify-center items-center gap-16 bg-skye-gray h-screen'>
                <h2 className='text-2xl text-skye-white mt-10'>
                    Selected Works
                </h2>

                <div id='works-grid'
                    className='flex flex-row gap-8 w-full px-4 pb-4'
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
                            <div id='work-card'
                                className="work-card rounded-bl-[40px] p-4 flex-shrink-0 w-80 min-w-80 relative"
                                key={workItem?.slug || index}>
                                <div id='work-card-content'
                                    className='flex flex-col gap-4 relative z-10'>
                                    <div className='flex flex-row justify-between items-center'>
                                        
                                      <h3 className="text-2xl text-white">
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
                                            className='text-white border border-white bg-red-400 px-3.5 py-1 rounded-[40px] '
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
        </section>
    )
}

