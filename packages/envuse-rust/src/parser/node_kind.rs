use super::nodes::{inline_comment::InlineComment, variable_value::VariableValue};

#[derive(Debug)]
pub enum NodeKind {
    Fragment,
    Document,
    VariableValue(VariableValue),
    FragmentNamed(String),
    InlineComment(InlineComment),
}

impl NodeKind {
    /// Returns `true` if the node kind is [`InlineComment`].
    ///
    /// [`InlineComment`]: NodeKind::InlineComment
    #[must_use]
    pub fn is_inline_comment(&self) -> bool {
        matches!(self, Self::InlineComment(..))
    }

    pub fn try_into_inline_comment(self) -> Result<InlineComment, Self> {
        if let Self::InlineComment(v) = self {
            Ok(v)
        } else {
            Err(self)
        }
    }

    pub fn try_into_variable_value(self) -> Result<VariableValue, Self> {
        if let Self::VariableValue(v) = self {
            Ok(v)
        } else {
            Err(self)
        }
    }
}

impl Default for NodeKind {
    fn default() -> Self {
        Self::Fragment
    }
}
