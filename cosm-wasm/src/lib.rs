pub mod contract;
mod error;
pub mod execute;
pub mod helpers;
pub mod msg;
pub mod query;
pub mod state;
// pub mod unit_tests;

pub use crate::error::ContractError;

// - name: testuser
//   type: local
//   address: inj1nllj659wl0ywqrstvmt83wwh5mvacu73hxh8x3
//   pubkey: '{"@type":"/injective.crypto.v1beta1.ethsecp256k1.PubKey","key":"AvKxK5w1a7DXnnWA1VCc9TXQE9HxDKJbUqhxNUHi2V2B"}'
//   mnemonic: ""
