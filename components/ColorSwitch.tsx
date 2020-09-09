import { Box } from '@chakra-ui/core'
import { HiOutlineSun } from 'react-icons/hi'
import { RiMoonLine } from 'react-icons/ri'
import styled from '@emotion/styled'

export const ColorSwitch = () => {
  return (
    <ToggleButton>
      <Box
        as="input"
        className="toggle-checkbox"
        type="checkbox"
        sx={{
          position: 'absolute',
          opacity: 0,
          cursor: 'pointer',
          height: 0,
          width: 0,
        }}
      ></Box>
      <Box
        className="toggle-slot"
        sx={{
          position: 'relative',
          height: 10,
          width: 20,
          border: '5px solid #e4e7ec',
          borderRadius: '10em',
          backgroundColor: 'white',
          boxShadow: '0px 10px 25px #e4e7ec',
          transition: 'background-color 250ms',
        }}
      >
        <Box
          className="sun-icon-wrapper"
          sx={{
            position: 'absolute',
            height: '6em',
            width: '6em',
            opacity: 1,
            transform: 'translate(2em, 2em) rotate(15deg)',
            transformOrigin: '50% 50%',
            transition:
              'opacity 150ms, transform 500ms cubic-bezier(.26,2,.46,.71)',
          }}
        >
          <Box
            as={HiOutlineSun}
            className="iconify sun-icon"
            data-icon="feather-sun"
            data-inline="false"
            sx={{
              position: 'absolute',
              height: '6em',
              width: '6em',
              color: '#ffbb52',
            }}
          ></Box>
        </Box>
        <Box
          className="toggle-button"
          sx={{
            transform: 'translate(11.75em, 1.75em)',
            position: 'absolute',
            height: '6.5em',
            width: '6.5em',
            borderRadius: '50%',
            backgroundColor: '#ffeccf',
            boxShadow: 'inset 0px 0px 0px 0.75em #ffbb52',
            transition:
              'background-color 250ms, border-color 250ms, transform 500ms cubic-bezier(.26,2,.46,.71)',
          }}
        ></Box>
        <Box
          className="moon-icon-wrapper"
          sx={{
            position: 'absolute',
            height: '6em',
            width: '6em',
            opacity: 0,
            transform: 'translate(11em, 2em) rotate(0deg)',
            transformOrigin: '50% 50%',
            transition:
              'opacity 150ms, transform 500ms cubic-bezier(.26,2.5,.46,.71)',
          }}
        >
          <Box
            as={RiMoonLine}
            className="iconify moon-icon"
            data-icon="feather-moon"
            data-inline="false"
            sx={{
              position: 'absolute',
              height: '6em',
              width: '6em',
              color: 'white',
            }}
          ></Box>
        </Box>
      </Box>
    </ToggleButton>
  )
}

const ToggleButton = styled.label`
  cursor: pointer;
  padding: 1px;
  .toggle-checkbox:checked ~ .toggle-slot {
    background-color: #374151;
  }
  .toggle-checkbox:checked ~ .toggle-slot .toggle-button {
    background-color: #485367;
    box-shadow: inset 0px 0px 0px 0.75em white;
    transform: translate(1.75em, 1.75em);
  }
  .toggle-checkbox:checked ~ .toggle-slot .sun-icon-wrapper {
    opacity: 0;
    transform: translate(3em, 2em) rotate(0deg);
  }
  .toggle-checkbox:checked ~ .toggle-slot .moon-icon-wrapper {
    opacity: 1;
    transform: translate(12em, 2em) rotate(-15deg);
  }
`
