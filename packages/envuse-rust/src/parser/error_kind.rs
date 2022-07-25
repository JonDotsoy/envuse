#[derive(Debug)]
pub enum ErrorKind {
    UnknownError(Box<&'static str>),
    NotMatchParser,
    UnexpectedToken_deprecated,
}
