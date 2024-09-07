// CategoryComponent.tsx
import {
  Box,
  VStack,
  Heading,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { useSubCategory } from "./SubCategoryContext";

function CategoryComponent() {
  const router = useRouter();
  const { setSelectedSubCategory } = useSubCategory();

  const categories = [
    {
      name: "Sports",
      items: [
        "Cricket",
        "Soccer",
        "Premier League",
        "Basketball",
        "Baseball",
        "Volleyball",
      ],
    },
    {
      name: "Politics",
      items: ["US Elections", "Debate", "Ukraine"],
    },
    {
      name: "Crypto",
      items: ["Bitcoin", "Ethereum", "Airdrops"],
    },
    {
      name: "Business",
      items: ["Telegram", "Markets", "Economy"],
    },
    {
      name: "Racing",
      items: ["Formula 1", "MotoGP", "NASCAR"],
    },
  ];

  const handleItemClick = (category: string, item: string) => {
    router.push(`/${category.toLowerCase()}`);
    setSelectedSubCategory(item);
  };

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
                  <ListItem
                    color="whiteAlpha.800"
                    _hover={{ bg: "gray.700" }}
                    cursor="pointer"
                    onClick={() => handleItemClick(category.name, item)}
                  >
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
