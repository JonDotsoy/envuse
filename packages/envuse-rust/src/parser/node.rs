use super::node_kind::NodeKind;
use super::token::Token;

#[derive(Debug)]
pub struct Node(pub Token, pub NodeKind);

impl Node {
    pub fn to_string(self, payload: &[u8]) -> &[u8] {
        &payload[self.0.span.range.start..self.0.span.range.end]
    }

    pub fn to_token(self) -> Token {
        self.0
    }

    pub fn to_node_kind(self) -> NodeKind {
        self.1
    }
}
