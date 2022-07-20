use super::nodes::inline_comment::InlineComment;
use super::nodes::variable_value::VariableValue;
use super::nodes::variable_link::VariableLink;

#[derive(Debug, Clone)]
pub enum NodeKind {
    Fragment,
    Document,
    FragmentNamed(String),
    VariableValue(VariableValue),
    InlineComment(InlineComment),
    VariableLink(VariableLink),
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

    /// Returns `true` if the node kind is [`VariableValue`].
    ///
    /// [`VariableValue`]: NodeKind::VariableValue
    #[must_use]
    pub fn is_variable_value(&self) -> bool {
        matches!(self, Self::VariableValue(..))
    }
}

impl Default for NodeKind {
    fn default() -> Self {
        Self::Fragment
    }
}
