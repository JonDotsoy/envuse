use super::super::node::Node;
use super::super::node_parser::NodeParser;
use super::super::token::PointerContext;
use super::super::ErrorKind;

pub struct Document {}
pub struct DocumentParser {}

impl NodeParser for DocumentParser {
    fn parse<'a>(
        &self,
        _payload: &'a [u8],
        _pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        Err(ErrorKind::UnknownError(Box::new("no valid")))
    }
}
