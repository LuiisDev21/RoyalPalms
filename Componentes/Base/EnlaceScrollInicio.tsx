"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function EnlaceScrollInicio({
  href,
  className,
  children,
  onClick,
  ...rest
}: React.ComponentProps<typeof Link>) {
  const Pathname = usePathname();
  const HrefStr = href.toString();
  const TieneHash = HrefStr.includes("#") && HrefStr.split("#")[1]?.length;
  const RutaDestino = HrefStr.split("#")[0] || "/";
  const EsMismaRuta =
    !TieneHash &&
    (Pathname === RutaDestino ||
      (RutaDestino !== "/" && Pathname.startsWith(RutaDestino)));

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (EsMismaRuta) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
