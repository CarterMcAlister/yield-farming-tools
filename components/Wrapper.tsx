import React from 'react'
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core'
import 'focus-visible/dist/focus-visible'
import { Global, css } from '@emotion/core'

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`

const Wrapper = (props) => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Global styles={GlobalStyles} />
    {props.children}
  </ThemeProvider>
)

export default Wrapper
