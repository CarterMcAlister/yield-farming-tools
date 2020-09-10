import {
  Box,
  Divider,
  Flex,
  FormLabel,
  Heading,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/core'
import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { Card } from './Card'

const toPercent = (num) => num * 0.01

export const ImpermanentLossCalculator = () => {
  const [impermanentLoss, setImpermanentLoss] = useState(0)
  const debouncedImpermanentLoss = useDebounce(impermanentLoss)
  const [displayedImpermanentLoss, setDisplayedImpermanentLoss] = useState(0)
  const [asset1PriceChange, setAsset1PriceChange] = useState(0)
  const [asset2PriceChange, setAsset2PriceChange] = useState(0)
  const [asset1PoolPercent, setAsset1PoolPercent] = useState(50)
  const [asset2PoolPercent, setAsset2PoolPercent] = useState(50)

  const calculateImpermanentLoss = () => {
    const deltaP =
      (1 + toPercent(asset1PriceChange)) / (1 + toPercent(asset2PriceChange))

    const il =
      1 -
      Math.pow(deltaP, toPercent(asset1PoolPercent)) /
        (toPercent(asset1PoolPercent) * deltaP + toPercent(asset2PoolPercent))
    const ilPercent = +(il * 100).toFixed(2)
    setImpermanentLoss(ilPercent)
  }

  const updatePoolWeights = (newValue, pool) => {
    if (pool === 1) {
      setAsset1PoolPercent(newValue)
      setAsset2PoolPercent(100 - newValue)
    } else {
      setAsset2PoolPercent(newValue)
      setAsset1PoolPercent(100 - newValue)
    }
  }

  useEffect(() => {
    calculateImpermanentLoss()
  }, [
    asset1PriceChange,
    asset2PriceChange,
    asset1PoolPercent,
    asset2PoolPercent,
  ])

  useEffect(() => {
    setDisplayedImpermanentLoss(impermanentLoss)
  }, [debouncedImpermanentLoss])

  return (
    <Box w="100%" pl={20}>
      <Text color="gray.600" fontWeight="bold" pt="1rem" pl={1}>
        Impermanent Loss Estimator
      </Text>
      <Card boxShadow="sm" mx={0} width="100%" maxW={600}>
        <Heading size="md" fontWeight="normal" pb={3}>
          Impermanent Loss:{' '}
          <Text fontWeight="medium" display="inline">
            {displayedImpermanentLoss}%
          </Text>
        </Heading>
        <Flex direction="column">
          <Box>
            <Heading size="sm" pb={2}>
              Asset 1
            </Heading>

            <FormLabel>Price Change</FormLabel>
            <SliderInput
              value={asset1PriceChange}
              setValue={setAsset1PriceChange}
              maxValue={500}
            />

            <FormLabel>Pool Weight</FormLabel>
            <SliderInput
              value={asset1PoolPercent}
              setValue={(value) => updatePoolWeights(value, 1)}
            />
          </Box>
          <Divider my={6} />
          <Box>
            <Heading size="sm" pb={4}>
              Asset 2
            </Heading>

            <FormLabel>Price Change</FormLabel>
            <SliderInput
              value={asset2PriceChange}
              setValue={setAsset2PriceChange}
              maxValue={500}
            />

            <FormLabel>Pool Weight</FormLabel>
            <SliderInput
              value={asset2PoolPercent}
              setValue={(value) => updatePoolWeights(value, 2)}
            />
          </Box>
        </Flex>
      </Card>
    </Box>
  )
}

const SliderInput = ({
  value,
  setValue,
  sliderColor = 'teal',
  maxValue = 100,
}) => (
  <Flex pb={4}>
    <Slider
      flex="1"
      value={value}
      color={sliderColor}
      max={maxValue}
      onChange={(value) => setValue(value)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb fontSize="sm" width="32px" height="20px" children={value} />
    </Slider>

    {/* <NumberInput>
      <InputGroup>
        <NumberInputField
          maxW="100px"
          ml="2rem"
          value={value}
          max={maxValue}
          onChange={(event) =>
            parseInt(event.target.value) <= maxValue &&
            setValue(event.target.value)
          }
        />
        <InputRightElement children="%" />
      </InputGroup>
    </NumberInput> */}
  </Flex>
)
