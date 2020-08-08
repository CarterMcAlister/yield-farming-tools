import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/core'
import { GraphQLClient } from 'graphql-request'
import Head from 'next/head'
import { useEffect } from 'react'
import { Card } from '../components/Card'
import { PoolSection } from '../components/Pools'
import { ResourceCard } from '../components/ResourceCard'
import Wrapper from '../components/Wrapper'
import { useAnalytics } from '../hooks/useAnalytics'

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
      informationSection: infoLinks(where: {section: info}) {
        ${linkSectionContents}
      }
      toolSection: infoLinks(where: {section: tools}) {
        ${linkSectionContents}
      }
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

const randomIndex = (min, max) =>
  Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1))

const tagLines = [
  'Have you tended to your crops today?',
  `Don't forget to rotate your crops`,
  `It ain't much, but it's honest work`,
  'Tools and resources to help you maximize your harvest',
]

export default function Home({
  informationSection,
  toolSection,
  tradingSection,
  walletSection,
  farmingSection,
  utilitySection,
}) {
  const { init, trackPageViewed } = useAnalytics()
  useEffect(() => {
    init('UA-156207639-2')
    trackPageViewed()
  }, [])

  return (
    <Wrapper maxW="1200px">
      <SEO />
      <Card>
        <Heading as="h1" size="xl">
          <Box display={{ xs: 'block', md: 'inline' }}>🧑‍🌾 </Box>
          Yield Farming Tools
        </Heading>
        <Text pl={{ xs: 0, md: 12 }} fontSize="md" color="gray.600">
          {tagLines[randomIndex(0, tagLines.length - 1)]}
        </Text>
      </Card>

      <Flex direction={{ xs: 'column', lg: 'row' }} pb="1rem">
        <Box width={{ xs: '100%', lg: '70%' }}>
          <PoolSection />
        </Box>
        <Box flexGrow={1}>
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
            Information
          </Text>
          <ResourceCard pt={0} title="" sectionContent={informationSection} />
          <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
            Tools
          </Text>
          <ResourceCard pt={0} title="" sectionContent={toolSection} />
        </Box>
      </Flex>

      <Heading mx="1rem" size="xl">
        Resources
      </Heading>
      <Grid templateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
        <ResourceCard
          title="🚜 Yield Farming"
          sectionContent={farmingSection}
        />
        <ResourceCard title="⚒️ Utilities" sectionContent={utilitySection} />

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
