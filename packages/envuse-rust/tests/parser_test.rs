use std::fmt::Debug;
use std::fs::{read, write};

fn snap(path: &str, buff: &dyn Debug, rewrite: bool) {
    let a = buff;
    let buff_out = format!("{:#?}", a);
    if rewrite {
        write(path, buff_out).unwrap();
    } else if let Ok(buff_read) = read(path).as_mut() {
        assert_eq!(buff_out.as_bytes(), buff_read);
    } else {
        write(path, buff_out).unwrap();
    }
}

#[cfg(test)]
mod parser_tests {
    use envuse_parser::parser::error_kind::ErrorKind;
    use envuse_parser::parser::iter_parsers::iter_parsers;
    use envuse_parser::parser::iter_parsers::FnParser;
    use envuse_parser::parser::node::Node;
    use envuse_parser::parser::node_kind::NodeKind;
    use envuse_parser::parser::node_parser::NodeParser;
    use envuse_parser::parser::nodes::document::DocumentParser;
    use envuse_parser::parser::nodes::inline_comment::InlineCommentParser;
    use envuse_parser::parser::nodes::literal::Literal;
    use envuse_parser::parser::nodes::variable::VariableParser;
    use envuse_parser::parser::nodes::variable_link::VariableLink;
    use envuse_parser::parser::nodes::variable_link::VariableLinkParser;
    use envuse_parser::parser::nodes::variable_name::VariableName;
    use envuse_parser::parser::nodes::variable_name::VariableNameParser;
    use envuse_parser::parser::nodes::variable_template::VariableTemplate;
    use envuse_parser::parser::nodes::variable_template::VariableValueParser;
    use envuse_parser::parser::nodes::variable_type::VariableTypeParser;
    use envuse_parser::parser::token::PointerContext;
    use envuse_parser::parser::token::Token;

    use crate::snap;

    #[test]
    fn should_parse_doc() {
        let payload = b"# Iam comment\nABC:string\n";

        let ref result_parser = (DocumentParser).parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_doc.1.snap", result_parser, true);
    }

    #[test]
    fn should_parse_variable() {
        let payload = br#"abc:string"#;

        let variable_parser = VariableParser;

        let parsed = variable_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_variable.1.snap", &parsed, false);
    }

    #[test]
    fn should_parse_variable_2() {
        let payload = br#"abc"#;

        let variable_parser = VariableParser;

        let parsed = variable_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_variable_2.1.snap", &parsed, false);
    }

    #[test]
    fn should_parse_variable_3() {
        let payload = br#"abc:number=``"#;

        let variable_parser = VariableParser;

        let parsed = variable_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_variable_3.1.snap", &parsed, false);
    }

    #[test]
    fn should_parse_variable_4() {
        let payload = br#"abc    : number = ``"#;

        let variable_parser = VariableParser;

        let parsed = variable_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_variable_4.1.snap", &parsed, false);
    }

    #[test]
    fn should_parse_variable_5() {
        let payload = br#"abc    : number = `${ABC  |>   json |> number}`"#;

        let variable_parser = VariableParser;

        let parsed = variable_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_variable_5.1.snap", &parsed, false);
    }

    #[test]
    fn should_parse_variable_type() {
        let payload = br#":string"#;

        let variable_type_parser = VariableTypeParser;

        let parsed = variable_type_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_variable_type.1.snap", &parsed, false);
    }

    #[test]
    fn should_parse_comment() {
        let payload = b"# Iam comment";

        let inline_comment_parser = InlineCommentParser;
        let result_parse = inline_comment_parser.parse(payload, &mut PointerContext::start_zero());

        snap(".snap/should_parse_comment.1.snap", &result_parse, false);
    }

    #[test]
    fn should_parse_a_simple_comment() {
        let payload_plain = b"# Iam comment";
        let payload_regular = b"# Iam comment\n";
        let payload_bad = b"\n# Iam comment\n";

        let inline_comment_parser = InlineCommentParser;

        let err_unexpected_token =
            inline_comment_parser.parse(payload_bad, &mut PointerContext::start_zero());

        snap(
            ".snap/should_parse_a_simple_comment.err_unexpected_token.snap",
            &err_unexpected_token,
            false,
        );

        let ok_comment_regular =
            inline_comment_parser.parse(payload_regular, &mut PointerContext::start_zero());

        snap(
            ".snap/should_parse_a_simple_comment.ok_comment_regular.snap",
            &ok_comment_regular,
            false,
        );

        let ok_comment_plain =
            inline_comment_parser.parse(payload_plain, &mut PointerContext::start_zero());

        snap(
            ".snap/should_parse_a_simple_comment.ok_comment_plain.snap",
            &ok_comment_plain,
            false,
        );
    }

    #[test]
    fn should_parser_variable_value_2() {
        let value_string = br#"`${b|>c}`"#;

        let variable_value_parser = VariableValueParser;
        let node = variable_value_parser
            .parse(value_string, &mut PointerContext::start_zero())
            .unwrap();

        snap(".snap/should_parser_variable_value_2.1.snap", &node, false);
    }

    #[test]
    fn should_parser_variable_value_with_variable_ref() {
        let value_string = br#"`a${b}c`"#;

        let variable_value_parser = VariableValueParser;
        let ok_parse = variable_value_parser.parse(value_string, &mut PointerContext::start_zero());

        snap(
            ".snap/should_parser_variable_value_with_variable_ref.1.snap",
            &ok_parse,
            false,
        );

        let node = ok_parse.unwrap();
        let variable_value = node
            .clone()
            .to_node_kind()
            .try_into_variable_value()
            .unwrap();

        assert!(matches!(variable_value, VariableTemplate { .. }));

        snap(
            ".snap/should_parser_variable_value_with_variable_ref.2.snap",
            &variable_value,
            false,
        );

        let chunk_a = if let Node(_, NodeKind::Literal(Literal(chunk))) =
            variable_value.template.get(0).unwrap()
        {
            chunk
        } else {
            panic!()
        };

        let chunk_b = if let Node(_, NodeKind::VariableLink(chunk)) =
            variable_value.template.get(1).unwrap()
        {
            chunk.get_variable()
        } else {
            panic!()
        };

        let chunk_c = if let Node(_, NodeKind::Literal(Literal(chunk))) =
            variable_value.template.get(2).unwrap()
        {
            chunk
        } else {
            panic!()
        };

        assert_eq!(chunk_a, &String::from("a"));
        assert_eq!(chunk_b.name, String::from("b"));
        assert_eq!(chunk_c, &String::from("c"));
    }

    #[test]
    fn should_parse_variable_link() {
        let payload = b"${ABC}";

        let variable_link_parser = VariableLinkParser;

        let parser = variable_link_parser.parse(payload, &mut PointerContext::start_zero());

        let node = parser.unwrap();
        let node_kind = node.to_node_kind();
        let variable_link = node_kind.try_into_variable_link().unwrap();

        assert!(matches!(variable_link, VariableLink { .. }));
        assert_eq!(variable_link.get_variable().name, "ABC".to_string());
        assert_eq!(variable_link.options.len(), 0);
    }

    #[test]
    fn should_parse_variable_name() {
        let payload = b"name|";

        let variable_name_parser = VariableNameParser;

        let parser = variable_name_parser.parse(payload, &mut PointerContext::start_zero());

        let node = parser.unwrap();
        let node_kind = node.to_node_kind();
        let variable_name = node_kind.try_into_variable_name().unwrap();

        assert!(matches!(variable_name, VariableName { .. }));
        assert_eq!(variable_name.name, "name".to_string());
    }

    #[test]
    fn should_parse_variable_link_with_options() {
        let payload = b"${ABC|>json|>upper}";

        let variable_link_parser = VariableLinkParser;

        let parser = variable_link_parser.parse(payload, &mut PointerContext::start_zero());

        let node = parser.unwrap();
        let node_kind = node.clone().to_node_kind();
        let variable_link = node_kind.try_into_variable_link().unwrap();

        snap(
            ".snap/should_parse_variable_link_with_options.1.snap",
            &node,
            false,
        );

        assert!(matches!(variable_link, VariableLink { .. }));
        assert_eq!(
            variable_link
                .variable
                .to_node_kind()
                .try_into_variable_name()
                .unwrap()
                .name,
            "ABC".to_string()
        );
        assert_eq!(variable_link.options.len(), 2);
    }

    struct A {}
    struct B {}
    struct C {}

    impl NodeParser for A {
        fn parse<'a>(
            &self,
            payload: &'a [u8],
            pointer_context: &'a mut PointerContext,
        ) -> Result<Node, ErrorKind> {
            let start = pointer_context.clone();
            match payload {
                b"1" => Ok(Node(
                    Token {
                        span: pointer_context.move_columns(1).create_span(start),
                    },
                    NodeKind::FragmentNamed("A::parse".to_string()),
                )),
                _ => Err(ErrorKind::NotMatchParser),
            }
        }
    }

    impl NodeParser for B {
        fn parse<'a>(
            &self,
            payload: &'a [u8],
            pointer_context: &'a mut PointerContext,
        ) -> Result<Node, ErrorKind> {
            let start = pointer_context.clone();
            match payload {
                b"2" => Ok(Node(
                    Token {
                        span: pointer_context.move_columns(1).create_span(start),
                    },
                    NodeKind::FragmentNamed("B::parse".to_string()),
                )),
                _ => Err(ErrorKind::NotMatchParser),
            }
        }
    }

    impl NodeParser for C {
        fn parse<'a>(
            &self,
            _payload: &'a [u8],
            _start_point: &'a mut PointerContext,
        ) -> Result<Node, ErrorKind> {
            Err(ErrorKind::NotMatchParser)
        }
    }

    #[test]
    fn should_use_tool_iter_parsers() {
        let payload_1 = b"1";
        let payload_2 = b"2";
        let payload_3 = b"3";

        let mut parsers = FnParser::new_vec();

        parsers.push(Box::new(A {}));
        parsers.push(Box::new(B {}));
        parsers.push(Box::new(C {}));

        snap(
            ".snap/should_use_tool_iter_parsers.1.snap",
            &iter_parsers(payload_1, &mut PointerContext::start_zero(), &parsers),
            false,
        );

        snap(
            ".snap/should_use_tool_iter_parsers.2.snap",
            &iter_parsers(payload_2, &mut PointerContext::start_zero(), &parsers),
            false,
        );

        snap(
            ".snap/should_use_tool_iter_parsers.3.snap",
            &iter_parsers(payload_3, &mut PointerContext::start_zero(), &parsers),
            false,
        );
    }
}
