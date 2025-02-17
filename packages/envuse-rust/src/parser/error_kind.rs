use serde::Serialize;
use super::token::Token;


#[derive(Debug, Serialize)]
pub enum ErrorKind {
    UnknownError(Box<&'static str>),
    NotMatchParser,
    UnexpectedToken(Token),
    #[deprecated]
    UnexpectedToken_deprecated,
}
