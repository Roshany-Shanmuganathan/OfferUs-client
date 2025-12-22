"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Calendar, Store, Tag, User } from 'lucide-react';
import type { Coupon, CouponValidationResponse } from '@/types';

interface CouponValidationProps {
  validation: CouponValidationResponse | null;
  onRedeem: () => void;
  onReset: () => void;
  redeeming: boolean;
}

export function CouponValidation({
  validation,
  onRedeem,
  onReset,
  redeeming,
}: CouponValidationProps) {
  if (!validation) return null;

  const { valid, message, coupon } = validation;

  if (!valid) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-6 w-6" />
            Invalid Coupon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription className="text-base">{message}</AlertDescription>
          </Alert>

          <Button onClick={onReset} variant="outline" className="w-full">
            Scan Another Coupon
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!coupon) return null;

  const offer = typeof coupon.offer === 'object' ? coupon.offer : null;
  const partner = typeof coupon.partner === 'object' ? coupon.partner : null;
  const member = typeof coupon.member === 'object' ? coupon.member : null;

  return (
    <Card className="border-success">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-success">
          <CheckCircle2 className="h-6 w-6" />
          Valid Coupon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-success/10 border-success/30">
          <AlertDescription className="text-success font-semibold">
            This coupon is valid and ready to be redeemed!
          </AlertDescription>
        </Alert>

        {/* Coupon Code */}
        <div className="bg-gradient-to-br from-gold/10 to-gold/5 p-4 rounded-lg border-2 border-gold/30 text-center">
          <p className="text-sm text-muted-foreground mb-1">Coupon Code</p>
          <p className="text-2xl font-bold text-gold tracking-wider">
            {coupon.couponCode}
          </p>
        </div>

        {/* Offer Details */}
        {offer && (
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-gold" />
              Offer Details
            </h3>
            <div className="bg-card border border-border/50 rounded-lg p-3 space-y-1">
              <p className="font-semibold">{offer.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {offer.description}
              </p>
              {offer.discount > 0 && (
                <Badge className="bg-red-500 text-white mt-2">
                  {offer.discount}% OFF
                </Badge>
              )}
              {offer.originalPrice && offer.discountedPrice && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gold">
                    Rs. {offer.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    Rs. {offer.originalPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Member Details */}
        {member && (
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-gold" />
              Customer
            </h3>
            <div className="bg-card border border-border/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
        )}

        {/* Expiry Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
          </span>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onRedeem}
            disabled={redeeming}
            className="w-full bg-success hover:bg-success/90 text-white h-12 text-base font-semibold"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {redeeming ? 'Redeeming...' : 'Confirm Redemption'}
          </Button>

          <Button
            onClick={onReset}
            disabled={redeeming}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <Alert className="bg-info/10 border-info/30">
          <AlertDescription className="text-sm text-info">
            <strong>Important:</strong> Once redeemed, this coupon cannot be used again.
            Please verify the customer's identity before confirming.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
