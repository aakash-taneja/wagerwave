import { Flex } from "@chakra-ui/react";
import { Box } from "@interchain-ui/react";
import { SubCategoryProvider } from "../SubCategoryContext";

export function Layout({ navtop, navLeft, body, navRight }: any) {
  return (
    <SubCategoryProvider>
      <Box bg={"#181A24"}>
        {/* Top Section */}
        {navtop}

        {/* Bottom Section */}
        <Flex direction="row" h="calc(100vh - 64px)" bg="#181A24">
          {/* Left Section */}
          <Box flex="1" bg="#181A24" p={4} m={2} boxShadow="md">
            {navLeft}
          </Box>

          {/* Middle Section */}
          <Box flex="3" bg="#181A24" p={4} m={2} boxShadow="md">
            {body}
          </Box>

          {/* Right Section */}
          <Box flex="1" bg="#181A24" p={4} m={2} boxShadow="md">
            {navRight}
          </Box>
        </Flex>
      </Box>
    </SubCategoryProvider>
  );
}
