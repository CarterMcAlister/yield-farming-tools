import { RiskLevel } from '../../../../types'
import { toDollar, toFixed } from '../../../utils'

export default async function main(App) {
  let FPMMs
  const FPMMGQLQuery =
    '{ fixedProductMarketMakers(first: 1000) { id creator collateralToken liquidityParameter scaledLiquidityParameter title arbitrator answerFinalizedTimestamp } }'
  const FPMMGQLData = {
    query: FPMMGQLQuery,
    variables: {},
  }
  const ETHPriceGQLQuery = '{ bundle(id: "1" ) { ethPrice } }'
  const ETHPriceGQLData = {
    query: ETHPriceGQLQuery,
    variables: {},
  }
  let TokenGQLQuery = ''
  let TokenGQLData

  const omenURL = 'https://api.thegraph.com/subgraphs/name/gnosis/omen'
  const uniswapURL =
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  const pnkContractAddress = '0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d'

  let ETHPrice
  const uniqueTokenArray = []
  const tokenToETHValue = {}
  const tokenDecimal = {}
  let totalPoolLiquidity = 0
  const monthlyPNKReward = 300000
  let sortedFPMM

  let individualCollateralinUSDValue

  return fetch(omenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(FPMMGQLData),
  })
    .then((response) => response.json())
    .then((data) => {
      FPMMs = data.data.fixedProductMarketMakers
    })
    .catch((error) => {
      console.error('Error:', error)
    })
    .then(async function () {
      FPMMs.forEach((FPMM) => {
        uniqueTokenArray.push(FPMM.collateralToken.toLowerCase())
      })

      uniqueTokenArray.push(pnkContractAddress)

      await fetch(uniswapURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ETHPriceGQLData),
      })
        .then((response) => response.json())
        .then((data) => {
          ETHPrice = data.data.bundle.ethPrice
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
    .then(async function () {
      let tokenLength = uniqueTokenArray.length
      let index = 1

      for (let Token of uniqueTokenArray) {
        TokenGQLQuery +=
          'Token' +
          index +
          ': token(id: "' +
          Token +
          '"){ id name decimals derivedETH } '
        index += 1
      }
      TokenGQLQuery = '{ ' + TokenGQLQuery + '}'
      TokenGQLData = {
        query: TokenGQLQuery,
        variables: {},
      }
      await fetch(uniswapURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(TokenGQLData),
      })
        .then((response) => response.json())
        .then((data) => {
          for (let index = 1; index <= tokenLength; index++) {
            let token = 'Token' + index
            tokenToETHValue[data.data[token].id] = data.data[token].derivedETH
            tokenDecimal[data.data[token].id] = data.data[token].decimals
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
    .then(function () {
      FPMMs.forEach((FPMM) => {
        if (
          FPMM.arbitrator == '0xd47f72a2d1d0e91b0ec5e5f5d02b2dc26d00a14d' &&
          FPMM.answerFinalizedTimestamp == null &&
          FPMM.scaledLiquidityParameter != 0 &&
          FPMM.creator != '0xacbc967d956f491cadb6288878de103b4a0eb38c' &&
          FPMM.creator != '0x32981c1eeef4f5af3470069836bf95a0f8ac0508'
        ) {
          individualCollateralinUSDValue = Math.ceil(
            FPMM.scaledLiquidityParameter *
              tokenToETHValue[FPMM.collateralToken] *
              ETHPrice
          )
          totalPoolLiquidity += parseFloat(individualCollateralinUSDValue)
        }
        totalPoolLiquidity = Math.ceil(totalPoolLiquidity)
      })
    })
    .then(function () {
      sortedFPMM = FPMMs.sort((a, b) =>
        a.scaledLiquidityParameter * tokenToETHValue[a.collateralToken] <
        b.scaledLiquidityParameter * tokenToETHValue[b.collateralToken]
          ? 1
          : -1
      )

      sortedFPMM.forEach((FPMM) => {
        if (
          FPMM.arbitrator == '0xd47f72a2d1d0e91b0ec5e5f5d02b2dc26d00a14d' &&
          FPMM.answerFinalizedTimestamp == null &&
          FPMM.scaledLiquidityParameter != 0 &&
          FPMM.creator != '0xacbc967d956f491cadb6288878de103b4a0eb38c' &&
          FPMM.creator != '0x32981c1eeef4f5af3470069836bf95a0f8ac0508'
        ) {
          individualCollateralinUSDValue = Math.ceil(
            FPMM.scaledLiquidityParameter *
              tokenToETHValue[FPMM.collateralToken] *
              ETHPrice
          )
        }
      })
    })
    .then(function () {
      let currentTotal = totalPoolLiquidity
      let pnkUSDValue = tokenToETHValue[pnkContractAddress] * ETHPrice
      let monthlyPNKRewardInUSD = monthlyPNKReward * pnkUSDValue
      let amountToInvest = 1

      const poolValue = currentTotal
      const yearRoi =
        Math.ceil(
          ((1 + monthlyPNKRewardInUSD / (currentTotal + amountToInvest)) ** 12 -
            1) *
            100 *
            100
        ) / 100
      const weeklyRoi = yearRoi / 52

      return {
        provider: 'Omen',
        name: 'Omen Kleros',
        poolRewards: ['PNK'],
        risk: {
          smartContract: RiskLevel.HIGH,
          impermanentLoss: RiskLevel.NONE,
        },
        apr: toFixed(weeklyRoi * 52, 4),
        prices: [{ label: 'PNK', value: toDollar(pnkUSDValue) }],
        staking: [
          {
            label: 'Pool Total',
            value: toDollar(poolValue),
          },
        ],
        rewards: [],
        ROIs: [
          {
            label: 'Hourly',
            value: `${toFixed(weeklyRoi / 7 / 24, 4)}%`,
          },
          {
            label: 'Daily',
            value: `${toFixed(weeklyRoi / 7, 4)}%`,
          },
          {
            label: 'Weekly',
            value: `${toFixed(weeklyRoi, 4)}%`,
          },
        ],
        links: [
          {
            title: 'Info',
            link:
              'https://blog.kleros.io/make-pnk-with-omen-conditional-markets-a-guide/',
          },
          {
            title: 'Return Calculator',
            link: 'https://omenfarming.com/',
          },
          {
            title: 'Omen Market',
            link: 'https://omen.eth.link/#/24h-volume',
          },
        ],
      }
    })
}
