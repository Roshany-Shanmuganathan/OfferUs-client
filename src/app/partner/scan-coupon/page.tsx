"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRScanner } from '@/components/partner/QRScanner';
import { CouponValidation } from '@/components/partner/CouponValidation';
import { toast } from 'sonner';
import { couponService } from '@/services/coupon.service';
import type { CouponValidationResponse } from '@/types';
import { QrCode } from 'lucide-react';

export default function ScanCouponPage() {
  const [validation, setValidation] = useState<CouponValidationResponse | null>(null);
  const [scanning, setScanning] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const handleScan = async (qrToken: string) => {
    try {
      setScanning(true);
      const result = await couponService.validateCoupon(qrToken);
      setValidation(result);
      
      if (result.valid) {
        toast.success('Coupon validated successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to validate coupon';
      toast.error(errorMessage);
      setValidation({
        valid: false,
        message: errorMessage,
      });
    } finally {
      setScanning(false);
    }
  };

  const handleRedeem = async () => {
    if (!validation?.coupon) return;

    try {
      setRedeeming(true);
      await couponService.redeemCoupon(validation.coupon._id);
      toast.success('Coupon redeemed successfully!');
      
      // Reset after successful redemption
      setTimeout(() => {
        setValidation(null);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to redeem coupon';
      toast.error(errorMessage);
    } finally {
      setRedeeming(false);
    }
  };

  const handleReset = () => {
    setValidation(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <QrCode className="h-8 w-8 text-gold" />
          Scan Coupon
        </h1>
        <p className="text-muted-foreground">
          Scan customer coupons to validate and redeem offers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div>
          <QRScanner onScan={handleScan} scanning={scanning} />
        </div>

        {/* Validation Section */}
        <div>
          {validation ? (
            <CouponValidation
              validation={validation}
              onRedeem={handleRedeem}
              onReset={handleReset}
              redeeming={redeeming}
            />
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center p-8">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Scan
                </h3>
                <p className="text-muted-foreground">
                  Use the scanner on the left to validate a customer's coupon
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Card className="mt-8 bg-info/5 border-info/30">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Ask the customer to show their coupon QR code</li>
            <li>Use the camera scanner or upload the QR image</li>
            <li>Verify the coupon details and customer information</li>
            <li>Click "Confirm Redemption" to redeem the coupon</li>
            <li>The discount will be applied and the coupon will be marked as used</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
