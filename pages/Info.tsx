import React from 'react'
import {
  Box,
  Grid,
  Text,
  Heading,
  List,
  ListItem,
  Link,
  Tooltip,
} from '@chakra-ui/core'

const Card = ({ children, ...props }) => (
  <Box
    backgroundColor="#fff"
    boxShadow="lg"
    rounded="lg"
    m={4}
    p={4}
    {...props}
  >
    {children}
  </Box>
)

const ResourceItem = ({ name, url, description, isForBeginners = false }) => (
  <ListItem pt={4}>
    <Link isExternal href={url} color="cyan.700">
      {name}{' '}
    </Link>
    {isForBeginners && (
      <Tooltip
        label="Beginner Friendly"
        aria-label="Beginner Friendly"
        bg="white"
        color="black"
        placement="right-end"
      >
        🔰
      </Tooltip>
    )}
    <Text fontSize="sm" color="gray.600">
      {description}
    </Text>
  </ListItem>
)

const InfoSection = (props) => (
  <Grid templateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
    <Card>
      <Heading as="h2" size="lg">
        📈 Decentralized Trading
      </Heading>
      <List>
        <ResourceItem
          name="Uniswap Exchange"
          url="https://app.uniswap.org/#/swap"
          description="Trade between Ethereum based assets."
        />
        <ResourceItem
          name="1inch Exchange"
          url="https://1inch.exchange"
          description="Finds the most optimal route to trade between tokens."
        />
        <ResourceItem
          name="Matcha"
          url="https://matcha.xyz/"
          description="Seamless, user-friendly trading."
          isForBeginners={true}
        />
        <ResourceItem
          name="Curve"
          url="https://www.curve.fi/"
          description="Swap between stablecoins with very low slippage."
        />
      </List>
    </Card>
    <Card>
      <Heading as="h2" size="lg">
        🔒 Wallets
      </Heading>
      <List>
        <ResourceItem
          name="Argent"
          url="https://www.argent.xyz/"
          description="Phone wallet with built in dapps, trading, advanced security, and recovery features."
          isForBeginners={true}
        />
        <ResourceItem
          name="Coinbase Wallet"
          url="https://wallet.coinbase.com/"
          description="Phone wallet with decentralized app support."
        />
        <ResourceItem
          name="Metamask"
          url="https://metamask.io/"
          description="A browser based wallet that lets you interact with decentralized apps from your favorite browser. Supports Ledger and Trezor."
        />
      </List>
    </Card>
    <Card>
      <Heading as="h2" size="lg">
        🚜 Yield Farming
      </Heading>
      <List>
        <ResourceItem
          name="mStable"
          url="https://app.mstable.org/"
          description="Earn intest by staking mUSD or mint mUSD for farming in other pools."
        />
        <ResourceItem
          name="Yearn"
          url="https://yearn.finance/"
          description="Farm $YFI and participate in governance."
        />
        <ResourceItem
          name="Synthetix"
          url="https://www.synthetix.io/"
          description="Farm $SNX, mint sUSD, or stake $SNX."
        />
        <ResourceItem
          name="Curve"
          url="https://www.curve.fi/"
          description="Stake stablecoins to earn more stablecoins and other tokens."
        />
        <ResourceItem
          name="Balancer"
          url="https://balancer.finance/"
          description="Earn $BAL by staking your tokens in Balancer pools."
        />
        <ResourceItem
          name="Aave"
          url="https://aave.com/"
          description="Borrow against or lend many different crypto assets."
        />
        <ResourceItem
          name="Compound"
          url="https://compound.finance/"
          description="Borrow against crypto assets, lend crypto assets, and farm $COMP."
        />
        <ResourceItem
          name="MakerDAO"
          url="https://makerdao.com/en/"
          description="Borrow against crypto assets and lend crypto assets for $DAI."
        />
        <ResourceItem
          name="Ampleforth"
          url="https://www.ampleforth.org/quickstart/"
          description="Farm $AMPL while benefiting from the Ampleforth supply rebases."
        />
      </List>
    </Card>
    <Card>
      <Heading as="h2" size="lg">
        🧰 Utilities
      </Heading>
      <List>
        <ResourceItem
          name="CoinGecko"
          url="https://www.coingecko.com/en"
          description="A better CoinMarketCap."
        />
        <ResourceItem
          name="Nexus Mutual"
          url="https://nexusmutual.io/"
          description="Get coverage on your assets against a Smart Contract hack."
        />
        <ResourceItem
          name="Zerion"
          url="https://zerion.io/"
          description="A dashboard and mobile app for tracking your DeFi transactions and assets."
        />
        <ResourceItem
          name="Zapper"
          url="https://www.zapper.fi/"
          description="A dashboard for managing your DeFi assets and liabilites."
          isForBeginners={true}
        />
        <ResourceItem
          name="DeBank"
          url="https://debank.com/"
          description="A DeFi dashboard that includes ecosystem info."
        />
        <ResourceItem
          name="InstaDapp"
          url="https://instadapp.io/"
          description="Manage your DeFi assets while leveraging powerful tools."
        />
        <ResourceItem
          name="DeFi Saver"
          url="https://defisaver.com/"
          description="MakerDAO and Compound management, including the ability to automatically save a CDP from being liquidated."
        />
      </List>
    </Card>
  </Grid>
)

export default InfoSection
