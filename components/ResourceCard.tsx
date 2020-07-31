import { Text, Heading, List, ListItem, Link, Tooltip } from '@chakra-ui/core'
import { Card } from './Card'

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

export const ResourceCard = ({ title, sectionContent, ...props }) => (
  <Card {...props}>
    <Heading as="h2" size="lg">
      {title}
    </Heading>
    <List>
      {sectionContent.map(({ id, name, link, description, forBeginners }) => (
        <ResourceItem
          name={name}
          url={link}
          description={description.text}
          isForBeginners={forBeginners}
          key={id}
        />
      ))}
    </List>
  </Card>
)
