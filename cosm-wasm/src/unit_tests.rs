use super::*;
use contract::{execute, instantiate, query};
use cosmwasm_std::testing::{message_info, mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{attr, coins, from_json, Addr, Decimal, DepsMut, MessageInfo};
use msg::{EventResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use state::{Bet, State, User, BETS, EVENTS, STATE, USERS};

fn init_state(deps: DepsMut) {
    let state = State {
        owner: Addr::unchecked("creator"),
        event_count: 0,
    };
    STATE.save(deps.storage, &state).unwrap();
}

#[test]
fn test_initialization() {
    let mut deps = mock_dependencies();

    let msg = InstantiateMsg {
        owner: Addr::unchecked("creator"),
    };
    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: coins(1000, "orai"),
    };

    // Call instantiate function
    let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

    // Check if the response contains the correct attributes
    assert_eq!(res.attributes, vec![attr("method", "instantiate")]);

    // Check if the state is correctly initialized
    let state = STATE.load(&deps.storage).unwrap();
    assert_eq!(state.owner, Addr::unchecked("creator"));
    assert_eq!(state.event_count, 0);
}

#[test]
fn register_user() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    let info = MessageInfo {
        sender: Addr::unchecked("user1"),
        funds: vec![],
    };

    let msg = ExecuteMsg::RegisterUser {};

    // Call execute function
    let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

    // Check if the response contains the correct attributes
    assert_eq!(res.attributes, vec![attr("method", "register_user")]);

    // Check if the user is registered
    let user = USERS
        .load(&deps.storage, &Addr::unchecked("user1"))
        .unwrap();
    assert_eq!(user.address, Addr::unchecked("user1"));
    assert!(user.registered);
}

#[test]
fn create_event() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };

    let msg = ExecuteMsg::CreateEvent {
        description: "Test Event".to_string(),
        options: vec!["Option1".to_string(), "Option2".to_string()],
        end_time: 1234567890,
        odds: vec![Decimal::percent(150), Decimal::percent(250)],
    };

    // Call execute function
    let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

    // Check if the response contains the correct attributes
    assert_eq!(res.attributes, vec![attr("method", "create_event")]);

    // Check if the event is created
    let event = EVENTS.load(&deps.storage, 0).unwrap();
    assert_eq!(event.creator, Addr::unchecked("creator"));
    assert_eq!(event.description, "Test Event");
    assert_eq!(
        event.options,
        vec!["Option1".to_string(), "Option2".to_string()]
    );
    assert_eq!(event.end_time, 1234567890);
    assert_eq!(
        event.odds,
        vec![Decimal::percent(150), Decimal::percent(250)]
    );
    assert!(!event.resolved);
    assert!(event.winning_option.is_none());
}

#[test]
fn place_bet() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    // Create an event first
    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };

    let msg = ExecuteMsg::CreateEvent {
        description: "Test Event".to_string(),
        options: vec!["Option1".to_string(), "Option2".to_string()],
        end_time: 1234567890,
        odds: vec![Decimal::percent(150), Decimal::percent(250)],
    };

    execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

    // Place a bet
    let bet_info = MessageInfo {
        sender: Addr::unchecked("user1"),
        funds: coins(1000, "orai"),
    };

    let bet_msg = ExecuteMsg::PlaceBet {
        event_id: 0,
        option: "Option1".to_string(),
    };

    let res = execute(deps.as_mut(), mock_env(), bet_info, bet_msg).unwrap();

    // Check if the response contains the correct attributes
    assert_eq!(res.attributes, vec![attr("method", "place_bet")]);

    // Check if the bet is placed
    let bet = BETS
        .load(&deps.storage, (0, &Addr::unchecked("user1")))
        .unwrap();
    assert_eq!(bet.event_id, 0);
    assert_eq!(bet.user, Addr::unchecked("user1"));
    assert_eq!(bet.option, "Option1");
    assert_eq!(bet.amount, coins(1000, "orai")[0]);
}

#[test]
fn resolve_event() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    // Create an event first
    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };

    let msg = ExecuteMsg::CreateEvent {
        description: "Test Event".to_string(),
        options: vec!["Option1".to_string(), "Option2".to_string()],
        end_time: 1234567890,
        odds: vec![Decimal::percent(150), Decimal::percent(250)],
    };

    execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

    // Resolve the event
    let resolve_info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };

    let resolve_msg = ExecuteMsg::ResolveEvent {
        event_id: 0,
        winning_option: "Option1".to_string(),
    };

    let res = execute(deps.as_mut(), mock_env(), resolve_info, resolve_msg).unwrap();

    // Check if the response contains the correct attributes
    assert_eq!(res.attributes, vec![attr("method", "resolve_event")]);

    // Check if the event is resolved
    let event = EVENTS.load(&deps.storage, 0).unwrap();
    assert!(event.resolved);
    assert_eq!(event.winning_option, Some("Option1".to_string()));
}

#[test]
fn update_odds() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    // Create an event first
    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };

    let msg = ExecuteMsg::CreateEvent {
        description: "Test Event".to_string(),
        options: vec!["Option1".to_string(), "Option2".to_string()],
        end_time: 1234567890,
        odds: vec![Decimal::percent(150), Decimal::percent(250)],
    };

    execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

    // Update the odds
    let update_info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };

    let update_msg = ExecuteMsg::UpdateOdds {
        event_id: 0,
        new_odds: vec![Decimal::percent(180), Decimal::percent(280)],
    };

    let res = execute(deps.as_mut(), mock_env(), update_info, update_msg).unwrap();

    // Check if the response contains the correct attributes
    assert_eq!(res.attributes, vec![attr("method", "update_odds")]);

    // Check if the odds are updated
    let event = EVENTS.load(&deps.storage, 0).unwrap();
    assert_eq!(
        event.odds,
        vec![Decimal::percent(180), Decimal::percent(280)]
    );
}

#[test]
fn query_user() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    // Register a user
    let info = MessageInfo {
        sender: Addr::unchecked("user1"),
        funds: vec![],
    };
    let msg = ExecuteMsg::RegisterUser {};
    execute(deps.as_mut(), mock_env(), info, msg).unwrap();

    // Query the user
    let query_msg = QueryMsg::GetUser {
        address: Addr::unchecked("user1"),
    };
    let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
    let user: User = from_json(&res).unwrap();

    // Check if the user is correctly returned
    assert_eq!(user.address, Addr::unchecked("user1"));
    assert!(user.registered);
}
#[test]
fn query_event() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    // Create an event
    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };
    let msg = ExecuteMsg::CreateEvent {
        description: "Test Event".to_string(),
        options: vec!["Option1".to_string(), "Option2".to_string()],
        end_time: 1234567890,
        odds: vec![Decimal::percent(150), Decimal::percent(250)],
    };
    execute(deps.as_mut(), mock_env(), info, msg).unwrap();

    // Query the event
    let query_msg = QueryMsg::GetEvent { event_id: 0 };
    let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
    let event: EventResponse = from_json(&res).unwrap();

    // Check if the event is correctly returned
    assert_eq!(event.id, 0);
    assert_eq!(event.creator, Addr::unchecked("creator"));
    assert_eq!(event.description, "Test Event");
    assert_eq!(
        event.options,
        vec!["Option1".to_string(), "Option2".to_string()]
    );
    assert_eq!(event.end_time, 1234567890);
    assert_eq!(
        event.odds,
        vec![Decimal::percent(150), Decimal::percent(250)]
    );
    assert!(!event.resolved);
    assert!(event.winning_option.is_none());
}

#[test]
fn query_bet() {
    let mut deps = mock_dependencies();
    init_state(deps.as_mut());

    // Create an event
    let info = MessageInfo {
        sender: Addr::unchecked("creator"),
        funds: vec![],
    };
    let msg = ExecuteMsg::CreateEvent {
        description: "Test Event".to_string(),
        options: vec!["Option1".to_string(), "Option2".to_string()],
        end_time: 1234567890,
        odds: vec![Decimal::percent(150), Decimal::percent(250)],
    };
    execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

    // Place a bet
    let bet_info = MessageInfo {
        sender: Addr::unchecked("user1"),
        funds: coins(1000, "orai"),
    };
    let bet_msg = ExecuteMsg::PlaceBet {
        event_id: 0,
        option: "Option1".to_string(),
    };
    execute(deps.as_mut(), mock_env(), bet_info, bet_msg).unwrap();

    // Query the bet
    let query_msg = QueryMsg::GetBet {
        event_id: 0,
        user: Addr::unchecked("user1"),
    };
    let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
    let bet: Bet = from_json(&res).unwrap();

    // Check if the bet is correctly returned
    assert_eq!(bet.event_id, 0);
    assert_eq!(bet.user, Addr::unchecked("user1"));
    assert_eq!(bet.option, "Option1");
    assert_eq!(bet.amount, coins(1000, "orai")[0]);
}
