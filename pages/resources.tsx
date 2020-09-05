import { Box, Grid } from '@chakra-ui/core'
import { ResourceCard } from '../components/ResourceCard'
import { SectionHeading } from '../components/SectionHeading'
import { graphcms, linkSectionContents } from '../services/graph-cms-service'

export default ({
  tradingSection,
  walletSection,
  farmingSection,
  utilitySection,
}) => (
  <Box>
    <SectionHeading title="Resources" />

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
