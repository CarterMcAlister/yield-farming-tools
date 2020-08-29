import { GraphQLClient } from 'graphql-request'

export const graphcms = new GraphQLClient(
  'https://api-us-west-2.graphcms.com/v2/ckd8c303l6v5e01z5c1mccopr/master'
)

export const linkSectionContents = `
    id
    name
    link
    forBeginners
    description {
      text
    }
  `
