import { useEffect } from "react";

const CloudflareScript = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default CloudflareScript;
