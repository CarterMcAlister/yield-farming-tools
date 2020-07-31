import ibtc from './pools/ibtc'
import ieth from './pools/ieth'
import musd_mta from './pools/musd_mta'
import musd_usdc from './pools/musd_usdc'
import musd_weth from './pools/musd_weth'
import sbtc from './pools/sbtc'
import seth from './pools/seth'
import snx_usdc from './pools/snx_usdc'
import susd from './pools/susd'
import sxau from './pools/sxau'
import yfii_dai from './pools/yfii_dai'
import yfii_ycrv from './pools/yfii_ycrv'
import ygov_balancer from './pools/ygov_balancer'
import ygov_rewards from './pools/ygov_rewards'
import ygov_vote from './pools/ygov_vote'
import ygov_ycrv from './pools/ygov_ycrv'
import ygov_ycrv_balancer from './pools/ygov_ycrv_balancer'
import yusd_usdc from './pools/yusd_usdc'
import { initEthers } from '../utils'

export async function getPoolData() {
  const App = await initEthers()
  await ibtc(App)
  await ieth(App)
  await musd_mta(App)
  await musd_usdc(App)
  await musd_weth(App)
  await snx_usdc(App)
  await sbtc(App)
  await seth(App)
  await susd(App)
  await sxau(App)
  await yfii_dai(App)
  await yfii_ycrv(App)
  await ygov_balancer(App)
  await ygov_rewards(App)
  await ygov_vote(App)
  await ygov_ycrv(App)
  await ygov_ycrv_balancer(App)
  await yusd_usdc(App)
  console.log('done')
}

// export const getPoolData = {
//   susd,
// }
