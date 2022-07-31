use serde::Serialize;

use super::super::super::utils::try_slice::try_slice_by_size;
use super::super::error_kind::ErrorKind;
use super::super::node::Node;
use super::super::node_kind::NodeKind;
use super::super::node_parser::NodeParser;
use super::super::PointerContext;
use super::variable_name::VariableNameParser;
use super::super::utils::trim::trim_spaces;

#[derive(Debug, Clone, Serialize)]
pub struct VariableType {
    pub variable_type: Box<Node>,
}

impl From<VariableType> for NodeKind {
    fn from(v: VariableType) -> Self {
        NodeKind::VariableType(v)
    }
}

pub struct VariableTypeParser;

impl NodeParser for VariableTypeParser {
    fn parse<'a>(
        &self,
        payload: &'a [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let start_pointer_context = pointer_context.clone();

        if b":" != try_slice_by_size(payload, pointer_context.current_position(), 1).unwrap_or(&[])
        {
            pointer_context.move_columns(1);
            return Err(ErrorKind::UnexpectedToken(
                pointer_context.create_token(start_pointer_context),
            ));
        }

        pointer_context.move_columns(1);

        trim_spaces(payload, pointer_context);

        let variable_type = Box::new((VariableNameParser).parse(payload, pointer_context)?);

        Ok(Node(
            pointer_context.create_token(start_pointer_context),
            From::from(VariableType { variable_type }),
        ))
    }
}
