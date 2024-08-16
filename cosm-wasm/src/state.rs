use cosmwasm_std::{Addr, Coin};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// Define the state for user onboarding
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct User {
    pub address: Addr,
    pub registered: bool,
}

// Define the state for a betting event
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BettingEvent {
    pub id: u64,
    pub creator: Addr,
    pub description: String,
    pub options: Vec<String>,
    pub end_time: u64,
    pub resolved: bool,
    pub winning_option: Option<String>,
}

// Define the state for a placed bet
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Bet {
    pub event_id: u64,
    pub user: Addr,
    pub option: String,
    pub amount: Coin,
}

// Define the state for the contract
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub owner: Addr,
    pub event_count: u64,
}

// Define storage items
pub const STATE: Item<State> = Item::new("state");
pub const USERS: Map<&Addr, User> = Map::new("users");
pub const EVENTS: Map<u64, BettingEvent> = Map::new("events");
pub const BETS: Map<(u64, &Addr), Bet> = Map::new("bets");
