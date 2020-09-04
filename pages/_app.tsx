import type { AppProps /*, AppContext */ } from 'next/app'
import Wrapper from '../components/Wrapper'
import { TopNav } from '../components/TopNav'
import { Footer } from '../components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  console.log('MyApp -> pageProps', pageProps)
  return (
    <Wrapper maxW={1200}>
      <TopNav />
      <Component {...pageProps} />
      <Footer />
    </Wrapper>
  )
}

export default MyApp
