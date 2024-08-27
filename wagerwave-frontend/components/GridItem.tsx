import { Box, Button, Text } from "@chakra-ui/react";

const GridItem = ({ image, title, description }: any) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      backgroundImage={image}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      backgroundPosition={"center top"}
    >
      <Box
        backgroundColor={"rgba(0, 0, 0, 0.5)"}
        p={4}
        textColor={"#fff"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box>
          <Text mt={2} fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          <Text mt={2}>{description}</Text>
        </Box>
        <Button
          mt={4}
          backgroundColor={"rgba(100,100, 100, 0.8)"}
          borderColor={"#fff"}
          borderWidth={"1px"}
          width={"fit-content"}
        >
          <Text zIndex={"100"} color={"#fff"}>
            Play Now
          </Text>
        </Button>
      </Box>
    </Box>
  );
};
export default GridItem;
