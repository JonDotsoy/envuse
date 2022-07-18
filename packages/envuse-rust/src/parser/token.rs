#[derive(Debug, Clone)]
pub struct PointerContext {
    pub span_start: Span,
    pub span_end: Span,
}

impl PointerContext {
    pub fn start_zero() -> Self {
        Self {
            span_start: Span {
                range: Range { start: 0, end: 0 },
                start: Point { line: 1, column: 1 },
                end: Point { line: 1, column: 1 },
            },
            span_end: Span {
                range: Range { start: 0, end: 0 },
                start: Point { line: 1, column: 1 },
                end: Point { line: 1, column: 1 },
            },
        }
    }

    pub fn move_columns(&mut self, columns_positions: usize) -> &mut Self {
        self.span_end = Span {
            range: Range {
                start: 0,
                end: self.span_end.range.end + columns_positions,
            },
            start: self.span_end.start.clone(),
            end: Point {
                line: 1,
                column: self.span_end.end.column + columns_positions,
            },
        };

        self
    }

    pub fn to_span(&self) -> Span {
        self.span_end.clone()
    }
}

#[derive(Debug, Clone)]
pub struct Point {
    pub line: usize,
    pub column: usize,
}

impl Point {
    pub fn start_zero() -> Self {
        Point { column: 1, line: 1 }
    }

    pub fn move_columns(&self, columns: usize) -> Self {
        Point {
            column: self.column + columns,
            line: self.line,
        }
    }

    pub fn move_lines(&self, lines: usize) -> Self {
        Point {
            line: self.line + lines,
            column: 1,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Range {
    pub start: usize,
    pub end: usize,
}

impl Range {
    pub fn new_end(&self, positions: usize) -> Self {
        Self {
            start: self.start,
            end: self.end + positions,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Span {
    pub start: Point,
    pub end: Point,
    pub range: Range,
}

#[derive(Debug, Clone)]
pub struct Token {
    pub span: Span,
}

impl Token {
    pub fn from_pointer_context(pointer_context: PointerContext) -> Self {
        Self {
            span: pointer_context.to_span(),
        }
    }
}
