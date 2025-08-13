import { useState, useEffect } from "react";
import { SEOConfig, SEOResponse } from "@shared/seo";

export function useSEO() {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSEOConfig = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/seo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SEOResponse = await response.json();

        if (data.success && data.data) {
          setSeoConfig(data.data);
        } else {
          setError("Erro ao carregar configurações SEO");
        }
      } catch (err) {
        console.error("Error loading SEO config:", err);

        // Retry up to 2 times with exponential backoff
        if (retryCount < 2) {
          setTimeout(() => {
            loadSEOConfig(retryCount + 1);
          }, Math.pow(2, retryCount) * 1000);
        } else {
          setError("Erro ao carregar configurações SEO");
        }
      } finally {
        if (retryCount === 0) {
          setLoading(false);
        }
      }
    };

    // Delay initial load to ensure server is ready
    const timer = setTimeout(() => {
      loadSEOConfig();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { seoConfig, loading, error };
}
