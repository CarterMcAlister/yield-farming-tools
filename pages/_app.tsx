import { Box, Grid } from '@chakra-ui/core'
import type { AppProps /*, AppContext */ } from 'next/app'
import { Sidebar } from '../components/Sidebar'
import Wrapper from '../components/Wrapper'

function MyApp({ Component, pageProps }: AppProps) {
  console.log('MyApp -> pageProps', pageProps)
  return (
    <Wrapper background="#FBFCFE">
      <Grid templateColumns="300px auto" gridGap={1}>
        <Box>
          <Sidebar />
        </Box>
        <Box p={4}>
          <Component {...pageProps} />
        </Box>
      </Grid>
    </Wrapper>
  )
}

export default MyApp
