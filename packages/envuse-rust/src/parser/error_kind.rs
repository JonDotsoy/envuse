use super::token::Token;


#[derive(Debug)]
pub enum ErrorKind {
    UnknownError(Box<&'static str>),
    NotMatchParser,
    UnexpectedToken(Token),
    #[deprecated]
    UnexpectedToken_deprecated,
}
