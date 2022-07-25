use super::super::utils::try_slice::try_slice;
use super::PointerContext;

pub struct Payload<'a>(pub &'a [u8], pub &'a mut PointerContext);

impl Payload<'_> {
    fn slice(&self, from: usize, at: usize) -> &[u8] {
        try_slice(self.0, from, at)
    }
}
