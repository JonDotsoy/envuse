use super::super::utils::try_slice::try_slice;

#[derive(Debug, Clone)]
pub struct PointerContext {
    pub point: Point,
    pub location: usize,
}

impl PointerContext {
    pub fn start_zero() -> Self {
        Self {
            point: Point { line: 1, column: 1 },
            location: 0,
        }
    }

    pub fn move_columns(&mut self, columns_positions: usize) -> &mut Self {
        self.point = Point {
            line: self.point.line,
            column: self.point.column + columns_positions,
        };

        self.location = self.location + columns_positions;

        self
    }

    pub fn move_lines(&mut self, lines: usize) -> &mut Self {
        self.point = Point {
            line: self.point.line + lines,
            column: 1,
        };

        self.location = self.location + lines;

        self
    }

    pub fn create_span(&self, start_pointer_context: PointerContext) -> Span {
        Span {
            start: start_pointer_context.point,
            end: self.point.clone(),
            range: Range {
                start: start_pointer_context.location,
                end: self.location,
            },
        }
    }

    pub fn create_token(&self, start_pointer_context: PointerContext) -> Token {
        Token {
            span: self.create_span(start_pointer_context),
        }
    }

    pub fn current_position(&self) -> usize {
        self.location
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
    pub fn slice_for<'a>(&self, payload: &'a [u8]) -> &'a [u8] {
        try_slice(payload, self.span.range.start, self.span.range.end)
    }

    pub fn slice_for_string<'a>(&self, payload: &'a [u8]) -> String {
        String::from_utf8(try_slice(payload, self.span.range.start, self.span.range.end).to_vec())
            .unwrap()
    }
}
