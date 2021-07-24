import { ArrCursor } from "./ArrCursor";

describe("ArrCursor", () => {

  it("should match ", () => {

    const cursor = new ArrCursor([1, 2, 3, 4, 5, 6, 7, 7, 7, 8, 9, 10]);

    const [res, c] = cursor.clone().match(
      (cursor, a) => {
        while (cursor.has()) {
          if (cursor.current() === 6) {
            cursor.forward()
            return a.continue;
          }
          cursor.forward()
        }
      },
      (cursor, a) => {
        if (cursor.current() === 7) cursor.forward()
        while (cursor.has()) {
          if (cursor.current() !== 7) {
            return a.continue;
          }
          cursor.forward()
        }
      },
      (cursor, a) => {
        if (cursor.current() === 8) return a.continue;
      }
    )

    expect(res).toBe(true);
    expect(c.current()).toBe(8);
    expect(c.position).toBe(9);
  });

  it("should match return true with a break success", () => {
    const cursor = new ArrCursor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const [res] = cursor.clone().match(
      (cursor, a) => a.breakSuccess
    )

    expect(res).toBe(true);
  })

  it("should clone preserve position on clone", () => {

    const cursor = new ArrCursor([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    cursor.forward(2)

    expect(cursor.position).toEqual(2)
    expect(cursor.clone().position).toEqual(2)

  })

})