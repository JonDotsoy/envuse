use super::super::node_kind::NodeKind;

#[derive(Debug, Clone)]
pub struct Literal(pub String);

impl From<Literal> for NodeKind {
    fn from(v: Literal) -> Self {
        NodeKind::Literal(v)
    }
}
