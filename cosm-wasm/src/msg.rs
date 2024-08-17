use cosmwasm_schema::QueryResponses;
use cosmwasm_std::{Addr, Coin, Decimal};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// Define the messages that the contract can handle
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub owner: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    RegisterUser {},
    CreateEvent {
        description: String,
        options: Vec<String>,
        end_time: u64,
        odds: Vec<Decimal>,
    },
    PlaceBet {
        event_id: u64,
        option: String,
    },
    ResolveEvent {
        event_id: u64,
        winning_option: String,
    },
    UpdateOdds {
        event_id: u64,
        new_odds: Vec<Decimal>,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, QueryResponses)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    #[returns(UserResponse)]
    GetUser { address: Addr },
    #[returns(EventResponse)]
    GetEvent { event_id: u64 },
    #[returns(BetResponse)]
    GetBet { event_id: u64, user: Addr },
}

// Define the response structures for queries
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct UserResponse {
    pub address: Addr,
    pub registered: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct EventResponse {
    pub id: u64,
    pub creator: Addr,
    pub description: String,
    pub options: Vec<String>,
    pub end_time: u64,
    pub resolved: bool,
    pub winning_option: Option<String>,
    pub odds: Vec<Decimal>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BetResponse {
    pub event_id: u64,
    pub user: Addr,
    pub option: String,
    pub amount: Coin,
}
