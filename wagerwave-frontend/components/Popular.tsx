import {
  Box,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FaFutbol,
  FaBasketballBall,
  FaBaseballBall,
  FaVolleyballBall,
  FaFlagUsa,
  FaHandshake,
  FaGlobe,
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaTelegram,
  FaMoneyBillWave,
  FaCar,
  FaMotorcycle,
  FaFlagCheckered,
} from "react-icons/fa";
import { SiCounterstrike } from "react-icons/si";
import { GiCricketBat } from "react-icons/gi";
import { MdSportsSoccer } from "react-icons/md";
import { useRouter } from "next/router";

const Popular = ({ onSelectCategory }: any) => {
  const router = useRouter();
  const path = router.pathname.substring(1);
  const categoriesMapping: any = {
    sports: [
      { name: "Cricket", icon: GiCricketBat },
      { name: "Soccer", icon: MdSportsSoccer },
      { name: "Premier League", icon: FaFutbol },
      { name: "Basketball", icon: FaBasketballBall },
      { name: "Baseball", icon: FaBaseballBall },
      { name: "Volleyball", icon: FaVolleyballBall },
    ],
    politics: [
      { name: "US Elections", icon: FaFlagUsa },
      { name: "Debate", icon: FaHandshake },
      { name: "Ukraine", icon: FaGlobe },
    ],
    crypto: [
      { name: "Bitcoin", icon: FaBitcoin },
      { name: "Ethereum", icon: FaEthereum },
      { name: "Airdrops", icon: FaChartLine },
    ],
    business: [
      { name: "Telegram", icon: FaTelegram },
      { name: "Markets", icon: FaChartLine },
      { name: "Economy", icon: FaMoneyBillWave },
    ],
    racing: [
      { name: "Formula 1", icon: FaCar },
      { name: "MotoGP", icon: FaMotorcycle },
      { name: "NASCAR", icon: FaFlagCheckered },
    ],
  };

  const categories = categoriesMapping[path] || categoriesMapping["sports"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category.name);
    onSelectCategory(category.name);
  };
  useEffect(() => {
    setSelectedCategory(categories[0].name);
  }, [path]);

  return (
    <Box bg="#181A24" p={4} borderRadius="md">
      <Text fontSize="2xl" mb={4} color="white">
        Popular
      </Text>
      <Wrap>
        {categories.map((category: any) => (
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
