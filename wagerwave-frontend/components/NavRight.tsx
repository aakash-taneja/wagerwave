import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

const NavRight = () => {
  const [amount, setAmount] = useState("");

  return (
    <Box
      bg="#181A24"
      p={6}
      borderRadius="md"
      border={"1px solid white"}
      color="white"
      flex={1}
      mt={4}
      mr={4}
    >
      <Text fontSize="2xl" mb={4}>
        Place your bet
      </Text>
      <Text mb={2}>Enter amount</Text>
      <Input
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={4}
      />
      <Flex justifyContent="space-between" mb={4}>
        <Button onClick={() => setAmount("100")}>$100</Button>
        <Button onClick={() => setAmount("200")}>$200</Button>
        <Button onClick={() => setAmount("500")}>$500</Button>
        {/* <Button onClick={() => setAmount("650")}>$650</Button> */}
      </Flex>
      <Button
        colorScheme="teal"
        size="lg"
        width="full"
        // onClick={handleCreateBet}
      >
        Place bet
      </Button>
      {/* <MyBets /> */}
    </Box>
  );
};
export default NavRight;
