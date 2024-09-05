import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import { useState } from "react";
import Popular from "./Popular";
import GridItem from "./GridItem";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import MatchCard from "./MatchCard";

const BodyComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("Soccer");

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
      const query = { get_all_bets: {} };
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
      const query = { get_all_bets: {} };
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

  const matches: any = {
    Soccer: [
      {
        team1: { name: "Team A", logo: "team1.svg" },
        team2: { name: "Team B", logo: "team2.svg" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      {
        team1: { name: "Team A", logo: "team3.svg" },
        team2: { name: "Team B", logo: "team4.svg" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      {
        team1: { name: "Team A", logo: "team5.svg" },
        team2: { name: "Team B", logo: "team6.svg" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      {
        team1: { name: "Team A", logo: "team1.svg" },
        team2: { name: "Team B", logo: "team2.svg" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      {
        team1: { name: "Team A", logo: "team3.svg" },
        team2: { name: "Team B", logo: "team4.svg" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      {
        team1: { name: "Team A", logo: "team5.svg" },
        team2: { name: "Team B", logo: "team6.svg" },
        odds: { team1: 1.5, team2: 2.5 },
      },
    ],
    Basketball: [
      {
        team1: { name: "Team A", logo: "logoA.png" },
        team2: { name: "Team B", logo: "logoB.png" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      // Add more matches here
    ],
    Cricket: [
      {
        team1: { name: "Team A", logo: "logoA.png" },
        team2: { name: "Team B", logo: "logoB.png" },
        odds: { team1: 1.5, team2: 2.5 },
      },
      // Add more matches here
    ],
    // Add more categories and matches here
  };

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

      <Popular onSelectCategory={setSelectedCategory} />
      <Flex flexWrap={"wrap"} justifyContent={"space-between"}>
        {matches[selectedCategory]?.map((match: any, index: any) => (
          <MatchCard key={index} match={match} />
        ))}
      </Flex>
      <Button onClick={fetchBet}>Query Events</Button>
      <Button onClick={fetchBet}>Query bets</Button>
    </Box>
  );
};
export default BodyComponent;
