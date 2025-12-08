'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Camera, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function QRCodeScanPage() {
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleScan = () => {
    if (!qrCode.trim()) {
      toast.error('Please enter or scan a QR code');
      return;
    }

    // TODO: Replace with actual API call when backend is ready
    // Simulate QR code validation
    setTimeout(() => {
      const isValid = qrCode.length > 5;
      setScanResult({
        success: isValid,
        message: isValid
          ? 'Redemption verified successfully!'
          : 'Invalid QR code. Please try again.',
      });
      if (isValid) {
        toast.success('Redemption verified successfully!');
      } else {
        toast.error('Invalid QR code');
      }
    }, 1000);
  };

  const handleManualEntry = () => {
    setScanning(false);
    setQrCode('');
    setScanResult(null);
  };

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <QrCode className="h-8 w-8" />
            QR Code Scanner
          </h1>
          <p className="text-muted-foreground mt-2">
            Scan QR codes to verify and process offer redemptions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>
                Use your device camera to scan a QR code or enter manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scanning ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center space-y-2">
                      <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Camera access required
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Point your camera at the QR code
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleManualEntry}
                    className="w-full"
                  >
                    Enter Manually Instead
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      QR Code Value
                    </label>
                    <Input
                      placeholder="Enter QR code or scan..."
                      value={qrCode}
                      onChange={(e) => {
                        setQrCode(e.target.value);
                        setScanResult(null);
                      }}
                    />
                  </div>
                  <Button onClick={handleScan} className="w-full">
                    Verify Redemption
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setScanning(true)}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Use Camera Scanner
                  </Button>
                </div>
              )}

              {scanResult && (
                <div
                  className={`p-4 rounded-lg flex items-center gap-2 ${
                    scanResult.success
                      ? 'bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100'
                      : 'bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100'
                  }`}
                >
                  {scanResult.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{scanResult.message}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">How to Scan:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Click "Use Camera Scanner" to activate your camera</li>
                    <li>Point your camera at the member's QR code</li>
                    <li>The code will be automatically scanned and verified</li>
                    <li>Confirm the redemption if valid</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Manual Entry:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Ask the member for their QR code value</li>
                    <li>Enter it in the input field</li>
                    <li>Click "Verify Redemption" to process</li>
                  </ol>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> QR codes are unique to each
                    redemption request and can only be used once.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}

