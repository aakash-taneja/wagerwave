use crate::error::ContractError;
use crate::state::{Bet, BettingEvent, User, BETS, EVENTS, STATE, USERS};
#[cfg(not(feature = "library"))]
use cosmwasm_std::{DepsMut, MessageInfo, Response};

pub fn try_register_user(deps: DepsMut, info: MessageInfo) -> Result<Response, ContractError> {
    let user = User {
        address: info.sender.clone(),
        registered: true,
    };
    USERS.save(deps.storage, &info.sender, &user)?;
    Ok(Response::new().add_attribute("method", "register_user"))
}

pub fn try_create_event(
    deps: DepsMut,
    info: MessageInfo,
    description: String,
    options: Vec<String>,
    end_time: u64,
) -> Result<Response, ContractError> {
    let state = STATE.load(deps.storage)?;
    let event = BettingEvent {
        id: state.event_count,
        creator: info.sender.clone(),
        description,
        options,
        end_time,
        resolved: false,
        winning_option: None,
    };
    EVENTS.save(deps.storage, state.event_count, &event)?;
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        state.event_count += 1;
        Ok(state)
    })?;
    Ok(Response::new().add_attribute("method", "create_event"))
}

pub fn try_place_bet(
    deps: DepsMut,
    info: MessageInfo,
    event_id: u64,
    option: String,
) -> Result<Response, ContractError> {
    let event = EVENTS.load(deps.storage, event_id)?;
    if !event.options.contains(&option) {
        return Err(ContractError::InvalidBettingOption {});
    }
    let bet = Bet {
        event_id,
        user: info.sender.clone(),
        option,
        amount: info.funds[0].clone(),
    };
    BETS.save(deps.storage, (event_id, &info.sender), &bet)?;
    Ok(Response::new().add_attribute("method", "place_bet"))
}

pub fn try_resolve_event(
    deps: DepsMut,
    info: MessageInfo,
    event_id: u64,
    winning_option: String,
) -> Result<Response, ContractError> {
    let mut event = EVENTS.load(deps.storage, event_id)?;
    if event.resolved {
        return Err(ContractError::EventAlreadyResolved {});
    }
    if event.creator != info.sender {
        return Err(ContractError::Unauthorized {});
    }
    event.winning_option = Some(winning_option);
    event.resolved = true;
    EVENTS.save(deps.storage, event_id, &event)?;
    Ok(Response::new().add_attribute("method", "resolve_event"))
}
