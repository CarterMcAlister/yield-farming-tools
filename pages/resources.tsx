import { Grid, Heading, Box } from '@chakra-ui/core'
import { PoolProvider } from '../components/Pools'
import { ResourceCard } from '../components/ResourceCard'
import { TopNav } from '../components/TopNav'
import Wrapper from '../components/Wrapper'
import { graphcms, linkSectionContents } from '../services/graph-cms-service'

export default ({
  tradingSection,
  walletSection,
  farmingSection,
  utilitySection,
}) => (
  <Box>
    <Heading mx="1rem" size="xl">
      Resources
    </Heading>
    <Grid templateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
      <ResourceCard title="🚜 Yield Farming" sectionContent={farmingSection} />
      <ResourceCard title="⚒️ Utilities" sectionContent={utilitySection} />

      <ResourceCard
        title="📈 Decentralized Trading"
        sectionContent={tradingSection}
      />

      <ResourceCard title="🔒 Wallets" sectionContent={walletSection} />
    </Grid>
  </Box>
)

export const getStaticProps = async () => {
  const sectionData = await graphcms.request(
    `
    {
      tradingSection: infoLinks(where: {section: decentralized_trading}) {
        ${linkSectionContents}
      }
      walletSection: infoLinks(where: {section: wallets}) {
        ${linkSectionContents}
      }
      farmingSection: infoLinks(where: {section: yield_farming}) {
        ${linkSectionContents}
      }
      utilitySection: infoLinks(where: {section: utilities}) {
        ${linkSectionContents}
      }
    }
    `
  )

  return {
    props: sectionData,
  }
}
