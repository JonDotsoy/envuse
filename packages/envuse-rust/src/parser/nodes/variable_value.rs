use super::super::node_parser::NodeParser;
use crate::parser::error_kind::ErrorKind;
use crate::parser::node::Node;
use crate::parser::node_kind::NodeKind;
use crate::parser::token::{PointerContext, Token};

#[derive(Debug)]
pub struct VariableValue {
    pub source: Vec<u8>,
}

impl From<VariableValue> for NodeKind {
    fn from(v: VariableValue) -> Self {
        NodeKind::VariableValue(v)
    }
}

pub struct VariableValueParser;

impl NodeParser for VariableValueParser {
    fn parse<'a>(
        &self,
        payload: &'static [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let range_start = pointer_context.span_end.range.start;
        let range_end: usize;
        // let mut end_range = range_start;

        let mut index = range_start.clone();
        loop {
            if index + 1 > payload.len() {
                range_end = index;
                break;
            }
            let chunk_str = &payload[index..index + 1];

            if b"\n" == chunk_str {
                range_end = index;
                break;
            }

            pointer_context.move_columns(1);
            index = index + 1;
        }

        let source = payload[range_start..range_end].to_vec();

        Ok(Node(
            Token {
                span: pointer_context.to_span(),
            },
            NodeKind::from(VariableValue { source }),
        ))
    }
}
