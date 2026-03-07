import {
  FormatearMontoConMoneda,
  ObtenerPrecioTotalNumerico,
} from "../FormatearMoneda";

describe("FormatearMontoConMoneda", () => {
  it("formatea número con USD por defecto", () => {
    const r = FormatearMontoConMoneda(100);
    expect(r).toMatch(/100/);
    expect(r).toMatch(/USD|[\d\s,.]/);
  });

  it("devuelve guion para NaN", () => {
    expect(FormatearMontoConMoneda(Number.NaN)).toBe("—");
  });
});

describe("ObtenerPrecioTotalNumerico", () => {
  it("devuelve 0 para undefined", () => {
    expect(ObtenerPrecioTotalNumerico(undefined)).toBe(0);
  });

  it("devuelve el número si recibe number", () => {
    expect(ObtenerPrecioTotalNumerico(99.5)).toBe(99.5);
  });

  it("parsea string numérico", () => {
    expect(ObtenerPrecioTotalNumerico("123.45")).toBe(123.45);
  });

  it("devuelve 0 para string no numérico", () => {
    expect(ObtenerPrecioTotalNumerico("abc")).toBe(0);
  });
});
