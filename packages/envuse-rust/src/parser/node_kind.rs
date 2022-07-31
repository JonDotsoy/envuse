use serde::Serialize;

use super::nodes::document::Document;
use super::nodes::inline_comment::InlineComment;
use super::nodes::literal::Literal;
use super::nodes::variable::Variable;
use super::nodes::variable_link::VariableLink;
use super::nodes::variable_name::VariableName;
use super::nodes::variable_template::VariableTemplate;
use super::nodes::variable_type::VariableType;

#[derive(Debug, Clone, Serialize)]
pub enum NodeKind {
    Fragment,
    Document(Document),
    FragmentNamed(String),
    VariableTemplate(VariableTemplate),
    InlineComment(InlineComment),
    VariableLink(VariableLink),
    VariableName(VariableName),
    Literal(Literal),
    VariableType(VariableType),
    Variable(Variable),
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

    pub fn try_into_variable_value(self) -> Result<VariableTemplate, Self> {
        if let Self::VariableTemplate(v) = self {
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
        matches!(self, Self::VariableTemplate(..))
    }

    pub fn try_into_variable_link(self) -> Result<VariableLink, Self> {
        if let Self::VariableLink(v) = self {
            Ok(v)
        } else {
            Err(self)
        }
    }

    pub fn try_into_variable_name(self) -> Result<VariableName, Self> {
        if let Self::VariableName(v) = self {
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
