import {
  ExtraerMensajeDeDetalle,
  MensajeDeError,
  ObtenerTituloYDescripcionError,
} from "../MensajeDeError";

describe("ExtraerMensajeDeDetalle", () => {
  it("devuelve string vacío para null o undefined", () => {
    expect(ExtraerMensajeDeDetalle(null)).toBe("");
    expect(ExtraerMensajeDeDetalle(undefined)).toBe("");
  });

  it("devuelve el mensaje para detail string", () => {
    expect(ExtraerMensajeDeDetalle("Error de validación")).toBe("Error de validación");
  });

  it("devuelve mensajes unidos para array de objetos con msg", () => {
    expect(
      ExtraerMensajeDeDetalle([{ msg: "Uno" }, { msg: "Dos" }])
    ).toBe("Uno, Dos");
  });

  it("devuelve 'Error en la petición' para array vacío", () => {
    expect(ExtraerMensajeDeDetalle([])).toBe("Error en la petición");
  });

  it("devuelve message si el objeto tiene message", () => {
    expect(ExtraerMensajeDeDetalle({ message: "Mensaje" })).toBe("Mensaje");
  });
});

describe("MensajeDeError", () => {
  it("devuelve mensaje de Error", () => {
    expect(MensajeDeError(new Error("Algo falló"), "Por defecto")).toBe("Algo falló");
  });

  it("devuelve PorDefecto si err no tiene mensaje", () => {
    expect(MensajeDeError(null, "Por defecto")).toBe("Por defecto");
  });
});

describe("ObtenerTituloYDescripcionError", () => {
  it("devuelve TituloPorDefecto cuando no hay texto", () => {
    expect(ObtenerTituloYDescripcionError(null, "Error")).toEqual({
      Titulo: "Error",
    });
  });

  it("devuelve Titulo y Descripcion con el texto del error", () => {
    expect(
      ObtenerTituloYDescripcionError(new Error("Detalle"), "Error")
    ).toEqual({ Titulo: "Error", Descripcion: "Detalle" });
  });
});
