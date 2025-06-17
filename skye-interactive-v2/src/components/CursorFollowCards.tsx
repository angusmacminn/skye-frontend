'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CardData {
    title: string;
    description: string;
    items: string[];
}

const CursorFollowCards = () => {
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const cursorFollowerRef = useRef<HTMLDivElement | null>(null);
    const cardsContainerRef = useRef<HTMLDivElement | null>(null);

    // Sample card data
    const cardsData: CardData[] = [
        {
            title: "Design",
            description: "Creative solutions that inspire",
            items: ["UI/UX Design", "Brand Identity", "Visual Design", "Prototyping"]
        },
        {
            title: "Development",
            description: "Building digital experiences",
            items: ["Frontend Development", "Backend Systems", "Mobile Apps", "Web Applications"]
        },
        {
            title: "Strategy",
            description: "Data-driven insights",
            items: ["Market Research", "User Research", "Analytics", "Performance Optimization"]
        }
    ];

    // Cursor follow effect
    useEffect(() => {
        const isMobile = () => {
            return window.innerWidth <= 768 || 'ontouchstart' in window;
        };

        if (!isMobile()) {
            const cardsContainer = cardsContainerRef.current;
            const follower = cursorFollowerRef.current;
            const cards = cardsRef.current.filter(Boolean);

            if (cardsContainer && follower && cards.length > 0) {
                // Initially hide the follower
                gsap.set(follower, {
                    opacity: 0,
                    scale: 1
                });

                cards.forEach((card, index) => {
                    if (!card) return;

                    card.addEventListener('mouseenter', () => {
                        const cardRect = card.getBoundingClientRect();
                        const containerRect = cardsContainer.getBoundingClientRect();
                        
                        // Calculate position relative to container
                        const left = cardRect.left - containerRect.left;
                        const top = cardRect.top - containerRect.top;
                        
                        gsap.to(follower, {
                            left: left,
                            top: top,
                            width: cardRect.width,
                            height: cardRect.height,
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    });
                });

                // Hide follower when leaving the container
                cardsContainer.addEventListener('mouseleave', () => {
                    gsap.to(follower, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }
        }
    }, []);

    return (
        <section className='bg-black py-16'>
            <div className='flex flex-col items-center gap-4 w-full max-w-6xl mx-auto px-[20px]'>
                <h2 className='text-center text-4xl text-white mb-8'>Cursor Follow Effect Demo</h2>
                
                <div 
                    ref={cardsContainerRef}
                    className='services-cards-container flex flex-col md:flex-row items-center md:items-stretch gap-4 w-full relative'
                >
                    {/* Cursor follower element */}
                    <div 
                        ref={cursorFollowerRef}
                        className='cursor-follower absolute pointer-events-none z-10 rounded-br-[0px] border border-red-400 bg-red-400/10 backdrop-blur-sm'
                    />
                    
                    {cardsData.map((card, index) => (
                        <div 
                            key={index}
                            ref={(el) => {
                                if (el) {
                                    cardsRef.current[index] = el;
                                }
                            }}
                            className='service-card flex flex-col items-center w-full md:w-1/3 gap-4 border-red-400 border p-8 min-h-[300px] rounded-br-[0px] hover:border-red-300 transition-colors duration-300'
                        >
                            <div className='flex flex-col items-start w-full gap-8'>
                                <h3 className='text-left text-2xl text-white font-bold'>{card.title}</h3>
                                <p className='text-left text-white/80'>{card.description}</p>
                                <ul className='flex flex-col items-start w-full gap-2'>
                                    {card.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className='text-left text-white/70 text-sm'>
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CursorFollowCards; 