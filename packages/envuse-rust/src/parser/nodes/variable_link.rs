use super::super::node_parser::NodeParser;

use super::super::node_kind::NodeKind;

#[derive(Debug, Clone)]
pub struct VariableLink {
    pub name: String,
    pub options: Vec<String>,
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
        pointer_context: &'a mut super::super::token::PointerContext,
    ) -> Result<super::super::node::Node, super::super::error_kind::ErrorKind> {
        todo!()
    }
}
