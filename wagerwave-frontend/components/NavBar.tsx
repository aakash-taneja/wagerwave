import { Box, Button, Flex, Link, Text, useDisclosure } from "@chakra-ui/react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import {
  FaBasketballBall,
  FaBitcoin,
  FaHorseHead,
  FaMoneyBillWave,
  FaVoteYea,
} from "react-icons/fa";
import BetModal from "./Modal";
import { useRouter } from "next/router";

const Navbar = () => {
  const [address, setAddress] = useState<string>("");
  const { connect, disconnect, isWalletConnected, wallet }: any =
    useChain("neutrontestnet");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState<string>(
    router.pathname.substring(1) || "Sports"
  );

  useEffect(() => {
    const fetchAddress = async () => {
      const anyWindow = window as any;
      if (!anyWindow.getOfflineSignerAuto) {
        throw new Error("Keplr extension is not available");
      }

      const signer = await anyWindow.getOfflineSignerAuto("pion-1");
      const accounts = await signer.getAccounts();
      const add = accounts[0].address;
      setAddress(add);
      // console.log(add);
    };

    if (isWalletConnected) {
      fetchAddress();
    }
  }, [isWalletConnected]);
  useEffect(() => {
    setSelectedLink(router.pathname.substring(1) || "Sports");
  }, [router.pathname]);

  const links = [
    {
      name: "Sports",
      icon: FaBasketballBall,
      color: "orange",
      path: "/sports",
    },
    { name: "Racing", icon: FaHorseHead, color: "brown", path: "/racing" },
    {
      name: "Business",
      icon: FaMoneyBillWave,
      color: "green",
      path: "/business",
    },
    { name: "Politics", icon: FaVoteYea, color: "red", path: "/politics" },
    { name: "Crypto", icon: FaBitcoin, color: "yellow", path: "/crypto" },
  ];

  return (
    <Box bg="#181A24" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="white">
            WagerWave
          </Text>
        </Box>
        <Flex alignItems="center" gap={4}>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              px={4}
              py={2}
              rounded="md"
              _hover={{ textDecoration: "none", bg: "#2E3035" }}
              color={
                selectedLink === link.name.toLowerCase() ? "white" : "gray"
              }
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="120px"
              height="40px"
              onClick={() => setSelectedLink(link.name)}
            >
              <link.icon
                color={
                  selectedLink === link.name.toLowerCase() ? link.color : "gray"
                }
                style={{ marginRight: "8px" }}
              />
              {link.name}
            </Link>
          ))}
        </Flex>
        {isWalletConnected ? (
          <Box>
            <Button
              ml={4}
              colorScheme="teal"
              variant="solid"
              onClick={disconnect}
            >
              {`${address.slice(0, 5)}...${address.slice(-5)}`}
            </Button>
            <Button colorScheme="teal" onClick={onOpen} ml={4}>
              Create a bet
            </Button>
          </Box>
        ) : (
          <Button ml={4} colorScheme="teal" variant="solid" onClick={connect}>
            Connect Wallet
          </Button>
        )}
      </Flex>
      <BetModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;
