import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FaMapMarkerAlt, FaTrophy, FaRocket } from "react-icons/fa";

const MyBets = () => {
  const bets = [
    {
      location: "Downtown",
      status: "Won",
      amount: "345,5 T",
      icon: FaRocket,
      label: "Crush",
    },
    {
      location: "Downtown",
      status: "Won",
      amount: "345,5 T",
      icon: FaRocket,
      label: "Crush",
    },
    {
      location: "Downtown",
      status: "Won",
      amount: "345,5 T",
      icon: FaRocket,
      label: "Crush",
    },
  ];

  return (
    <Box bg="gray.800" p={6} borderRadius="md" boxShadow="lg" color="white">
      <Text fontSize="2xl" mb={4}>
        My bets
      </Text>
      {bets.map((bet, index) => (
        <Flex
          key={index}
          alignItems="center"
          mb={4}
          p={4}
          bg="gray.700"
          borderRadius="md"
        >
          <Icon as={FaMapMarkerAlt} w={6} h={6} mr={4} />
          <Text flex="1">{bet.location}</Text>
          <Text flex="1" color="green.400">
            {bet.status}
          </Text>
          <Text flex="1">{bet.amount}</Text>
          <Icon as={bet.icon} w={6} h={6} mr={2} />
          <Text>{bet.label}</Text>
        </Flex>
      ))}
    </Box>
  );
};
export default MyBets;
