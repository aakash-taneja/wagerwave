import { Layout } from "@/components";
import BodyComponent from "@/components/BodyComponent";
import CategoryComponent from "@/components/CategoryComponent";
import Navbar from "@/components/NavBar";
import NavRight from "@/components/NavRight";
import { Box } from "@chakra-ui/react";

export default function Home() {
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
        navRight={<NavRight />}
        body={<BodyComponent />}
      />
    </>
  );
}
