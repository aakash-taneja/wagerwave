import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import Decimal from "decimal.js";
import { useEffect, useState } from "react";

const BetModal = ({ isOpen, onClose }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endTime, setEndTime] = useState<number>(0);
  const [odds, setOdds] = useState(["", ""]);
  const [categories, setCategories] = useState([""]);
  const [subCategories, setSubCategories] = useState([""]);

  useEffect(() => {
    const defaultEndTime = Math.floor(Date.now() / 1000) + 3600;
    setEndTime(defaultEndTime);
  }, []);

  const { connect, disconnect, isWalletConnected, wallet }: any =
    useChain("neutrontestnet");

  const handleCreateBet = () => {
    const decimalOdds = odds.map((odd) => new Decimal(odd));
    console.log(
      "Creating the bet...",
      title,
      description,
      options,
      endTime,
      decimalOdds,
      categories,
      subCategories
    );
    createBet(
      wallet,
      title,
      description,
      options,
      endTime,
      decimalOdds,
      categories,
      subCategories
    );
    onClose();
  };

  const createBet = async (
    wallet: any,
    title: string,
    description: string,
    options: string[],
    endTime: number,
    odds: Decimal[],
    categories: string[],
    subCategories: string[]
  ) => {
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
    console.log("inside createBet", client);

    const msg = {
      create_event: {
        title,
        description,
        options,
        end_time: endTime,
        odds,
        categories,
        sub_categories: subCategories,
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

    console.log("Bet created:", result);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Bet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Options</FormLabel>
            <Input
              value={options[0]}
              onChange={(e) => setOptions([e.target.value, options[1]])}
              placeholder="Option 1"
            />
            <Input
              value={options[1]}
              onChange={(e) => setOptions([options[0], e.target.value])}
              placeholder="Option 2"
              mt={2}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={new Date(endTime * 1000).toISOString().slice(0, -1)}
              onChange={(e) =>
                setEndTime(
                  Math.floor(new Date(e.target.value).getTime() / 1000)
                )
              }
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Odds</FormLabel>
            <Input
              value={odds[0]}
              onChange={(e) => setOdds([e.target.value, odds[1]])}
              placeholder="Odds for Option 1"
            />
            <Input
              value={odds[1]}
              onChange={(e) => setOdds([odds[0], e.target.value])}
              placeholder="Odds for Option 2"
              mt={2}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Categories</FormLabel>
            <Input
              value={categories.join(", ")}
              onChange={(e) => setCategories(e.target.value.split(", "))}
              placeholder="e.g., Sports, Politics"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Sub-Categories</FormLabel>
            <Input
              value={subCategories.join(", ")}
              onChange={(e) => setSubCategories(e.target.value.split(", "))}
              placeholder="e.g., Cricket, Football"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleCreateBet}>
            Create Bet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BetModal;
