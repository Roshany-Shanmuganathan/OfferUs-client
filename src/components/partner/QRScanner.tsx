"use client";

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X, Scan } from 'lucide-react';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (qrToken: string) => void;
  scanning: boolean;
}

export function QRScanner({ onScan, scanning }: QRScannerProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopCamera();
        },
        (errorMessage) => {
          // Ignore scan errors, they're normal
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      setError(err.message || 'Failed to start camera');
      toast.error('Failed to start camera. Please check permissions.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && cameraActive) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setCameraActive(false);
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const scanner = new Html5Qrcode("qr-reader-file");
      const result = await scanner.scanFile(file, true);
      onScan(result);
      toast.success('QR code scanned successfully!');
    } catch (err: any) {
      setError('Failed to read QR code from image');
      toast.error('Failed to read QR code from image');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Camera Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-gold" />
            Scan with Camera
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            id="qr-reader"
            className={`${cameraActive ? 'block' : 'hidden'} w-full rounded-lg overflow-hidden border-2 border-gold/30`}
          />

          {!cameraActive ? (
            <Button
              onClick={startCamera}
              disabled={scanning}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <Button
              onClick={stopCamera}
              variant="destructive"
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
          )}
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-gold" />
            Upload QR Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div id="qr-reader-file" className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
            variant="outline"
            className="w-full border-gold text-gold hover:bg-gold/10"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Button>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-gold" />
            Enter Code Manually
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="manual-code">Coupon Token</Label>
              <Input
                id="manual-code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter QR token manually"
                disabled={scanning}
                className="font-mono"
              />
            </div>
            <Button
              type="submit"
              disabled={!manualCode.trim() || scanning}
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold/10"
            >
              Validate Code
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
