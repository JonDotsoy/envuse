use super::super::super::utils::try_slice::try_slice_by_size;
use super::super::PointerContext;

pub fn trim_spaces<'a>(payload: &'static [u8], pointer_context: &'a mut PointerContext) {
    loop {
        if b" " == try_slice_by_size(payload, pointer_context.current_position(), 1).unwrap_or(b"")
        {
            pointer_context.move_columns(1);
            continue;
        }
        break;
    }
}
