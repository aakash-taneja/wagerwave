use crate::error::ContractError;
use crate::execute::{
    try_create_event, try_place_bet, try_register_user, try_resolve_event, try_update_odds,
};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::query::{query_bet, query_event, query_user};
use crate::state::{State, STATE};
#[cfg(not(feature = "library"))]
use cosmwasm_std::{
    entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        owner: msg.owner,
        event_count: 0,
    };
    STATE.save(deps.storage, &state)?;
    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::RegisterUser {} => try_register_user(deps, info),
        ExecuteMsg::CreateEvent {
            description,
            options,
            end_time,
            odds,
        } => try_create_event(deps, info, description, options, end_time, odds),
        ExecuteMsg::PlaceBet { event_id, option } => try_place_bet(deps, info, event_id, option),
        ExecuteMsg::ResolveEvent {
            event_id,
            winning_option,
        } => try_resolve_event(deps, info, event_id, winning_option),
        ExecuteMsg::UpdateOdds { event_id, new_odds } => {
            try_update_odds(deps, info, event_id, new_odds)
        }
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetUser { address } => to_json_binary(&query_user(deps, address)?),
        QueryMsg::GetEvent { event_id } => to_json_binary(&query_event(deps, event_id)?),
        QueryMsg::GetBet { event_id, user } => to_json_binary(&query_bet(deps, event_id, user)?),
    }
}
