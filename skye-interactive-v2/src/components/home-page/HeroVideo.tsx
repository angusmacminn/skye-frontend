'use client'

import {gql, useQuery} from '@apollo/client'
import gsap from 'gsap'
import { useEffect } from 'react';

const GET_VIDEO_DATA = gql`
    query GetVideoData ($id: ID! $idType: PageIdType!) {
        page(id: $id, idType: $idType) {
            id # ID of the page
            title # Title of the page

            homePage {
                heroVideoUrl {
                    node {
                        mediaItemUrl
                        mimeType
                    }
                }
            }
        }
    }
`
// interface for video media item
interface MediaItem {
    mediaItemUrl: string;
    mimeType: string;
}
// interface for hero video url
interface HeroVideoUrl {
    node: MediaItem
}
// interface for homepage data
interface HomePage {
    heroVideoUrl: HeroVideoUrl
}
// interface for the page data
interface PageData {
    id: string;
    title: string;
    homePage: HomePage;
}

interface GetVideoDataResponse {
    page: PageData;
}

export default function HeroVideo(){
    const pageId = '126'
    const pageIdType = 'DATABASE_ID'

    const { loading, error, data } = useQuery<GetVideoDataResponse>(GET_VIDEO_DATA, {
        variables: {
            id: pageId,
            idType: pageIdType
        }
    });

    const videoUrl = data?.page.homePage.heroVideoUrl.node.mediaItemUrl
    const mimeType = data?.page.homePage.heroVideoUrl.node.mimeType



    return (
        <>
            <video
            src={videoUrl}
            muted={true}
            autoPlay={true}
            playsInline={true}
            loop={true}
            preload='auto'
            className="w-full h-1/3 object-cover rounded-[40px]"
            id='hero-video'
        >
            Your browser does not support the video tag.
        </video>
        </>
    )
}