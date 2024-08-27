import {
  Box,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FaFutbol,
  FaBasketballBall,
  FaBaseballBall,
  FaVolleyballBall,
} from "react-icons/fa";
import { SiCounterstrike } from "react-icons/si";
import { GiCricketBat } from "react-icons/gi";
import { MdSportsSoccer } from "react-icons/md";

const Popular = ({ onSelectCategory }: any) => {
  const categories = [
    { name: "Soccer", icon: MdSportsSoccer },
    { name: "Premier League", icon: FaFutbol },
    { name: "Basketball", icon: FaBasketballBall },
    { name: "Counter-Strike", icon: SiCounterstrike },
    { name: "Baseball", icon: FaBaseballBall },
    { name: "Cricket", icon: GiCricketBat },
    { name: "Volleyball", icon: FaVolleyballBall },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category.name);
    onSelectCategory(category.name);
  };

  return (
    <Box bg="#181A24" p={4} borderRadius="md">
      <Text fontSize="2xl" mb={4} color="white">
        Popular
      </Text>
      <Wrap>
        {categories.map((category) => (
          <WrapItem key={category.name}>
            <Tag
              size="lg"
              variant={selectedCategory === category.name ? "solid" : "outline"}
              colorScheme={
                selectedCategory === category.name ? "green" : "teal"
              }
              cursor="pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <Icon as={category.icon} mr={2} />
              <TagLabel>{category.name}</TagLabel>
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default Popular;
