use super::*;
use contract::instantiate;
use cosmwasm_std::testing::{message_info, mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{attr, coins, Addr, MessageInfo};
use msg::InstantiateMsg;
use state::STATE;

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
