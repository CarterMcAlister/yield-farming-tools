import Head from 'next/head'
import { useEffect } from 'react'
import { Box, Grid, Heading, Text } from '@chakra-ui/core'
import { GraphQLClient } from 'graphql-request'
import Wrapper from '../components/Wrapper'
import { useAnalytics } from '../hooks/useAnalytics'
import { ResourceCard } from '../components/ResourceCard'
import { Card } from '../components/Card'
import { getPoolData } from './utils/pool-data'

export const getStaticProps = async () => {
  const graphcms = new GraphQLClient(
    'https://api-us-west-2.graphcms.com/v2/ckd8c303l6v5e01z5c1mccopr/master'
  )

  const linkSectionContents = `
    id
    name
    link
    forBeginners
    description {
      text
    }
    
  `

  const sectionData = await graphcms.request(
    `
    {
      tradingSection: infoLinks(where: {section: decentralized_trading}) {
        ${linkSectionContents}
      }
      walletSection: infoLinks(where: {section: wallets}) {
        ${linkSectionContents}
      }
      farmingSection: infoLinks(where: {section: yield_farming}) {
        ${linkSectionContents}
      }
      utilitySection: infoLinks(where: {section: utilities}) {
        ${linkSectionContents}
      }
    }
    `
  )

  return {
    props: sectionData,
  }
}

export default function Home({
  tradingSection,
  walletSection,
  farmingSection,
  utilitySection,
}) {
  const { init, trackPageViewed } = useAnalytics()
  useEffect(() => {
    init('UA-156207639-2')
    trackPageViewed()
    // getPoolData()
  }, [])
  return (
    <Wrapper>
      <SEO />
      <Card>
        <Heading as="h1" size="xl">
          <Box display={{ xs: 'block', md: 'inline' }}>🧑‍🌾 </Box>
          Yield Farming Tools
        </Heading>
        <Text pl={{ xs: 0, md: 12 }} fontSize="md" color="gray.600">
          Starter guide and strategies coming soon.
        </Text>
      </Card>
      <PoolsList />

      <Grid templateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
        <ResourceCard
          title="🚜 Yield Farming"
          sectionContent={farmingSection}
        />
        <ResourceCard title="🧰 Utilities" sectionContent={utilitySection} />

        <ResourceCard
          title="📈 Decentralized Trading"
          sectionContent={tradingSection}
        />

        <ResourceCard title="🔒 Wallets" sectionContent={walletSection} />
      </Grid>
    </Wrapper>
  )
}

const SEO = () => (
  <Head>
    <title>Yield Farming Tools</title>
    <meta name="title" content="Yield Farming Tools" />
    <meta
      name="description"
      content="🧑‍🌾 Yield farming tools and strategies."
    />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yieldfarmingtools.com/" />
    <meta property="og:title" content="Yield Farming Tools" />
    <meta
      property="og:description"
      content="🧑‍🌾 Yield farming tools and strategies."
    />
    <meta
      property="og:image"
      content="https://yieldfarmingtools.com/icons/thumbnail.png"
    />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yieldfarmingtools.com/" />
    <meta property="twitter:title" content="Yield Farming Tools" />
    <meta
      property="twitter:description"
      content="🧑‍🌾 Yield farming tools and strategies."
    />
    <meta
      property="twitter:image"
      content="https://yieldfarmingtools.com/icons/thumbnail.png"
    />

    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="icons/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="icons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="icons/favicon-16x16.png"
    />
    <link rel="manifest" href="icons/site.webmanifest" />
  </Head>
)
