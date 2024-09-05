import { Layout } from "@/components";
import BodyComponent from "@/components/BodyComponent";
import CategoryComponent from "@/components/CategoryComponent";
import Navbar from "@/components/NavBar";
import NavRight from "@/components/NavRight";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const NavLeft = () => {
    return (
      <Box bg={"#181A24"} height={"100%"}>
        <CategoryComponent />
      </Box>
    );
  };

  return (
    <>
      <Layout
        navtop={<Navbar />}
        navLeft={<NavLeft />}
        navRight={
          <NavRight
            match={selectedMatch}
            option={selectedOption}
            onSelectOption={setSelectedOption}
          />
        }
        body={
          <BodyComponent
            onSelectMatch={setSelectedMatch}
            onSelectOption={setSelectedOption}
          />
        }
      />
    </>
  );
}
