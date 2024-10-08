use crate::msg::{BetResponse, EventResponse, UserResponse};
use crate::state::{BETS, EVENTS, USERS};
use cosmwasm_std::Order;
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
        title: event.title,
        description: event.description,
        options: event.options,
        end_time: event.end_time,
        resolved: event.resolved,
        winning_option: event.winning_option,
        odds: event.odds,
        categories: event.categories,
        sub_categories: event.sub_categories,
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

pub fn query_all_events(deps: Deps) -> StdResult<Vec<EventResponse>> {
    let events: Vec<EventResponse> = EVENTS
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| {
            let (_, event) = item?;
            Ok(EventResponse {
                id: event.id,
                creator: event.creator,
                title: event.title,
                description: event.description,
                options: event.options,
                end_time: event.end_time,
                resolved: event.resolved,
                winning_option: event.winning_option,
                odds: event.odds,
                categories: event.categories,
                sub_categories: event.sub_categories,
            })
        })
        .collect::<StdResult<Vec<_>>>()?;
    Ok(events)
}

pub fn query_all_bets_for_event(deps: Deps, event_id: u64) -> StdResult<Vec<BetResponse>> {
    let bets: Vec<BetResponse> = BETS
        .prefix(event_id)
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| {
            let (_, bet) = item?;
            Ok(BetResponse {
                event_id: bet.event_id,
                user: bet.user,
                option: bet.option,
                amount: bet.amount,
            })
        })
        .collect::<StdResult<Vec<_>>>()?;
    Ok(bets)
}
