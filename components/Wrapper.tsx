import { Box, CSSReset, theme, ThemeProvider } from '@chakra-ui/core'
import { css, Global } from '@emotion/core'
import 'focus-visible/dist/focus-visible'

const GlobalStyles = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`

const Wrapper = ({ children, ...props }) => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Global styles={GlobalStyles} />
    <Box {...props}>{children}</Box>
  </ThemeProvider>
)

export default Wrapper
