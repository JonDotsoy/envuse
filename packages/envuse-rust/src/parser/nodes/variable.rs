use serde::Serialize;
use super::super::super::utils::try_slice::try_slice_by_size;
use super::super::error_kind::ErrorKind;
use super::super::node::Node;
use super::super::node_kind::NodeKind;
use super::super::node_parser::NodeParser;
use super::super::utils::trim::trim_spaces;
use super::super::PointerContext;
use super::variable_name::VariableNameParser;
use super::variable_template::VariableValueParser;
use super::variable_type::VariableTypeParser;

#[derive(Debug, Clone, Serialize)]
pub struct Variable {
    pub variable_name: Box<Node>,
    pub variable_type: Option<Box<Node>>,
    pub variable_value: Option<Box<Node>>,
}

impl From<Variable> for NodeKind {
    fn from(v: Variable) -> Self {
        NodeKind::Variable(v)
    }
}

pub struct VariableParser;

impl NodeParser for VariableParser {
    fn parse<'a>(
        &self,
        payload: &'a [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let start_pointer_context = pointer_context.clone();

        let variable_name = Box::new((VariableNameParser).parse(payload, pointer_context)?);
        trim_spaces(payload, pointer_context);
        let variable_type = match (VariableTypeParser).parse(payload, pointer_context) {
            Ok(x) => Some(Box::new(x)),
            _ => None,
        };
        trim_spaces(payload, pointer_context);

        let variable_value = if b"="
            == try_slice_by_size(payload, pointer_context.current_position(), 1).unwrap_or(&[])
        {
            pointer_context.move_columns(1);
            trim_spaces(payload, pointer_context);

            let node = (VariableValueParser).parse(payload, pointer_context);

            match node {
                Ok(x) => Some(Box::new(x)),
                Err(_) => None,
            }
        } else {
            None
        };

        Ok(Node(
            pointer_context.create_token(start_pointer_context),
            From::from(Variable {
                variable_name,
                variable_type,
                variable_value,
            }),
        ))
    }
}
