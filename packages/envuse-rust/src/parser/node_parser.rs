use super::error_kind::ErrorKind;
use super::node::Node;
use super::token::PointerContext;

pub trait NodeParser {
    fn parse<'a>(
        &self,
        payload: &'static [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind>;
}
