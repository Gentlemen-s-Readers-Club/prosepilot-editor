import { Environments } from "@paddle/paddle-js";

interface PaddleEnvConfig {
  clientToken: string;
  vendorId: string;
  environment: Environments;
}

const sandboxConfig: PaddleEnvConfig = {
  clientToken: "test_e4ba34f0acfd99825ebf4051426",
  vendorId: "32670",
  environment: "sandbox",
};

const productionConfig: PaddleEnvConfig = {
  clientToken: "live_d3914c818eaf390c0c3c54b364d",
  vendorId: "236226",
  environment: "production",
};

export const getPaddleEnvConfig = (): PaddleEnvConfig => {
  const environment = import.meta.env.VITE_PADDLE_ENV || "sandbox";
  console.log("🔧 Paddle Environment:", environment);
  const config = environment === "sandbox" ? sandboxConfig : productionConfig;
  console.log("🔧 Using Paddle config:", {
    environment: config.environment,
    vendorId: config.vendorId,
    // Don't log the full token for security
    tokenType: config.clientToken.startsWith("test_")
      ? "sandbox"
      : "production",
  });
  return config;
};

// Type declaration for Vite env variables
declare global {
  interface ImportMetaEnv {
    VITE_PADDLE_ENV: "sandbox" | "production";
    VITE_PADDLE_CLIENT_TOKEN: string;
    VITE_PADDLE_CLIENT_TOKEN_PROD: string;
    VITE_PADDLE_VENDOR_ID: string;
    VITE_PADDLE_VENDOR_ID_PROD: string;
  }
}
