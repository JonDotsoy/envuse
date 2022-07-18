use crate::parser::node_kind::NodeKind;
use crate::parser::token::Token;

use super::super::error_kind::ErrorKind;
use super::super::node::Node;
use super::super::node_parser::NodeParser;
use super::super::token::PointerContext;

#[derive(Debug)]
pub struct InlineComment {
    pub source: Vec<u8>,
}

impl From<InlineComment> for NodeKind {
    fn from(v: InlineComment) -> Self {
        Self::InlineComment(v)
    }
}

pub struct InlineCommentParser;

impl NodeParser for InlineCommentParser {
    fn parse<'a>(
        &self,
        payload: &'a [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let range_start = pointer_context.span_start.range.start;
        let range_end: usize;
        if b"#" != &payload[range_start..(range_start + 1)] {
            return Err(ErrorKind::UnexpectedToken);
        }

        let _index_end_inline_comment: usize = {
            let mut index = range_start + 1;

            loop {
                let fragment_str = &payload[index - 1..index];

                if fragment_str == b"\n" {
                    range_end = index - 1;
                    break;
                }

                pointer_context.move_columns(1);

                if index >= payload.len() {
                    range_end = index;
                    break;
                }

                index = index + 1;
            }

            index
        };

        let source = payload[range_start..range_end].to_vec();

        Ok(Node(
            Token {
                span: pointer_context.span_end.clone(),
            },
            NodeKind::from(InlineComment { source }),
        ))
    }
}
