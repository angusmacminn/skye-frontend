'use client'

import { gql, useQuery } from '@apollo/client'


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


export default function Works() {
    const { loading, error, data } = useQuery<GetWorksQueryData>(GET_WORKS_DATA)

    if (loading) return <p>Loading works...</p>;
    if (error) return <p>Error loading works: {error.message}</p>;

    const workItems = data?.works?.nodes;

    return (
        <section id='works-section'>
            <div id='works-section-content'
                 className='flex flex-col items-center justify-center gap-4 mt-10'>
                <h2 className='text-lg'>
                    Works
                </h2>

                <div id='works-grid'
                    className='flex flex-row gap-8 overflow-x-auto overflow-y-hidden w-full px-4 pb-4 scrollbar-hide'
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
                                className="rounded-bl-[40px] p-4 flex-shrink-0 w-80 min-w-80"
                                style={{
                                    background: 'linear-gradient(310deg, #F87171 5.38%, #EF4444 100%)'
                                }}
                                key={workItem?.slug || index}>
                                <div id='work-card-content'
                                    className='flex flex-col gap-4'>
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

