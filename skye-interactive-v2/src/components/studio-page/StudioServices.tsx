'use client'

import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_STUDIO_SERVICES_DATA = gql`
    query getStudioServicesData($id:ID!, $idType: PageIdType!){
        page(id: $id, idType: $idType) {
            id #ID of the page
            title #Title of the page
        }
    }
`






