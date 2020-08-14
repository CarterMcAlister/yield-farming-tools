import { ethers } from 'ethers'
import {
  ERC20_ABI,
  YFI_YCRV_BPT_TOKEN_ADDR,
  YGOV_BPT_2_STAKING_POOL_ABI,
  YGOV_BPT_2_STAKING_POOL_ADDR,
} from '../../../constants'
import { forHumans, getBlockTime, toFixed } from '../../../utils'

export default async function main(App) {
  const YGOV_VOTING_POOL = new ethers.Contract(
    YGOV_BPT_2_STAKING_POOL_ADDR,
    YGOV_BPT_2_STAKING_POOL_ABI,
    App.provider
  )
  const YFI_YCRV_BPT_TOKEN_CONTRACT = new ethers.Contract(
    YFI_YCRV_BPT_TOKEN_ADDR,
    ERC20_ABI,
    App.provider
  )

  const currentBlockTime: any = await getBlockTime()
  const currentBlockNumber = await App.provider.getBlockNumber()
  const currentTotalStakedBPTAmount =
    (await YFI_YCRV_BPT_TOKEN_CONTRACT.balanceOf(
      YGOV_BPT_2_STAKING_POOL_ADDR
    )) / 1e18

  const proposalCount = await YGOV_VOTING_POOL.proposalCount()
  let proposals = {}

  for (let i = 0; i < proposalCount; i++) {
    proposals[i] = await YGOV_VOTING_POOL.proposals(i)
  }

  // PROPOSALS
  let wasVotingPeriodOver = true

  for (let i = 0; i < proposalCount; i++) {
    const proposedBy = proposals[i][1]
    const forVotes = proposals[i][2] / 1e18
    const againstVotes = proposals[i][3] / 1e18
    const startBlock = proposals[i][4]
    const endBlock = proposals[i][5]

    const totalVotes = forVotes + againstVotes
    const timeUntilEndBlock = (endBlock - currentBlockNumber) * currentBlockTime

    let readableTimeUntilEndBlock
    let totalStakedBPTAmount
    let status, isQuorumMet, isVotingPeriodOver

    if (timeUntilEndBlock <= 0) {
      isVotingPeriodOver = true
      const endBlockTimestamp = (
        await App.provider.getBlock(parseInt(endBlock))
      ).timestamp
      readableTimeUntilEndBlock =
        forHumans(Date.now() / 1000 - endBlockTimestamp) + ' ago'
      totalStakedBPTAmount =
        (await YFI_YCRV_BPT_TOKEN_CONTRACT.balanceOf(
          YGOV_BPT_2_STAKING_POOL_ADDR,
          { blockTag: parseInt(endBlock) }
        )) / 1e18
    } else {
      isVotingPeriodOver = false
      readableTimeUntilEndBlock = 'in ' + forHumans(timeUntilEndBlock)
      totalStakedBPTAmount = currentTotalStakedBPTAmount
    }

    const quorumPercentage = toFixed(
      (totalVotes * 100) / totalStakedBPTAmount,
      2
    )
    isQuorumMet = quorumPercentage > 33

    status = ''
    if (isVotingPeriodOver) {
      if (!isQuorumMet) {
        status += '🏳 DECLINED: Quorum percentage (33%) was not met.'
      } else {
        if (forVotes > againstVotes) {
          status += '✅ PASSED'
        } else if (againstVotes > forVotes) {
          status += '❌ REJECTED'
        } else {
          status += '⚠️ TIED'
        }
      }
    } else {
      status = '⌛ ON GOING'
    }

    if (isVotingPeriodOver) {
      if (isQuorumMet) {
        if (forVotes > againstVotes) {
        } else if (againstVotes > forVotes) {
        }
      } else {
      }
    }

    wasVotingPeriodOver = isVotingPeriodOver
  }
}
