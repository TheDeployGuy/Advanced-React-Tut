import formatMoney from "../lib/formatMoney";

describe("Format Money", () => {
  it("works with fractions", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(10)).toEqual("$0.10");
  });

  it("Leaves cents off for whole dollars", () => {
    expect(formatMoney(100)).toEqual("$1");
    expect(formatMoney(1000)).toEqual("$10");
    expect(formatMoney(10000)).toEqual("$100");
    expect(formatMoney(5000000)).toEqual("$50,000");
  });

  it("works with whole and fractions", () => {
    expect(formatMoney(110)).toEqual("$1.10");
    expect(formatMoney(5555)).toEqual("$55.55");
    expect(formatMoney(5000055)).toEqual("$50,000.55");
  });
});
