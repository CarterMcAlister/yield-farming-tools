import { Box, CSSReset, Flex, theme, ThemeProvider } from '@chakra-ui/core'
import { css, Global } from '@emotion/core'
import 'focus-visible/dist/focus-visible'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { EthContext } from '../contexts/ProviderContext'

const GlobalStyles = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`

const Wrapper = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <EthContext>
      <CSSReset />
      <Global styles={GlobalStyles} />
      <SEO />
      <Flex justifyContent="center">
        <Box width="100%" {...props}>
          {children}
        </Box>
      </Flex>
    </EthContext>
  </ThemeProvider>
)

const SEO = () => {
  const { init, trackPageViewed } = useAnalytics()

  useEffect(() => {
    init('UA-156207639-2')
    trackPageViewed()
  }, [])

  return (
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
}

export default Wrapper
