use super::super::node_parser::NodeParser;
use super::variable_link::VariableLink;
use crate::parser::error_kind::ErrorKind;
use crate::parser::node::Node;
use crate::parser::node_kind::NodeKind;
use crate::parser::token::PointerContext;
use crate::parser::token::Token;

#[derive(Debug, Clone)]
pub enum TemplatePart {
    String(String),
    VariableLink(VariableLink),
}

#[derive(Debug, Clone)]
pub struct VariableValue {
    pub source: Vec<u8>,
    pub template: Vec<TemplatePart>,
}

impl From<VariableValue> for NodeKind {
    fn from(v: VariableValue) -> Self {
        NodeKind::VariableValue(v)
    }
}

enum EndVariableValue {
    NewLine,
    DoubleQuote,
    SingleQuote,
}

pub struct VariableValueParser;

impl NodeParser for VariableValueParser {
    fn parse<'a>(
        &self,
        payload: &'static [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let payload_len = payload.len();
        let range_start = pointer_context.span_end.range.start;
        let range_end: usize;
        let (end_variable_value, initial_move_columns) =
            match &payload[range_start..range_start + 1] {
                b"\"" => (EndVariableValue::DoubleQuote, 1),
                b"\'" => (EndVariableValue::SingleQuote, 1),
                _ => (EndVariableValue::NewLine, 0),
            };

        pointer_context.move_columns(initial_move_columns);

        let mut index = range_start.clone() + initial_move_columns;
        loop {
            // Force exit
            if index + 1 > payload_len {
                range_end = index;
                break;
            }
            let chunk_str = &payload[index..index + 1];
            let _chunk_str_x2 = if index + 2 <= payload_len
                && matches!(
                    end_variable_value,
                    EndVariableValue::DoubleQuote | EndVariableValue::SingleQuote
                ) {
                &payload[index..index + 2]
            } else {
                &[]
            };

            // if chunk_str_x2 == b"${" {
            //     println!("{:#?}", String::from_utf8(chunk_str_x2.to_vec()));
            // }

            if b"\n" == chunk_str && matches!(end_variable_value, EndVariableValue::NewLine) {
                range_end = index;
                break;
            } else if b"\"" == chunk_str
                && matches!(end_variable_value, EndVariableValue::DoubleQuote)
            {
                range_end = index + 1;
                pointer_context.move_columns(1);
                break;
            } else if b"\'" == chunk_str
                && matches!(end_variable_value, EndVariableValue::SingleQuote)
            {
                range_end = index + 1;
                pointer_context.move_columns(1);
                break;
            }

            if b"\n" == chunk_str {
                pointer_context.move_lines(1);
            } else {
                pointer_context.move_columns(1);
            }

            index = index + 1;
        }

        let source = payload[range_start..range_end].to_vec();

        Ok(Node(
            Token {
                span: pointer_context.to_span(),
            },
            NodeKind::from(VariableValue {
                source,
                template: vec![],
            }),
        ))
    }
}
