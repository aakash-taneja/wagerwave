import {
  Box,
  Button,
  Flex,
  Input,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin, GasPrice, StdFee } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

const NavRight = ({ match, option, onSelectOption }: any) => {
  const [amount, setAmount] = useState("");
  const [isCreator, setIsCreator] = useState<boolean>(false);

  useEffect(() => {
    if (match) {
      setIsCreator(false);

      const checkCreator = async () => {
        const anyWindow = window as any;
        if (!anyWindow.getOfflineSignerAuto) {
          throw new Error("Keplr extension is not available");
        }

        const signer = await anyWindow.getOfflineSignerAuto("pion-1");
        const address = (await signer.getAccounts())[0].address;
        console.log("checking creator", address, match.creator, isCreator);
        if (address === match.creator) {
          setIsCreator(true);
        }
      };

      checkCreator();
    }
  }, [match]);

  const handlePlaceBet = async (
    eventID: number,
    selectedOption: string,
    amount: any
  ) => {
    if (!selectedOption || !amount) {
      console.error("Please select a match, an option, and enter an amount.");
      return;
    }
    try {
      const anyWindow = window as any;
      if (!anyWindow.getOfflineSignerAuto) {
        throw new Error("Keplr extension is not available");
      }

      const signer = await anyWindow.getOfflineSignerAuto("pion-1");

      const client: any = await SigningCosmWasmClient.connectWithSigner(
        "https://rpc-falcron.pion-1.ntrn.tech",
        signer,
        { gasPrice: GasPrice.fromString("0.0053untrn") }
      );
      const msg = {
        place_bet: {
          event_id: eventID,
          option: selectedOption,
        },
      };
      let fee: StdFee = {
        amount: [{ amount: "5000", denom: "untrn" }],
        gas: "1000000",
      };
      let send_amount: Coin = {
        amount: amount,
        denom: "untrn",
      };

      const address = (await signer.getAccounts())[0].address;
      // console.log(address);
      const result = await client.execute(
        address,
        "neutron1gh09zucan3z7pcrltyjhkpxmwz9ns2x2prackmds9e4kd2v08uhqmh365j",
        msg,
        fee,
        "",
        [send_amount]
      );
      console.log("Bet placed:", result);
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  };

  const handleResolveEvent = async (eventID: number, winningOption: string) => {
    const anyWindow = window as any;
    if (!anyWindow.getOfflineSignerAuto) {
      throw new Error("Keplr extension is not available");
    }

    const signer = await anyWindow.getOfflineSignerAuto("pion-1");

    const client: any = await SigningCosmWasmClient.connectWithSigner(
      "https://rpc-falcron.pion-1.ntrn.tech",
      signer,
      { gasPrice: GasPrice.fromString("0.0053untrn") }
    );
    const msg = {
      resolve_event: {
        event_id: eventID,
        winning_option: winningOption,
      },
    };
    const address = (await signer.getAccounts())[0].address;
    // console.log(address);
    const result = await client.execute(
      address,
      "neutron1gh09zucan3z7pcrltyjhkpxmwz9ns2x2prackmds9e4kd2v08uhqmh365j",
      msg,
      "auto"
    );

    console.log("winner created:", result);
  };

  return (
    match && (
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
        <Flex justifyContent="space-between" mb={4}>
          {match.options.map((optionsingle: any, index: any) => (
            <Tag
              key={index}
              size="lg"
              variant={optionsingle === option ? "solid" : "outline"}
              colorScheme="teal"
              cursor="pointer"
              onClick={() => onSelectOption(optionsingle)}
            >
              <TagLabel>{optionsingle}</TagLabel>
            </Tag>
          ))}
        </Flex>
        <Button
          colorScheme="teal"
          size="lg"
          width="full"
          onClick={() => {
            handlePlaceBet(match.id, option, amount);
          }}
        >
          Place bet
        </Button>
        {isCreator && (
          <Button
            colorScheme="teal"
            size="lg"
            width="full"
            mt={4}
            onClick={() => {
              handleResolveEvent(match.id, "india");
            }}
          >
            Resolve Event
          </Button>
        )}
        {/* <MyBets /> */}
      </Box>
    )
  );
};
export default NavRight;
