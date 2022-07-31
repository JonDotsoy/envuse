use super::super::super::utils::try_slice::try_slice_by_size;
use super::super::PointerContext;

pub fn trim_spaces<'a>(payload: &'a [u8], pointer_context: &'a mut PointerContext) {
    loop {
        match try_slice_by_size(payload, pointer_context.current_position(), 1).unwrap_or(b"") {
            b" " => {
                pointer_context.move_columns(1);
                continue;
            }
            _ => {
                break;
            }
        }
    }
}

pub fn trim_spaces_and_newline<'a>(payload: &'a [u8], pointer_context: &'a mut PointerContext) {
    loop {
        match try_slice_by_size(payload, pointer_context.current_position(), 1).unwrap_or(b"") {
            b" " | b"\t" => {
                pointer_context.move_columns(1);
                continue;
            }
            b"\n" => {
                pointer_context.move_lines(1);
                continue;
            }
            _ => {
                break;
            }
        }
    }
}
