use serde::Serialize;

use super::super::node_parser::NodeParser;
use super::super::utils::trim::trim_spaces;
use super::literal::Literal;
use crate::parser::error_kind::ErrorKind;
use crate::parser::node::Node;
use crate::parser::node_kind::NodeKind;
use crate::parser::nodes::variable_link::VariableLinkParser;
use crate::parser::token::PointerContext;
use crate::parser::token::Token;
use crate::utils::try_slice::try_slice_by_size;

#[derive(Debug, Clone, Serialize)]
pub struct VariableTemplate {
    pub template: Vec<Node>,
}

impl From<VariableTemplate> for NodeKind {
    fn from(v: VariableTemplate) -> Self {
        NodeKind::VariableTemplate(v)
    }
}

pub struct VariableValueParser;

impl NodeParser for VariableValueParser {
    fn parse<'a>(
        &self,
        payload: &'a [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let mut template: Vec<Node> = vec![];
        let start_pointer_context = pointer_context.clone();

        {
            let position = pointer_context.current_position();
            if try_slice_by_size(payload, position, 1).unwrap_or(b"") != b"`" {
                return Err(ErrorKind::UnexpectedToken_deprecated);
            }
        };

        pointer_context.move_columns(1);
        let mut part_template_start_pointer_context = pointer_context.clone();

        loop {
            let location_start = pointer_context.current_position();
            if let Some(chunk_str) = try_slice_by_size(payload, location_start, 1) {
                let chunk_str_2 = try_slice_by_size(payload, pointer_context.current_position(), 2)
                    .unwrap_or(b"");

                if chunk_str_2 == b"${" {
                    let token = pointer_context.create_token(part_template_start_pointer_context);
                    let v = token.slice_for(payload).to_vec();
                    template.push(Node(
                        token,
                        NodeKind::from(Literal(String::from_utf8(v).unwrap())),
                    ));

                    let variable_value_parser = VariableLinkParser;
                    let a = variable_value_parser.parse(payload, pointer_context)?;

                    part_template_start_pointer_context = pointer_context.clone();

                    template.push(a);
                    continue;
                }

                if b"`" == chunk_str {
                    let token = pointer_context.create_token(part_template_start_pointer_context);
                    let v = token.slice_for(payload).to_vec();
                    template.push(Node(
                        token,
                        NodeKind::from(Literal(String::from_utf8(v).unwrap())),
                    ));
                    pointer_context.move_columns(1);
                    break;
                }

                if b"\n" == chunk_str {
                    pointer_context.move_lines(1);
                } else {
                    pointer_context.move_columns(1);
                }
            }
        }

        Ok(Node(
            Token {
                span: pointer_context.create_span(start_pointer_context),
            },
            NodeKind::from(VariableTemplate { template }),
        ))
    }
}
