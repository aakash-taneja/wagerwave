use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("User already registered")]
    UserAlreadyRegistered {},

    #[error("User not registered")]
    UserNotRegistered {},

    #[error("Event not found")]
    EventNotFound {},

    #[error("Event already resolved")]
    EventAlreadyResolved {},

    #[error("Betting option not valid")]
    InvalidBettingOption {},

    #[error("Bet already placed")]
    BetAlreadyPlaced {},

    #[error("Bet amount must be greater than zero")]
    InvalidBetAmount {},

    #[error("Event has not ended yet")]
    EventNotEnded {},

    #[error("Invalid winning option")]
    InvalidWinningOption {},
}
