import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Popular from "./Popular";
import GridItem from "./GridItem";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import MatchCard from "./MatchCard";
import { useRouter } from "next/router";
import { useSubCategory } from "./SubCategoryContext";

const BodyComponent = ({ onSelectMatch, onSelectOption }: any) => {
  const { selectedSubCategory, setSelectedSubCategory } = useSubCategory();
  const [selectedCategory, setSelectedCategory] = useState("cricket");
  const [matches, setMatches] = useState<any>({});
  const router = useRouter();

  const fetchEvents = async () => {
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
      const query = { get_all_events: {} };
      const result = await client.queryContractSmart(
        "neutron1gh09zucan3z7pcrltyjhkpxmwz9ns2x2prackmds9e4kd2v08uhqmh365j",
        query
      );
      // console.log(result);
      const transformedMatches = transformEventsToMatches(
        result,
        selectedCategory
      );
      console.log(transformedMatches);
      setMatches(transformedMatches);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMatchClick = async (match: any) => {
    console.log("clicked");
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
      const query = { get_event: { event_id: match.id } };
      const result = await client.queryContractSmart(
        "neutron1gh09zucan3z7pcrltyjhkpxmwz9ns2x2prackmds9e4kd2v08uhqmh365j",
        query
      );
      console.log(result);
      onSelectMatch(result);
      onSelectOption(null);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBet = async () => {
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
      const query = { get_all_bet: { event_id: 0 } };
      const result = await client.queryContractSmart(
        "neutron1gh09zucan3z7pcrltyjhkpxmwz9ns2x2prackmds9e4kd2v08uhqmh365j",
        query
      );
      console.log(result);
      // setBet(result);
      // setError(null);
    } catch (err) {
      console.log(err);
      // setError(err.message);
      // setBet(null);
    }
  };

  const transformEventsToMatches = (events: any, category: string) => {
    console.log("events raw", events);
    return events
      .filter(
        (event: any) =>
          event.categories[0].toLowerCase() === category.toLowerCase() &&
          event.resolved == false
      )
      .reduce((acc: any, event: any) => {
        console.log(event);
        const subCategory = event.sub_categories[0].toLowerCase();
        if (!acc[subCategory]) {
          acc[subCategory] = [];
        }
        acc[subCategory].push({
          id: event.id,
          title: event.title,
          team1: { name: event.options[0], logo: "team1.svg" }, // Adjust as needed
          team2: { name: event.options[1], logo: "team2.svg" }, // Adjust as needed
          odds: { team1: event.odds[0], team2: event.odds[1] }, // Adjust as needed
          resolved: event.resolved,
        });
        return acc;
      }, {});
  };

  useEffect(() => {
    const path = router.pathname.substring(1); // Remove leading slash
    setSelectedCategory(path);
  }, [router.pathname]);

  return (
    <Box p={4} bg={"#181A24"}>
      <Grid templateColumns="repeat(3, 1fr)" gap={3}>
        <GridItem
          image="herogrid1.png"
          title="Score Big with Cricket Bets"
          description="Bet on your favorite cricket matches. Join now and experience the thrill!"
        />
        <Grid templateRows="repeat(2,1fr)" gap={3}>
          <GridItem
            image="herogrid2.png"
            title="Kick Off Your Winning Streak"
            description="Place your bets on top football teams and win big."
          />
          <GridItem
            image="herogrid3.png"
            title="Bet with Bitcoin, Win Big"
            description="Join now and enjoy seamless crypto betting!"
          />
        </Grid>
        <GridItem
          image="herogrid4.png"
          title="Gallop to Victory"
          description="Join now and feel the rush of horse racing!"
        />
      </Grid>

      <Popular />
      <Flex flexWrap={"wrap"} justifyContent={"space-between"}>
        {matches[selectedSubCategory.toLocaleLowerCase()]?.map(
          (match: any, index: any) => (
            <MatchCard
              key={index}
              match={match}
              onClick={() => {
                handleMatchClick(match);
              }}
            />
          )
        )}
      </Flex>
      <Button onClick={fetchEvents}>Query Events</Button>
    </Box>
  );
};
export default BodyComponent;
