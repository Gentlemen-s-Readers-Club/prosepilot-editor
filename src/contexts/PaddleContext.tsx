import { createContext, useContext, useEffect, useState } from "react";
import { Environments, initializePaddle, type Paddle } from "@paddle/paddle-js";
import { PaddleContextType, PaddleProviderProps } from "../types/paddle";

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPaddle = async () => {
      try {
        if (!import.meta.env.VITE_PADDLE_CLIENT_TOKEN) {
          throw new Error("Missing Paddle client token");
        }

        if (!import.meta.env.VITE_PADDLE_ENV) {
          throw new Error("Missing Paddle environment configuration");
        }

        if (!paddle) {
          const paddleInstance = await initializePaddle({
            token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
            environment:
              (import.meta.env.VITE_PADDLE_ENV as Environments) || "sandbox",
            checkout: {
              settings: {
                theme: "light",
                displayMode: "overlay",
                locale: "en",
                successUrl: `${window.location.origin}/workspace/subscription?success=true`,
                closeUrl: `${window.location.origin}/workspace/subscription`,
              },
            },
          });

          if (!paddleInstance) {
            throw new Error("Failed to initialize Paddle");
          }

          setPaddle(paddleInstance);
        }
      } catch (err) {
        console.error("Paddle initialization error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to initialize Paddle"
        );
        setPaddle(null);
      } finally {
        setLoading(false);
      }
    };

    initPaddle();
  }, [paddle]);

  return (
    <PaddleContext.Provider value={{ paddle, loading, error }}>
      {children}
    </PaddleContext.Provider>
  );
}

export function usePaddle() {
  const context = useContext(PaddleContext);
  if (context === undefined) {
    throw new Error("usePaddle must be used within a PaddleProvider");
  }
  return context;
}
