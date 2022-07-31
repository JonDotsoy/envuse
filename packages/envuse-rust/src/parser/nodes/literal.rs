use serde::Serialize;

use super::super::node_kind::NodeKind;

#[derive(Debug, Clone, Serialize)]
pub struct Literal(pub String);

impl From<Literal> for NodeKind {
    fn from(v: Literal) -> Self {
        NodeKind::Literal(v)
    }
}
