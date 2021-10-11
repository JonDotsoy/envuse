export const isTypeOf = <A>(elm: any, t: A): elm is A => elm && elm.type === t;
