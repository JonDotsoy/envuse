use super::super::super::utils::try_slice::try_slice;
use super::super::error_kind::ErrorKind;
use super::super::node::Node;
use super::super::node_kind::NodeKind;
use super::super::node_parser::NodeParser;
use super::super::token::PointerContext;
use super::super::token::Token;
use super::variable_name::VariableName;
use super::variable_name::VariableNameParser;

#[derive(Debug, Clone)]
pub struct VariableLink {
    pub variable: Box<Node>,
    pub options: Vec<Box<Node>>,
}

impl VariableLink {
    pub fn get_variable(&self) -> VariableName {
        if let NodeKind::VariableName(variable_name) = self.variable.clone().to_node_kind() {
            return variable_name;
        }

        panic!("");
    }
}

impl From<VariableLink> for NodeKind {
    fn from(v: VariableLink) -> Self {
        NodeKind::VariableLink(v)
    }
}

pub struct VariableLinkParser;

impl NodeParser for VariableLinkParser {
    fn parse<'a>(
        &self,
        payload: &'static [u8],
        pointer_context: &'a mut PointerContext,
    ) -> Result<Node, ErrorKind> {
        let start = pointer_context.clone();
        let range_start = pointer_context.current_position();
        let mut options: Vec<Box<Node>> = vec![];

        if &payload[range_start..range_start + 2] != b"${" {
            println!("");
            return Err(ErrorKind::UnexpectedToken_deprecated);
        }

        pointer_context.move_columns(2);

        let variable_name = VariableNameParser.parse(payload, pointer_context)?;
        let variable = Box::new(variable_name);

        loop {
            if try_slice(
                payload,
                pointer_context.current_position(),
                pointer_context.current_position() + 2,
            ) == b"|>"
            {
                pointer_context.move_columns(2);
                let variable_name = VariableNameParser.parse(payload, pointer_context)?;
                let variable = Box::new(variable_name);
                options.push(variable);
                continue;
            }

            if try_slice(
                payload,
                pointer_context.current_position(),
                pointer_context.current_position() + 1,
            ) == b"}"
            {
                pointer_context.move_columns(1);
                break;
            }

            return Err(ErrorKind::UnexpectedToken_deprecated);
        }

        Ok(Node(
            Token {
                span: pointer_context.create_span(start),
            },
            NodeKind::from(VariableLink { variable, options }),
        ))
    }
}
