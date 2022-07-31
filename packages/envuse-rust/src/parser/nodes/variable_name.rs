use serde::Serialize;

use super::super::super::utils::try_slice::try_slice_by_size;
use super::super::node_kind::NodeKind;
use super::super::node_parser::NodeParser;
use super::super::token::Token;
use super::super::ErrorKind;
use super::super::Node;
use super::super::PointerContext;

#[derive(Debug, Clone, Serialize)]
pub struct VariableName {
    pub name: String,
}

impl From<VariableName> for NodeKind {
    fn from(v: VariableName) -> Self {
        NodeKind::VariableName(v)
    }
}

pub struct VariableNameParser;

impl NodeParser for VariableNameParser {
    fn parse<'a>(
        &self,
        payload: &'a [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let start = pointer_context.clone();
        let variable_range_start = pointer_context.current_position();
        let variable_range_end: usize;

        let is_byte_available = match try_slice_by_size(
            payload,
            pointer_context.current_position(),
            1,
        ) {
            Some(bytes) if bytes.len() == 1 => match bytes.get(0) {
                Some(byte) if matches!(byte, b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'_') => {
                    true
                }
                _ => false,
            },
            _ => false,
        };

        if !is_byte_available {
            return Err(ErrorKind::UnexpectedToken(
                pointer_context.create_token(start),
            ));
        }

        loop {
            if let Some(char) = payload.get(pointer_context.current_position()) {
                if matches!(char, b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'_') {
                    pointer_context.move_columns(1);
                    continue;
                }
            }

            variable_range_end = pointer_context.current_position();
            break;
        }

        let name =
            String::from_utf8(payload[variable_range_start..variable_range_end].to_vec()).unwrap();

        Ok(Node(
            Token {
                span: pointer_context.create_span(start),
            },
            NodeKind::from(VariableName { name }),
        ))
    }
}
