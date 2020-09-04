import type { AppProps /*, AppContext */ } from 'next/app'
import Wrapper from '../components/Wrapper'
import { TopNav } from '../components/TopNav'
import { Footer } from '../components/Footer'
import { Grid, Box } from '@chakra-ui/core'
import { Sidebar } from '../components/Sidebar'

function MyApp({ Component, pageProps }: AppProps) {
  console.log('MyApp -> pageProps', pageProps)
  return (
    <Wrapper>
      <Grid templateColumns="300px auto" gridGap={1}>
        <Box>
          <Sidebar />
        </Box>
        <Box>
          <Component {...pageProps} />
        </Box>
      </Grid>
    </Wrapper>
  )
}

export default MyApp
