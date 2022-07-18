#[cfg(test)]
mod parser_tests {
    use envuse_rust::parser::error_kind::ErrorKind;
    use envuse_rust::parser::iter_parsers::iter_parsers;
    use envuse_rust::parser::iter_parsers::FnParser;
    use envuse_rust::parser::node::Node;
    use envuse_rust::parser::node_kind::NodeKind;
    use envuse_rust::parser::node_parser::NodeParser;
    use envuse_rust::parser::nodes::inline_comment::InlineComment;
    use envuse_rust::parser::nodes::inline_comment::InlineCommentParser;
    use envuse_rust::parser::nodes::variable_value::VariableValue;
    use envuse_rust::parser::nodes::variable_value::VariableValueParser;
    use envuse_rust::parser::token::Point;
    use envuse_rust::parser::token::PointerContext;
    use envuse_rust::parser::token::Range;
    use envuse_rust::parser::token::Span;
    use envuse_rust::parser::token::Token;

    #[test]
    fn should_parse_doc() {
        // let payload = b"# Iam comment\n";

        // let Ok(Node(token, node_kind)) = parse(payload);

        // assert!(matches!(node_kind, NodeKind::Document));
        // assert_eq!(token.span.range.start, 0);
        // assert_eq!(token.span.range.end, 14);
    }

    #[test]
    fn should_parse_a_simple_comment() {
        let payload_plain = b"# Iam comment";
        let payload_regular = b"# Iam comment\n";
        let payload_bad = b"\n# Iam comment\n";

        let inline_comment_parser = InlineCommentParser;

        let err_unexpected_token =
            inline_comment_parser.parse(payload_bad, &mut PointerContext::start_zero());

        assert!(matches!(
            err_unexpected_token,
            Err(ErrorKind::UnexpectedToken)
        ));

        let ok_comment_regular =
            inline_comment_parser.parse(payload_regular, &mut PointerContext::start_zero());

        assert!(matches!(
            ok_comment_regular,
            Ok(Node(
                Token {
                    span: Span {
                        start: Point { line: 1, column: 1 },
                        end: Point {
                            line: 1,
                            column: 14
                        },
                        range: Range { start: 0, end: 13 }
                    },
                    ..
                },
                NodeKind::InlineComment(InlineComment { .. })
            ))
        ));

        assert_eq!(
            ok_comment_regular
                .unwrap()
                .1
                .try_into_inline_comment()
                .unwrap()
                .source,
            b"# Iam comment".to_vec()
        );

        let ok_comment_plain =
            inline_comment_parser.parse(payload_plain, &mut PointerContext::start_zero());

        assert!(matches!(
            ok_comment_plain,
            Ok(Node(
                Token {
                    span: Span {
                        start: Point { line: 1, column: 1 },
                        end: Point {
                            line: 1,
                            column: 14
                        },
                        range: Range { start: 0, end: 13 }
                    },
                    ..
                },
                NodeKind::InlineComment(InlineComment { .. })
            ))
        ));
    }

    #[test]
    fn should_parser_variable_value() {
        let value_string_inline = b"abc";
        let value_string_inline_with_quotes = b"\"ab\nc\"";
        let value_string_inline_with_new_line = b"abc\n";

        let variable_value_parser = VariableValueParser;

        let ok_parse_value_string_inline =
            variable_value_parser.parse(value_string_inline, &mut PointerContext::start_zero());

        assert!(matches!(
            ok_parse_value_string_inline,
            Ok(Node(
                Token {
                    span: Span {
                        range: Range { start: 0, end: 3 },
                        start: Point { line: 1, column: 1 },
                        end: Point { line: 1, column: 4 },
                    }
                },
                NodeKind::VariableValue(VariableValue { .. })
            ))
        ));

        let variable_value = ok_parse_value_string_inline
            .unwrap()
            .to_node_kind()
            .try_into_variable_value()
            .unwrap();

        assert_eq!(variable_value.source, b"abc".to_vec());

        let ok_value_string_inline_with_new_line = variable_value_parser.parse(
            value_string_inline_with_new_line,
            &mut PointerContext::start_zero(),
        );

        assert!(matches!(
            ok_value_string_inline_with_new_line,
            Ok(Node(
                Token {
                    span: Span {
                        range: Range { start: 0, end: 3 },
                        start: Point { line: 1, column: 1 },
                        end: Point { line: 1, column: 4 },
                    }
                },
                NodeKind::VariableValue(VariableValue { .. })
            ))
        ));

        let variable_value = ok_value_string_inline_with_new_line
            .unwrap()
            .to_node_kind()
            .try_into_variable_value()
            .unwrap();

        assert_eq!(variable_value.source, b"abc".to_vec());

        let ok_value_string_inline_with_quotes = variable_value_parser.parse(
            value_string_inline_with_quotes,
            &mut PointerContext::start_zero(),
        );

        assert!(matches!(
            ok_value_string_inline_with_quotes,
            Ok(Node(
                Token {
                    span: Span {
                        range: Range { start: 0, end: 6 },
                        start: Point { line: 1, column: 1 },
                        end: Point { line: 2, column: 3 },
                    }
                },
                NodeKind::VariableValue(VariableValue { .. })
            ))
        ));

        let variable_value = ok_value_string_inline_with_quotes
            .unwrap()
            .to_node_kind()
            .try_into_variable_value()
            .unwrap();

        assert_eq!(variable_value.source, b"\"abc\"".to_vec());
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
            match payload {
                b"1" => Ok(Node(
                    Token {
                        span: pointer_context.move_columns(1).to_span(),
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
            match payload {
                b"2" => Ok(Node(
                    Token {
                        span: pointer_context.move_columns(1).to_span(),
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
        let mut start_point = PointerContext::start_zero();

        let mut parsers = FnParser::new_vec();

        parsers.push(Box::new(A {}));
        parsers.push(Box::new(B {}));
        parsers.push(Box::new(C {}));

        assert_eq!(
            "Some(Node(Token { span: Span { start: Point { line: 1, column: 1 }, end: Point { line: 1, column: 2 }, range: Range { start: 0, end: 1 } } }, FragmentNamed(\"A::parse\")))",
            format!("{:?}", &iter_parsers(payload_1, &mut start_point, &parsers)),
        );

        assert_eq!(
            "Some(Node(Token { span: Span { start: Point { line: 1, column: 1 }, end: Point { line: 1, column: 2 }, range: Range { start: 0, end: 1 } } }, FragmentNamed(\"B::parse\")))",
            format!("{:?}", &iter_parsers(payload_2, &mut start_point, &parsers)),
        );

        assert_eq!(
            "None",
            format!("{:?}", &iter_parsers(payload_3, &mut start_point, &parsers)),
        );
    }
}
