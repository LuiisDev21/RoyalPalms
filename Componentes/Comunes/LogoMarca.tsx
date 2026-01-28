function UnirClases(...Clases: Array<string | undefined | false | null>) {
  return Clases.filter(Boolean).join(" ");
}

export function LogoMarca({
  ClaseAdicional,
}: {
  ClaseAdicional?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={UnirClases("inline-block h-6 w-6", ClaseAdicional)}
      style={{
        backgroundColor: "currentColor",
        WebkitMaskImage: "url(/Logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        maskImage: "url(/Logo.svg)",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
      }}
    />
  );
}
