"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  X,
  Calendar,
  Store,
  Tag,
  Clock,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import type { Coupon } from "@/types";
import Image from "next/image";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CouponModalProps {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
}

export function CouponModal({ coupon, open, onClose }: CouponModalProps) {
  const [downloading, setDownloading] = useState(false);
  const couponCardRef = useRef<HTMLDivElement>(null);

  if (!coupon) return null;

  const isExpired = new Date(coupon.expiryDate) < new Date();
  const isRedeemed = coupon.status === "REDEEMED";
  const isActive = coupon.status === "ACTIVE" && !isExpired;
  const daysRemaining = differenceInDays(
    new Date(coupon.expiryDate),
    new Date()
  );

  const getStatusColor = () => {
    if (isRedeemed) return "bg-gray-500";
    if (isExpired) return "bg-destructive";
    return "bg-success";
  };

  const getStatusText = () => {
    if (isRedeemed) return "Redeemed";
    if (isExpired) return "Expired";
    return "Active";
  };

  const offer = typeof coupon.offer === "object" ? coupon.offer : null;
  const partner = typeof coupon.partner === "object" ? coupon.partner : null;

  // Get contrasting text color based on background
  const getTextColor = (bgColor: string) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  // Helper to convert any color to standard RGB/RGBA format
  const toStandardColor = (color: string) => {
    if (!color) return color;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return color;

    // Set color and draw a pixel
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);

    // Get the computed RGBA values
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  };

  const prepareCloneForCapture = (clonedDoc: Document) => {
    const element = clonedDoc.getElementById("coupon-card-content");
    if (element) {
      // Force sRGB color space
      element.style.colorScheme = "only light";

      // Force fixed width for consistent "desktop" layout in download
      element.style.width = "800px";
      element.style.height = "auto";
      element.style.maxWidth = "none";

      // 1. Traverse and inline all computed styles as standard RGB
      const allElements = element.getElementsByTagName("*");
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i] as HTMLElement;
        const doc = el.ownerDocument;
        const win = doc.defaultView || window;
        const style = win.getComputedStyle(el);

        // Explicitly set colors to standard RGB values
        if (style.backgroundColor)
          el.style.backgroundColor = toStandardColor(style.backgroundColor);
        if (style.color) el.style.color = toStandardColor(style.color);
        if (style.borderColor)
          el.style.borderColor = toStandardColor(style.borderColor);
        if (style.outlineColor)
          el.style.outlineColor = toStandardColor(style.outlineColor);
        if (style.textDecorationColor)
          el.style.textDecorationColor = toStandardColor(
            style.textDecorationColor
          );
      }

      // 2. Remove all stylesheets to prevent html2canvas from parsing problematic CSS rules (like oklab)
      const styles = clonedDoc.querySelectorAll(
        'style, link[rel="stylesheet"]'
      );
      styles.forEach((s) => s.remove());
    }
  };

  const handleDownloadPDF = async () => {
    if (!couponCardRef.current) return;

    try {
      setDownloading(true);

      // Capture the coupon card
      const canvas = await html2canvas(couponCardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        onclone: prepareCloneForCapture,
      });

      // Calculate dimensions
      const imgWidth = 160; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // A4 dimensions
      const pdfWidth = 297;
      const pdfHeight = 210;

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save(`coupon-${coupon.couponCode}.pdf`);

      toast.success("Coupon PDF downloaded");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!couponCardRef.current) return;

    try {
      setDownloading(true);

      const canvas = await html2canvas(couponCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        onclone: prepareCloneForCapture,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `coupon-${coupon.couponCode}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success("Coupon image downloaded");
        }
      });
    } catch (error) {
      console.error("Image download error:", error);
      toast.error("Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  const couponColor = coupon.couponColor || "#c9a962";
  const textColor = getTextColor(couponColor);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogContent className="max-w-4xl w-11/12 max-h-[95vh] overflow-y-auto bg-neutral-50 dark:bg-neutral-900"> */}
      <DialogContent className="w-11/12 max-h-[95vh] overflow-y-auto bg-neutral-50 dark:bg-neutral-900 md:min-w-[48rem] lg:min-w-[56rem]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Your Coupon
            </DialogTitle>
            <Badge
              className={`${getStatusColor()} text-white px-4 py-1 text-sm`}
            >
              {getStatusText()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Coupon Card - This will be captured for PDF/Image */}
          <div className="flex justify-center w-full overflow-hidden">
            <div
              id="coupon-card-content"
              ref={couponCardRef}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl w-full max-w-4xl bg-white text-black"
              style={{
                background: `linear-gradient(135deg, ${couponColor} 0%, ${couponColor}dd 100%)`,
              }}
            >
              {/* Premium Texture Overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Decorative Elements */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
                style={{
                  background: textColor,
                  transform: "translate(30%, -30%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
                style={{
                  background: textColor,
                  transform: "translate(-30%, 30%)",
                }}
              />

              {/* Main Content Container */}
              <div className="relative flex flex-col md:flex-row min-h-[400px]">
                {/* Left Side: Offer Info */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 opacity-90">
                      <Store className="h-5 w-5" style={{ color: textColor }} />
                      <span
                        className="text-lg font-bold tracking-wider uppercase"
                        style={{ color: textColor }}
                      >
                        {partner?.shopName}
                      </span>
                    </div>

                    {/* Main Offer */}
                    <div className="space-y-2">
                      <h3
                        className="text-6xl md:text-7xl font-black tracking-tighter leading-none"
                        style={{ color: textColor }}
                      >
                        {offer?.discount}%
                        <span className="text-3xl md:text-4xl ml-2 font-bold opacity-80">
                          OFF
                        </span>
                      </h3>
                      <p
                        className="text-2xl md:text-3xl font-bold leading-tight max-w-md"
                        style={{ color: textColor }}
                      >
                        {offer?.title}
                      </p>
                    </div>

                    {/* Code & Validity */}
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="inline-flex items-center gap-3 bg-black/10 backdrop-blur-sm rounded-xl px-4 py-2 w-fit">
                        <Tag className="h-5 w-5" style={{ color: textColor }} />
                        <span
                          className="font-mono font-bold text-xl tracking-widest"
                          style={{ color: textColor }}
                        >
                          {coupon.couponCode}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 text-sm font-medium opacity-80"
                        style={{ color: textColor }}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>
                          Valid until{" "}
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-end">
                    <div
                      className="text-xs font-medium opacity-60"
                      style={{ color: textColor }}
                    >
                      Terms & Conditions Apply
                    </div>
                    <div
                      className="text-xs font-mono opacity-40"
                      style={{ color: textColor }}
                    >
                      CODE: {coupon.couponCode}
                    </div>
                  </div>
                </div>

                {/* Divider (Vertical Dashed Line) */}
                <div className="relative hidden md:flex flex-col items-center justify-center py-4">
                  <div
                    className="w-[1px] h-full border-l-2 border-dashed opacity-30"
                    style={{ borderColor: textColor }}
                  />
                  {/* Cutout Circles */}
                  <div className="absolute top-0 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900" />
                  <div className="absolute bottom-0 translate-y-1/2 w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900" />
                </div>

                {/* Right Side: QR Code */}
                <div className="w-full md:w-[320px] bg-black/5 p-8 md:p-12 flex flex-col items-center justify-center text-center relative">
                  {/* Mobile Horizontal Divider */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] border-t-2 border-dashed opacity-30 md:hidden"
                    style={{ borderColor: textColor }}
                  />

                  <div className="bg-white p-4 rounded-2xl shadow-xl mb-6 transform transition-transform hover:scale-105 duration-300">
                    {coupon.qrCodeDataUrl ? (
                      <Image
                        src={coupon.qrCodeDataUrl}
                        alt="Coupon QR Code"
                        width={256}
                        height={256}
                        className="w-56 h-56 object-contain"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    ) : (
                      <div className="w-56 h-56 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        No QR Code
                      </div>
                    )}
                  </div>

                  <p
                    className="text-sm font-bold tracking-widest uppercase opacity-90 mb-1"
                    style={{ color: textColor }}
                  >
                    Scan to Redeem
                  </p>
                  <p
                    className="text-xs opacity-60"
                    style={{ color: textColor }}
                  >
                    Show this at the counter
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center max-w-md mx-auto pt-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              variant="outline"
              className="flex-1 border-2 h-12 rounded-xl hover:bg-accent transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              Get as PDF
            </Button>
            <Button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              {downloading ? "Saving..." : "Get as Image"}
            </Button>
          </div>

          {/* Additional Info Section - Reordered */}
          <div className="space-y-4 max-w-4xl mx-auto pt-4">
            {offer && (
              <div className="bg-card/50 p-6 rounded-2xl border border-border/50 space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  Offer Details
                </h4>
                <p className="text-sm text-muted-foreground">
                  {offer.description}
                </p>
                {offer.originalPrice && offer.discountedPrice && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-lg font-bold text-primary">
                      Rs. {offer.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      Rs. {offer.originalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {partner && (
              <div className="bg-card/50 p-6 rounded-2xl border border-border/50 space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  Redeem At
                </h4>
                <div className="space-y-1">
                  <p className="font-medium">{partner.shopName}</p>
                  {partner.location && (
                    <p className="text-sm text-muted-foreground">
                      {partner.location.street}, {partner.location.city}
                    </p>
                  )}
                  {partner.contactInfo?.mobileNumber && (
                    <p className="text-sm text-muted-foreground">
                      Tel: {partner.contactInfo.mobileNumber}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Expires Banner */}
            {!isExpired && !isRedeemed && (
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 p-4 rounded-xl flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                <Clock className="h-5 w-5" />
                <span>
                  Expires in {daysRemaining}{" "}
                  {daysRemaining === 1 ? "day" : "days"}
                </span>
              </div>
            )}
          </div>

          {/* How to use Section */}
          <div className="max-w-4xl mx-auto bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-6 rounded-2xl space-y-3">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400">
              How to use:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-600 dark:text-blue-300/80">
              <li>Download or save this coupon</li>
              <li>
                Visit <span className="font-medium">{partner?.shopName}</span>{" "}
                before expiry
              </li>
              <li>
                Show the QR code to redeem your{" "}
                <span className="font-medium">{offer?.discount}% discount</span>
              </li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
