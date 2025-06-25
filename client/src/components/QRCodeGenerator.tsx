import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ value, size = 200, className = "" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      }).catch(console.error);
    }
  }, [value, size]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`rounded-lg ${className}`}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
