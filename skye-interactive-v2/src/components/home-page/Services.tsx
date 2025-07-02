'use client'


import ServiceCards from './ServiceCards';
import Stats from './Stats';
import Process from './Process';
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

// Register plugins
gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(TextPlugin)
gsap.registerPlugin(ScrambleTextPlugin) 

function Services() {
    return (
        <>
            <ServiceCards />
            <Stats />
            <Process />
        </>
    )
}   

export default Services;

