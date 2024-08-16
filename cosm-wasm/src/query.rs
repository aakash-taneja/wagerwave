use crate::msg::{BetResponse, EventResponse, UserResponse};
use crate::state::{BETS, EVENTS, USERS};
#[cfg(not(feature = "library"))]
use cosmwasm_std::{Addr, Deps, StdResult};

// Methods for query entry points
pub fn query_user(deps: Deps, address: Addr) -> StdResult<UserResponse> {
    let user = USERS.load(deps.storage, &address)?;
    Ok(UserResponse {
        address: user.address,
        registered: user.registered,
    })
}

pub fn query_event(deps: Deps, event_id: u64) -> StdResult<EventResponse> {
    let event = EVENTS.load(deps.storage, event_id)?;
    Ok(EventResponse {
        id: event.id,
        creator: event.creator,
        description: event.description,
        options: event.options,
        end_time: event.end_time,
        resolved: event.resolved,
        winning_option: event.winning_option,
    })
}

pub fn query_bet(deps: Deps, event_id: u64, user: Addr) -> StdResult<BetResponse> {
    let bet = BETS.load(deps.storage, (event_id, &user))?;
    Ok(BetResponse {
        event_id: bet.event_id,
        user: bet.user,
        option: bet.option,
        amount: bet.amount,
    })
}
