import {
  Box,
  VStack,
  Heading,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";
import React from "react";

function CategoryComponent() {
  const categories = [
    {
      name: "Sport",
      items: ["Football", "Basketball", "Tennis", "Ice Hockey", "Volleyball"],
    },
    {
      name: "Virtual Sport",
      items: [
        "Virtual Football",
        "Virtual Basketball",
        "Virtual World Cup",
        "Virtual Tennis",
      ],
    },
    {
      name: "Bet Games",
      items: ["Live Casino", "Live Games"],
    },
    {
      name: "TV Games",
      items: ["PokerBet", "Elemental Battle"],
    },
  ];
  return (
    <Box bg="#181A24" w={{ base: "100%", md: "100%" }} p={4} boxShadow="lg">
      <VStack align="stretch" spacing={4}>
        {categories.map((category, index) => (
          <Box key={index} bg="gray.600" borderRadius="md">
            <Heading size="sm" color="whiteAlpha.900" my={2} pl={2}>
              {category.name}
            </Heading>
            <List spacing={2} pl={4} bg="gray.800" p={2}>
              {category.items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ListItem color="whiteAlpha.800" _hover={{ bg: "gray.700" }}>
                    {item}
                  </ListItem>
                  {idx < category.items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default CategoryComponent;
