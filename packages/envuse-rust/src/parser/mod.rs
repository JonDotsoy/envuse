use self::error_kind::ErrorKind;
use self::node::Node;
use self::node_parser::NodeParser;
use self::nodes::document::DocumentParser;
use self::token::PointerContext;

pub mod error_kind;
pub mod iter_parsers;
pub mod node;
pub mod node_kind;
pub mod node_parser;
pub mod nodes;
pub mod payload;
pub mod token;
pub mod utils;

/// Parse source
pub fn parse(payload: &[u8]) -> Result<Node, ErrorKind> {
    let mut pointer_context = PointerContext::start_zero();

    let doc = DocumentParser {};
    doc.parse(&payload, &mut pointer_context)
}
