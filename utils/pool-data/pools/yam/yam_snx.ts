import { ethers } from 'ethers';
import {
    BALANCER_POOL_ABI,
    ERC20_ABI, YAM_TOKEN_ABI
} from '../../../constants';
import { get_synth_weekly_rewards, lookUpPrices, toDollar, toFixed } from '../../../utils';

const YAM_WETH_UNI_TOKEN_ADDR = "0xC358001a71b3160B4B243D6e8c6F52579f82215e";
const YAM_TOKEN_ADDR = "0x0e2298E3B3390e3b945a5456fBf59eCc3f55DA16";
const CURVE_Y_POOL_ADDR = "0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51";
const CURVE_Y_POOL_ABI: any = [{"name":"TokenExchange","inputs":[{"type":"address","name":"buyer","indexed":true},{"type":"int128","name":"sold_id","indexed":false},{"type":"uint256","name":"tokens_sold","indexed":false},{"type":"int128","name":"bought_id","indexed":false},{"type":"uint256","name":"tokens_bought","indexed":false}],"anonymous":false,"type":"event"},{"name":"TokenExchangeUnderlying","inputs":[{"type":"address","name":"buyer","indexed":true},{"type":"int128","name":"sold_id","indexed":false},{"type":"uint256","name":"tokens_sold","indexed":false},{"type":"int128","name":"bought_id","indexed":false},{"type":"uint256","name":"tokens_bought","indexed":false}],"anonymous":false,"type":"event"},{"name":"AddLiquidity","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256[4]","name":"token_amounts","indexed":false},{"type":"uint256[4]","name":"fees","indexed":false},{"type":"uint256","name":"invariant","indexed":false},{"type":"uint256","name":"token_supply","indexed":false}],"anonymous":false,"type":"event"},{"name":"RemoveLiquidity","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256[4]","name":"token_amounts","indexed":false},{"type":"uint256[4]","name":"fees","indexed":false},{"type":"uint256","name":"token_supply","indexed":false}],"anonymous":false,"type":"event"},{"name":"RemoveLiquidityImbalance","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256[4]","name":"token_amounts","indexed":false},{"type":"uint256[4]","name":"fees","indexed":false},{"type":"uint256","name":"invariant","indexed":false},{"type":"uint256","name":"token_supply","indexed":false}],"anonymous":false,"type":"event"},{"name":"CommitNewAdmin","inputs":[{"type":"uint256","name":"deadline","indexed":true,"unit":"sec"},{"type":"address","name":"admin","indexed":true}],"anonymous":false,"type":"event"},{"name":"NewAdmin","inputs":[{"type":"address","name":"admin","indexed":true}],"anonymous":false,"type":"event"},{"name":"CommitNewParameters","inputs":[{"type":"uint256","name":"deadline","indexed":true,"unit":"sec"},{"type":"uint256","name":"A","indexed":false},{"type":"uint256","name":"fee","indexed":false},{"type":"uint256","name":"admin_fee","indexed":false}],"anonymous":false,"type":"event"},{"name":"NewParameters","inputs":[{"type":"uint256","name":"A","indexed":false},{"type":"uint256","name":"fee","indexed":false},{"type":"uint256","name":"admin_fee","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"address[4]","name":"_coins"},{"type":"address[4]","name":"_underlying_coins"},{"type":"address","name":"_pool_token"},{"type":"uint256","name":"_A"},{"type":"uint256","name":"_fee"}],"constant":false,"payable":false,"type":"constructor"},{"name":"get_virtual_price","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":1535185},{"name":"calc_token_amount","outputs":[{"type":"uint256","name":"out"}],"inputs":[{"type":"uint256[4]","name":"amounts"},{"type":"bool","name":"deposit"}],"constant":true,"payable":false,"type":"function","gas":6067881},{"name":"add_liquidity","outputs":[],"inputs":[{"type":"uint256[4]","name":"amounts"},{"type":"uint256","name":"min_mint_amount"}],"constant":false,"payable":false,"type":"function","gas":9327083},{"name":"get_dy","outputs":[{"type":"uint256","name":"out"}],"inputs":[{"type":"int128","name":"i"},{"type":"int128","name":"j"},{"type":"uint256","name":"dx"}],"constant":true,"payable":false,"type":"function","gas":3454227},{"name":"get_dx","outputs":[{"type":"uint256","name":"out"}],"inputs":[{"type":"int128","name":"i"},{"type":"int128","name":"j"},{"type":"uint256","name":"dy"}],"constant":true,"payable":false,"type":"function","gas":3454232},{"name":"get_dy_underlying","outputs":[{"type":"uint256","name":"out"}],"inputs":[{"type":"int128","name":"i"},{"type":"int128","name":"j"},{"type":"uint256","name":"dx"}],"constant":true,"payable":false,"type":"function","gas":3454087},{"name":"get_dx_underlying","outputs":[{"type":"uint256","name":"out"}],"inputs":[{"type":"int128","name":"i"},{"type":"int128","name":"j"},{"type":"uint256","name":"dy"}],"constant":true,"payable":false,"type":"function","gas":3454093},{"name":"exchange","outputs":[],"inputs":[{"type":"int128","name":"i"},{"type":"int128","name":"j"},{"type":"uint256","name":"dx"},{"type":"uint256","name":"min_dy"}],"constant":false,"payable":false,"type":"function","gas":7030208},{"name":"exchange_underlying","outputs":[],"inputs":[{"type":"int128","name":"i"},{"type":"int128","name":"j"},{"type":"uint256","name":"dx"},{"type":"uint256","name":"min_dy"}],"constant":false,"payable":false,"type":"function","gas":7050194},{"name":"remove_liquidity","outputs":[],"inputs":[{"type":"uint256","name":"_amount"},{"type":"uint256[4]","name":"min_amounts"}],"constant":false,"payable":false,"type":"function","gas":240409},{"name":"remove_liquidity_imbalance","outputs":[],"inputs":[{"type":"uint256[4]","name":"amounts"},{"type":"uint256","name":"max_burn_amount"}],"constant":false,"payable":false,"type":"function","gas":9326310},{"name":"commit_new_parameters","outputs":[],"inputs":[{"type":"uint256","name":"amplification"},{"type":"uint256","name":"new_fee"},{"type":"uint256","name":"new_admin_fee"}],"constant":false,"payable":false,"type":"function","gas":145867},{"name":"apply_new_parameters","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":133482},{"name":"revert_new_parameters","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":21805},{"name":"commit_transfer_ownership","outputs":[],"inputs":[{"type":"address","name":"_owner"}],"constant":false,"payable":false,"type":"function","gas":74482},{"name":"apply_transfer_ownership","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":60538},{"name":"revert_transfer_ownership","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":21895},{"name":"withdraw_admin_fees","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":22667},{"name":"kill_me","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":37848},{"name":"unkill_me","outputs":[],"inputs":[],"constant":false,"payable":false,"type":"function","gas":21985},{"name":"coins","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"int128","name":"arg0"}],"constant":true,"payable":false,"type":"function","gas":2160},{"name":"underlying_coins","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"int128","name":"arg0"}],"constant":true,"payable":false,"type":"function","gas":2190},{"name":"balances","outputs":[{"type":"uint256","name":"out"}],"inputs":[{"type":"int128","name":"arg0"}],"constant":true,"payable":false,"type":"function"},{"name":"A","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2051},{"name":"fee","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2081},{"name":"admin_fee","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2111},{"name":"owner","outputs":[{"type":"address","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2141},{"name":"admin_actions_deadline","outputs":[{"type":"uint256","unit":"sec","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2171},{"name":"transfer_ownership_deadline","outputs":[{"type":"uint256","unit":"sec","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2201},{"name":"future_A","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2231},{"name":"future_fee","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2261},{"name":"future_admin_fee","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2291},{"name":"future_owner","outputs":[{"type":"address","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":2321}];
const WETH_TOKEN_ADDR = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const Y_STAKING_POOL_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":true,"inputs":[],"name":"DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardDistribution","type":"address"}],"name":"setRewardDistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"y","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"yfi","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
const SNX_TOKEN_ADDRESS = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";

export default async function main(App) {

    const stakingToken = SNX_TOKEN_ADDRESS;
    const stakingTokenTicker = "SNX";
    const rewardPoolAddr = "0x6c3FC1FFDb14D92394f40eeC91D9Ce8B807f132D";
    const rewardTokenAddr = YAM_TOKEN_ADDR;
    const balancerPoolTokenAddr = "0xc7062D899dd24b10BfeD5AdaAb21231a1e7708fE";
    const rewardTokenTicker = "YAM";

    const Y_STAKING_POOL = new ethers.Contract(rewardPoolAddr, Y_STAKING_POOL_ABI, App.provider);
    const CURVE_Y_POOL = new ethers.Contract(CURVE_Y_POOL_ADDR, CURVE_Y_POOL_ABI, App.provider);
    const Y_TOKEN = new ethers.Contract(stakingToken, ERC20_ABI, App.provider);
    const YFFI_DAI_BALANCER_POOL = new ethers.Contract(balancerPoolTokenAddr, BALANCER_POOL_ABI, App.provider);

    const YAM_TOKEN = new ethers.Contract(YAM_TOKEN_ADDR, YAM_TOKEN_ABI, App.provider);
    const WETH_TOKEN = new ethers.Contract(WETH_TOKEN_ADDR, ERC20_ABI, App.provider);

    const yamScale = await YAM_TOKEN.yamsScalingFactor() / 1e18;


    const stakedYAmount = await Y_STAKING_POOL.balanceOf(App.YOUR_ADDRESS) / 1e18;
    const earnedYFFI = yamScale * await Y_STAKING_POOL.earned(App.YOUR_ADDRESS) / 1e18;
    const totalSupplyY = await Y_TOKEN.totalSupply() / 1e18;
    const totalStakedYAmount = await Y_TOKEN.balanceOf(rewardPoolAddr) / 1e18;

    // Find out reward rate
    const weekly_reward = (await get_synth_weekly_rewards(Y_STAKING_POOL)) * await YAM_TOKEN.yamsScalingFactor() / 1e18;

    // const weekly_reward = 0;

    const rewardPerToken = weekly_reward / totalStakedYAmount;

    // Find out underlying assets of Y
    // const YVirtualPrice = await CURVE_Y_POOL.get_virtual_price() / 1e18;
    const unstakedY = await Y_TOKEN.balanceOf(App.YOUR_ADDRESS) / 1e18;

    // Look up prices
    // const prices = await lookUpPrices(["yearn-finance"]);
    // const YFIPrice = prices["yearn-finance"].usd;
    const prices = await lookUpPrices(["havven", "ethereum", "yam"]);
    const stakingTokenPrice = prices["havven"].usd;

    // const rewardTokenPrice = (await YFFI_DAI_BALANCER_POOL.getSpotPrice(LINK_TOKEN_ADDR, rewardTokenAddr) / 1e18) * stakingTokenPrice;
    const rewardTokenPrice = prices["yam"].usd;

    const YFIWeeklyROI = (rewardPerToken * rewardTokenPrice) * 100 / (stakingTokenPrice);

    return {
        apr: toFixed(YFIWeeklyROI * 52, 4),
        prices: [
          { label: stakingTokenTicker, value: toDollar(stakingTokenPrice) },
          { label: 'YAM', value: toDollar(rewardTokenPrice) },
        ],
        staking: [
          {
            label: 'Pool Total',
            value: toDollar(totalStakedYAmount * stakingTokenPrice),
          },
          {
            label: 'Your Total',
            value: toDollar(stakedYAmount * stakingTokenPrice),
          },
        ],
        rewards: [
          {
            label: `${toFixed(earnedYFFI, 4)} YAM`,
            value: toDollar(earnedYFFI * rewardTokenPrice),
          },
        ],
        ROIs: [
          {
            label: 'Hourly',
            value: `${toFixed(YFIWeeklyROI / 7 / 24, 4)}%`,
          },
          {
            label: 'Daily',
            value: `${toFixed(YFIWeeklyROI / 7, 4)}%`,
          },
          {
            label: 'Weekly',
            value: `${toFixed(YFIWeeklyROI, 4)}%`,
          },
        ],
        links: [
          {
            title: 'Info',
            link: 'https://medium.com/@yamfinance/yam-finance-d0ad577250c7',
          },
          {
            title: 'Staking',
            link: 'https://yam.finance/',
          },
        ],
      }

}
