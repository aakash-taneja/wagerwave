use std::collections::HashMap;

use crate::error::ContractError;
use crate::state::{Bet, BettingEvent, User, BETS, EVENTS, STATE, USERS};
use cosmwasm_std::{BankMsg, Coin, Decimal, Env, Fraction, StdResult, Uint128};
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
    title: String,
    description: String,
    options: Vec<String>,
    end_time: u64,
    odds: Vec<Decimal>,
    categories: Vec<String>,
    sub_categories: Vec<String>,
) -> Result<Response, ContractError> {
    let state = STATE.load(deps.storage)?;
    let event = BettingEvent {
        id: state.event_count,
        creator: info.sender.clone(),
        title,
        description,
        options,
        end_time,
        resolved: false,
        winning_option: None,
        odds,
        categories,
        sub_categories,
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
    env: Env,
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
    if !event.options.contains(&winning_option) {
        return Err(ContractError::InvalidWinningOption {});
    }
    event.winning_option = Some(winning_option.clone());
    event.resolved = true;
    EVENTS.save(deps.storage, event_id, &event)?;

    let messages = distribute_funds(deps, env, event_id, &winning_option)?;

    Ok(Response::new()
        .add_attribute("method", "resolve_event")
        .add_attribute("event_id", event_id.to_string())
        .add_attribute("winning_option", winning_option)
        .add_messages(messages))
}
fn add_coins(coin1: Coin, coin2: Coin) -> StdResult<Coin> {
    if coin1.denom != coin2.denom {
        // Return an error if the denominations do not match
        return Err(cosmwasm_std::StdError::generic_err(
            "Denominations do not match",
        ));
    }

    // Add the amounts
    let total_amount = coin1.amount + coin2.amount;

    // Return the result as a new Coin
    Ok(Coin {
        denom: coin1.denom,
        amount: total_amount,
    })
}

fn distribute_funds(
    deps: DepsMut,
    env: Env,
    event_id: u64,
    winning_option: &str,
) -> StdResult<Vec<BankMsg>> {
    let event = EVENTS.load(deps.storage, event_id)?;
    let winning_index = event
        .options
        .iter()
        .position(|o| o == winning_option)
        .unwrap();
    let winning_odds: Decimal = event.odds[winning_index];

    // Calculate total bets for each option
    let mut total_bets: HashMap<String, Coin> = HashMap::new();
    let mut winning_addresses = Vec::new();
    for bet in BETS
        .prefix(event_id)
        .range(deps.storage, None, None, cosmwasm_std::Order::Ascending)
    {
        let (user, _) = bet?;
        let bet_info = BETS.load(deps.storage, (event_id, &user))?;
        let option = bet_info.option.clone();
        total_bets
            .entry(option.clone())
            .and_modify(|amount| {
                *amount = add_coins(amount.clone(), bet_info.amount.clone()).unwrap()
            })
            .or_insert(bet_info.amount.clone());
        if option == winning_option {
            winning_addresses.push((user, bet_info.amount));
        }
    }
    let mut messages: Vec<BankMsg> = Vec::new();

    // Calculate and distribute winnings
    for (addr, bet_amount) in winning_addresses {
        let share: Uint128 = bet_amount
            .amount
            .checked_multiply_ratio(winning_odds.numerator(), winning_odds.denominator())
            .unwrap();

        let msg = BankMsg::Send {
            to_address: addr.to_string(),
            amount: vec![Coin {
                denom: "untrn".to_string(),
                amount: share,
            }],
        };
        messages.push(msg);
    }

    Ok(messages)
}

pub fn try_update_odds(
    deps: DepsMut,
    info: MessageInfo,
    event_id: u64,
    new_odds: Vec<Decimal>,
) -> Result<Response, ContractError> {
    let mut event = EVENTS.load(deps.storage, event_id)?;
    if event.creator != info.sender {
        return Err(ContractError::Unauthorized {});
    }
    event.odds = new_odds;
    EVENTS.save(deps.storage, event_id, &event)?;
    Ok(Response::new().add_attribute("method", "update_odds"))
}
