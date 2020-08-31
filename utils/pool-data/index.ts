import b_scrv from './pools/based/b_scrv'
import b_susd from './pools/based/b_susd'
import cream_bal from './pools/cream/cream_bal'
import cream_uni from './pools/cream/cream_uni'
import df_usdx from './pools/dforce/df-usdx'
import dUSDT_dUSDC_dDAI from './pools/dforce/dUSDT-dUSDC-dDAI'
import goldx_usdx from './pools/dforce/goldx-usdx'
import musd_mta from './pools/mstable/musd_mta'
import musd_mta_2 from './pools/mstable/musd_mta_2'
import musd_usdc from './pools/mstable/musd_usdc'
import musd_weth from './pools/mstable/musd_weth'
import omen_pnk from './pools/omen/omen-pnk'
import * as shrimpPools from './pools/shrimp'
import * as spaghettiPools from './pools/spaghetti'
import * as sushiPools from './pools/sushi'
import ibtc from './pools/synthetix/ibtc'
import sbtc from './pools/synthetix/sbtc'
import susd from './pools/synthetix/susd'
import yusd_usdc from './pools/uma/yusd_usdc'
import * as yamPools from './pools/yam'
import * as yamClassicPools from './pools/yam-classic'
import yvault_alink from './pools/yearn/yvault_alink'
import yvault_dai from './pools/yearn/yvault_dai'
import yvault_tusd from './pools/yearn/yvault_tusd'
import yvault_usdc from './pools/yearn/yvault_usdc'
import yvault_usdt from './pools/yearn/yvault_usdt'
import yvault_ycrv from './pools/yearn/yvault_ycrv'
import yffi from './pools/yffi/yffi_1'
import yffi_dai from './pools/yffi/yffi_2'
import yffi_ycrv from './pools/yffi/yffi_3'
import yfii_dai from './pools/yfii/yfii_dai'
import yfii_ycrv from './pools/yfii/yfii_ycrv'
import yfl_1 from './pools/yflink/pool_1'
import yfl_2 from './pools/yflink/pool_2'
import yfl_3 from './pools/yflink/pool_3'

export const pools = {
  ibtc,
  musd_mta,
  musd_usdc,
  musd_weth,
  musd_mta_2,
  sbtc,
  susd,
  yfii_dai,
  yfii_ycrv,
  yusd_usdc,
  yffi,
  yffi_ycrv,
  yffi_dai,
  df_usdx,
  goldx_usdx,
  dUSDT_dUSDC_dDAI,
  omen_pnk,
  b_scrv,
  yfl_1,
  yfl_2,
  yfl_3,
  yvault_ycrv,
  yvault_usdt,
  yvault_usdc,
  yvault_tusd,
  yvault_dai,
  yvault_alink,
  cream_bal,
  cream_uni,
  b_susd,
  ...yamPools,
  ...yamClassicPools,
  ...shrimpPools,
  ...spaghettiPools,
  ...sushiPools,
}
