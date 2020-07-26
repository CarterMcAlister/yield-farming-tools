import Head from 'next/head'
import { useEffect } from 'react'
import { Box, Heading, Text } from '@chakra-ui/core'
import Wrapper from './Wrapper'
// import PoolsList from './Pools'
import Resources from './Info'
import { useAnalytics } from '../hooks/useAnalytics'

export default function Home() {
  const { init, trackPageViewed } = useAnalytics()
  useEffect(() => {
    init('UA-156207639-2')
    trackPageViewed()
  }, [])
  return (
    <Wrapper>
      <SEO />
      {/* <PoolsList /> */}
      <Card>
        <Heading as="h1" size="xl">
          <Box display={{ xs: 'block', md: 'inline' }}>🧑‍🌾 </Box>Yield Farming
          Tools
        </Heading>
        <Text pl={{ xs: 0, md: 12 }} fontSize="md" color="gray.600">
          Pool return rates, starter guide, and strategies coming soon.
        </Text>
      </Card>
      <Resources />
    </Wrapper>
  )
}

const Card = ({ children, ...props }) => (
  <Box
    backgroundColor="#fff"
    boxShadow="lg"
    rounded="lg"
    m={4}
    p={4}
    pt={1}
    {...props}
  >
    {children}
  </Box>
)

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
