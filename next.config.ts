import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wsorhrkzdcbpgxmvzcdh.supabase.co", // NOTA: Deben cambiar esta url por la de su storage de supabase para que la web renderice las imagenes correctamente
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
}

export default nextConfig;
