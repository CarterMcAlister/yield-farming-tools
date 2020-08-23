import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/core'
import { GraphQLClient } from 'graphql-request'
import { PoolSection } from '../components/Pools'
import { ResourceCard } from '../components/ResourceCard'
import { TopNav } from '../components/TopNav'
import Wrapper from '../components/Wrapper'

export default ({
  informationSection,
  toolSection,
  tradingSection,
  walletSection,
  farmingSection,
  utilitySection,
}) => (
  <Wrapper maxW="1200px">
    <TopNav />

    <Flex direction={{ xs: 'column', lg: 'row' }} pb="1rem">
      <Box width={{ xs: '100%', lg: '70%' }}>
        <PoolSection />
      </Box>
      <Box flexGrow={1}>
        <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
          Information
        </Text>
        <ResourceCard pt={0} title="" sectionContent={informationSection} />
        <Text color="gray.600" fontWeight="bold" pt="1rem" pl="20px">
          Tools
        </Text>
        <ResourceCard pt={0} title="" sectionContent={toolSection} />
      </Box>
    </Flex>

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
  </Wrapper>
)

export const getStaticProps = async () => {
  const graphcms = new GraphQLClient(
    'https://api-us-west-2.graphcms.com/v2/ckd8c303l6v5e01z5c1mccopr/master'
  )

  const linkSectionContents = `
    id
    name
    link
    forBeginners
    description {
      text
    }
  `

  const sectionData = await graphcms.request(
    `
    {
      informationSection: infoLinks(where: {section: info}) {
        ${linkSectionContents}
      }
      toolSection: infoLinks(where: {section: tools}) {
        ${linkSectionContents}
      }
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
