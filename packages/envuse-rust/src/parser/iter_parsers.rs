use super::error_kind::ErrorKind;
use super::node::Node;
use super::node_parser::NodeParser;
use super::token::PointerContext;

pub struct FnParser;

impl FnParser {
    pub fn new_vec() -> Vec<Box<dyn NodeParser>> {
        vec![]
    }
}

pub fn iter_parsers<'a>(
    payload: &'a [u8],
    pointer_context: &'a mut PointerContext,
    parsers: &Vec<Box<dyn NodeParser>>,
) -> Option<Node> {
    for box_parser in parsers {
        let parser = box_parser.as_ref();
        let result_parse = parser.parse(&payload, pointer_context);
        // let r = parser(payload, start_pointer_context);
        if let Err(ErrorKind::NotMatchParser) = result_parse {
            continue;
        }
        if let Ok(node) = result_parse {
            return Some(node);
        }
    }

    None
    // Err(ErrorKind::NotMatchParser)
}
