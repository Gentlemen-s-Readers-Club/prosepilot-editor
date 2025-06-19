import { createContext, useContext, useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { PaddleContextType, PaddleProviderProps } from "../types/paddle";
import { getPaddleEnvConfig } from "../lib/paddle-env";

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPaddle = async () => {
      try {
        const config = getPaddleEnvConfig();

        if (!paddle) {
          const paddleInstance = await initializePaddle({
            token: config.clientToken,
            environment: config.environment,
            checkout: {
              settings: {
                theme: "light",
                displayMode: "overlay",
                locale: "en",
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
