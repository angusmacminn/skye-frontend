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
            sourceUrl(size: THUMBNAIL)
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
                    className='flex flex-col gap-2'>
                    {workItems && workItems.map((workItem, index) => {
                        const currentThumbnailUrl = workItem?.workAcf?.thumbnailImage?.node?.sourceUrl;
                        const currentThumbnailAlt = workItem?.workAcf?.thumbnailImage?.node?.altText;
                        const currentTitle = workItem?.title;

                        return (
                            <div id='work-card'
                                className=" border p-4"
                                key={workItem?.slug || index}>
                                <div id='work-card-content'
                                    className='flex flex-col gap-2'>
                                    <h3 className="text-xl">{currentTitle || 'Untitled Work'}</h3>

                                    <div id='work-categories'
                                    className='flex flex-row gap-2'>
                                        {workItem?.workCategories?.nodes?.map((category: WorkCategoryNode) => (
                                            <p key={category.name}>{category.name}</p>
                                        ))}
                                    </div>

                                    <div id='work-thumbnail'
                                        className='w-full h-full'>
                                            {currentThumbnailUrl && (
                                                <img 
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

