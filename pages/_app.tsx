import { Box, Grid } from '@chakra-ui/core'
import type { AppProps } from 'next/app'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import Wrapper from '../components/Wrapper'
import { Card } from '../components/Card'

const App = ({ Component, pageProps }: AppProps) => (
  <Wrapper>
    <Grid
      templateColumns={['auto', 'auto', 'auto', '260px auto']}
      gridGap={1}
      background="lightBackground"
    >
      <Box display={['none', 'none', 'none', 'block']}>
        <Box position="sticky" top={0} left={0} height="100vh" p={4} pr={0}>
          <Card
            height="100%"
            m={0}
            border={0}
            boxShadow="lg"
            roundedTop={30}
            roundedBottom={30}
            justifyContent="space-between"
            alignItems="center"
          >
            <Sidebar />
          </Card>
        </Box>
      </Box>
      <Box>
        <Box display={['block', 'block', 'block', 'none']}>
          <TopNav />
        </Box>
        <Box p={4}>
          <Component {...pageProps} />
        </Box>
      </Box>
    </Grid>
  </Wrapper>
)

export default App
