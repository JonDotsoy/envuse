use serde::Serialize;

use super::super::iter_parsers::{iter_parsers, FnParser};
use super::super::node::Node;
use super::super::node_kind::NodeKind;
use super::super::node_parser::NodeParser;
use super::super::token::PointerContext;
use super::super::utils::trim::trim_spaces_and_newline;
use super::super::ErrorKind;
use super::inline_comment::InlineCommentParser;
use super::variable::VariableParser;

#[derive(Debug, Clone, Serialize)]
pub struct Document {
    pub nodes: Vec<Box<Node>>,
}

impl From<Document> for NodeKind {
    fn from(v: Document) -> Self {
        NodeKind::Document(v)
    }
}

pub struct DocumentParser;

impl NodeParser for DocumentParser {
    fn parse<'a>(
        &self,
        payload: &[u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let start_pointer_context = pointer_context.clone();
        trim_spaces_and_newline(payload, pointer_context);

        let mut nodes: Vec<Box<Node>> = vec![];

        let ref mut parsers_supported = FnParser::new_vec();

        parsers_supported.push(Box::new(InlineCommentParser));
        parsers_supported.push(Box::new(VariableParser));

        loop {
            match iter_parsers(payload, pointer_context, parsers_supported) {
                Some(node) => {
                    nodes.push(Box::new(node));
                    trim_spaces_and_newline(payload, pointer_context);
                    continue;
                }
                None => {
                    break;
                }
            }
        }

        Ok(Node(
            pointer_context.create_token(start_pointer_context),
            NodeKind::from(Document { nodes }),
        ))
    }
}
