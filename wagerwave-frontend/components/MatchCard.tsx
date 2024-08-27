import { Box, Flex, Image, Text, Icon } from "@chakra-ui/react";
import { FaRegFutbol } from "react-icons/fa"; // Football icon
import { MdOutlineSportsSoccer } from "react-icons/md"; // Soccer ball icon

const MatchCard = ({ match }: any) => {
  const borderColor = "gray.200"; // Example border color
  const primaryColor = "blue.600"; // Example primary color
  const secondaryColor = "red.500"; // Example secondary color

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={12}
      bg="gray.800"
      mb={4}
      color={"white"}
      borderColor={borderColor}
      w={"49%"}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Image src={match.team1.logo} alt={match.team1.name} boxSize="50px" />
        <Text ml={4} fontSize="lg" fontWeight="bold" color={primaryColor}>
          {match.team1.name}
        </Text>
        <Text mx={2}>vs</Text>
        <Text mr={4} fontSize="lg" fontWeight="bold" color={secondaryColor}>
          {match.team2.name}
        </Text>
        <Image src={match.team2.logo} alt={match.team2.name} boxSize="50px" />
      </Flex>
      <Flex justifyContent="space-between" mt={4}>
        <Text>Odds: {match.odds.team1}</Text>
        <Text>Odds: {match.odds.team2}</Text>
      </Flex>
    </Box>
  );
};

export default MatchCard;
