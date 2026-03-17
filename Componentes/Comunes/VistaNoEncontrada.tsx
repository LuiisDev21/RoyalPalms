import Image from "next/image";
import Link from "next/link";

interface VistaNoEncontradaProps {
  Titulo: string;
  Descripcion: string;
  HrefBoton: string;
  TextoBoton: string;
  EnPanel?: boolean;
}

export function VistaNoEncontrada({
  Titulo,
  Descripcion,
  HrefBoton,
  TextoBoton,
  EnPanel = false,
}: VistaNoEncontradaProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center px-4 text-center ${
        EnPanel ? "min-h-[60vh]" : "min-h-screen bg-[#f6f2ec]"
      }`}
    >
      <div className={`w-full max-w-[520px] ${EnPanel ? "" : "rounded-2xl border border-[#e5e0d8] bg-white p-6"}`}>
        <div className="mx-auto w-full max-w-[420px]">
          <Image
            src="/404.png"
            alt="Página no encontrada"
            width={1024}
            height={682}
            className="h-auto w-full"
            priority
          />
        </div>
        <h1 className="FuenteTitulo mt-6 text-3xl text-[#1c1a16]">{Titulo}</h1>
        <p className="mt-2 text-sm text-[#5b564d]">{Descripcion}</p>
        <Link
          href={HrefBoton}
          className="mt-6 inline-flex rounded-lg bg-[#1c1a16] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2a26]"
        >
          {TextoBoton}
        </Link>
      </div>
    </div>
  );
}
