import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ value, size = 200, className = "" }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate external URL instead of localhost
  const externalUrl = value.includes('localhost') 
    ? value.replace('localhost:5000', window.location.host)
    : value;

  useEffect(() => {
    if (canvasRef.current && externalUrl) {
      QRCode.toCanvas(canvasRef.current, externalUrl, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        },
        errorCorrectionLevel: 'M'
      }).catch(console.error);
    }
  }, [externalUrl, size]);

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="rounded-lg border"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <p className="text-xs text-muted-foreground break-all">{externalUrl}</p>
    </div>
  );
}
