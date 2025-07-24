'use client'

import {gql, useQuery} from '@apollo/client'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { prefersReducedMotion } from '@/app/lib/gsapConfig'



const GET_STUDIO_ABOUT_DATA = gql`
    query getStudioAboutData($id:ID!, $idType: PageIdType!){
        page(id: $id, idType: $idType) {
            id # ID of the page
            title # Title of the page
            
            studioPage {
                aboutImage1 {
                    node {
                        sourceUrl
                        altText
                    }
                }
                aboutIntroHeading
                aboutIntroParagraph
                aboutIntroParagraph2
            }
        }
    }
`

interface aboutImageNode {
    sourceUrl?: string
    altText?: string
}

interface aboutImage {
    node?: aboutImageNode
}

interface studioAboutPageAcfData {
    aboutIntroParagraph?: string
    aboutIntroHeading?: string
    aboutImage1?: aboutImage
    aboutIntroParagraph2?: string
}

interface PageData {
    id?: string
    title?: string
    studioPage?: studioAboutPageAcfData
}

interface QueryData {
    page?: PageData
}


export default function StudioAbout(){
    const pageId = 8
    const pageIdType = 'DATABASE_ID'

    const { data } = useQuery<QueryData>(GET_STUDIO_ABOUT_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    })

    // define variavbles for data
    const acfData = data?.page?.studioPage
    const aboutImage = acfData?.aboutImage1
    const aboutImageUrl = aboutImage?.node?.sourceUrl
    const aboutImageAlt = aboutImage?.node?.altText
    const aboutHeading = acfData?.aboutIntroHeading
    const aboutParagraph = acfData?.aboutIntroParagraph
    const aboutParagraph2 = acfData?.aboutIntroParagraph2


    // Animation refs
    const containerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!acfData) return; // Wait for data to load

        if (prefersReducedMotion()) {
            gsap.set([contentRef.current, imageRef.current, textRef.current], {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
            })
            return;
        }

        // Set initial states
        gsap.set([contentRef.current, imageRef.current, textRef.current], {
            opacity: 0,
            y: 50,
        });

        // Create timeline
        const tl = gsap.timeline({
            delay: 2.5, // Small delay before starting
        });

        // Animate in sequence
        tl.to(contentRef.current, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
        })
        .to(imageRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
        }, "-=0.3") // Start 0.3s before previous ends
        .to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
        }, "-=0.5"); // Start 0.5s before previous ends

    }, { 
        scope: containerRef, 
        dependencies: [acfData] // Re-run when data loads
    });

    return(
        <section ref={containerRef} className='about-section py-[10px] md:max-w-screen-2xl md:mx-auto md:py-10'>
            <div ref={contentRef} className='about-content mx-[10px] flex flex-col gap-16 md:flex-row md:justify-between md:items-start'>
                <div ref={imageRef} className='about-image'>
                    <img className='max-w-[300px] mx-auto object-cover rounded-tl-[40px] md:max-w-[500px]' src={aboutImageUrl} alt={aboutImageAlt} />
                </div>
                <div ref={textRef} className='about-text flex flex-col justify-center gap-2 max-w-[500px] mx-auto md:gap-8 md:max-w-[800px]'>
                    <h3 className='text-white text-h3-mobile md:text-h3-desktop'>
                        {acfData && aboutHeading}
                    </h3>
                    
                    <p className='text-white text-p-mobile md:text-p-desktop'>
                        {acfData && aboutParagraph}
                    </p>

                    <p className='text-white text-p-mobile md:text-p-desktop'>
                        {acfData && aboutParagraph2}
                    </p>
                </div>
            </div>
        </section>
    )
}