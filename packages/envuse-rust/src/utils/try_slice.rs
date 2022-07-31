pub fn try_slice<T>(arr: &[T], start: usize, end: usize) -> &[T] {
    let minor_end = if arr.len() < end { arr.len() } else { end };

    &arr[start..minor_end]
}

pub fn try_slice_by_size<T>(payload: &[T], location_start: usize, size: usize) -> Option<&[T]> {
    if payload.len() < location_start {
        return None;
    }

    let end = if payload.len() <= (location_start + size) {
        payload.len()
    } else {
        location_start + size
    };

    let v = &payload[location_start..end];
    if v.len() == 0 {
        None
    } else {
        Some(v)
    }
}
