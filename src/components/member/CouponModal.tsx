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
    // 1. CSS Cleanup
    const styleSheets = Array.from(clonedDoc.styleSheets);
    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules);
        for (let i = rules.length - 1; i >= 0; i--) {
          const rule = rules[i];
          if (rule.cssText.includes("oklab") || rule.cssText.includes("oklch")) {
            sheet.deleteRule(i);
          }
        }
      } catch (e) {
        console.warn("Could not clean sheet");
      }
    }

    const element = clonedDoc.getElementById("coupon-capture-target") as HTMLElement;
    if (!element) return;

    const couponBg = coupon.couponColor || "#c9a962";
    const couponTxt = getTextColor(couponBg);

    // 2. Main Container
    element.setAttribute("style", `
      display: block !important;
      width: 1000px !important;
      height: 520px !important;
      min-width: 1000px !important;
      position: relative !important;
      overflow: hidden !important;
      border-radius: 40px !important;
      background: linear-gradient(135deg, ${couponBg} 0%, ${couponBg}ee 100%) !important;
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      box-shadow: none !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
    `);

    // Add Dot Pattern texture
    const texture = clonedDoc.createElement("div");
    texture.setAttribute("style", `
      position: absolute !important;
      inset: 0 !important;
      opacity: 0.1 !important;
      pointer-events: none !important;
      background-image: radial-gradient(circle at 2px 2px, black 1px, transparent 0) !important;
      background-size: 24px 24px !important;
      z-index: 1 !important;
    `);
    element.prepend(texture);

    // 3. Flex Container
    const mainContent = clonedDoc.getElementById("coupon-main-content") as HTMLElement;
    if (mainContent) {
      mainContent.setAttribute("style", `
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
        height: 100% !important;
        box-sizing: border-box !important;
        position: relative !important;
        z-index: 5 !important;
      `);
    }

    // 4. Left Side Layout
    const leftSide = clonedDoc.getElementById("coupon-left-side") as HTMLElement;
    if (leftSide) {
      leftSide.setAttribute("style", `
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 48px 64px !important;
        height: 100% !important;
        box-sizing: border-box !important;
        color: ${couponTxt} !important;
      `);

      // Header/Shop Name - Perfected Alignment
      const shopRow = leftSide.querySelector(".opacity-90") as HTMLElement;
      if (shopRow) {
        shopRow.setAttribute("style", `
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 24px !important;
          padding: 0 !important;
        `);
        const shopText = shopRow.querySelector("span") as HTMLElement;
        if (shopText) {
          shopText.style.fontSize = "19px";
          shopText.style.fontWeight = "900";
          shopText.style.textTransform = "uppercase";
          shopText.style.letterSpacing = "0.05em";
          shopText.style.lineHeight = "1";
          shopText.style.margin = "0";
        }
        const shopIcon = shopRow.querySelector("svg") as unknown as HTMLElement;
        if (shopIcon) { 
          shopIcon.style.width = "28px"; 
          shopIcon.style.height = "28px"; 
          shopIcon.style.display = "block";
          shopIcon.style.margin = "0";
        }
      }

      // Discount Title - Further reduced (point 1)
      const discountH3 = leftSide.querySelector("h3") as HTMLElement;
      if (discountH3) {
        discountH3.setAttribute("style", `
          display: flex !important;
          flex-direction: row !important;
          align-items: baseline !important;
          font-size: 72px !important;
          font-weight: 950 !important;
          letter-spacing: -0.05em !important;
          line-height: 0.9 !important;
          margin: 12px 0 !important;
          color: ${couponTxt} !important;
        `);
        // The Percent and OFF
        const spans = discountH3.querySelectorAll("span");
        if (spans[1]) {
           spans[1].style.fontSize = "24px";
           spans[1].style.marginLeft = "8px";
           spans[1].style.fontWeight = "900";
        }
      }

      // Item Name - Reduced for balance
      const itemNameP = leftSide.querySelector("p") as HTMLElement;
      if (itemNameP) {
        itemNameP.setAttribute("style", `
          font-size: 30px !important;
          font-weight: 900 !important;
          line-height: 1.1 !important;
          letter-spacing: -0.02em !important;
          margin: 0 0 24px 0 !important;
          color: ${couponTxt} !important;
        `);
      }

      // Coupon Code Pill - Straight Alignment
      const pill = leftSide.querySelector(".inline-flex") as HTMLElement;
      if (pill) {
        pill.setAttribute("style", `
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding: 0 20px !important;
          border-radius: 14px !important;
          background-color: rgba(0,0,0,0.1) !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          width: fit-content !important;
          margin-bottom: 24px !important;
          height: 48px !important;
        `);
        const codeIcon = pill.querySelector("svg") as unknown as HTMLElement;
        if (codeIcon) { 
          codeIcon.style.width = "22px"; 
          codeIcon.style.height = "22px";
          codeIcon.style.display = "block";
          codeIcon.style.margin = "0";
        }
        const codeText = pill.querySelector(".font-mono") as HTMLElement;
        if (codeText) {
          codeText.style.fontSize = "22px";
          codeText.style.fontWeight = "900";
          codeText.style.letterSpacing = "0.2em";
          codeText.style.marginLeft = "12px";
          codeText.style.lineHeight = "1";
          codeText.style.margin = "0 0 0 12px";
        }
      }

      // Expiry Row - Straight Alignment
      const expiryRow = leftSide.querySelector(".flex.items-center.gap-2.text-base") as HTMLElement;
      if (expiryRow) {
        expiryRow.setAttribute("style", `
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          margin-top: 4px !important;
          opacity: 0.9 !important;
          height: 24px !important;
          padding: 0 !important;
        `);
        const expIcon = expiryRow.querySelector("svg") as unknown as HTMLElement;
        if (expIcon) { 
          expIcon.style.width = "20px"; 
          expIcon.style.height = "20px"; 
          expIcon.style.display = "block";
          expIcon.style.margin = "0";
        }
        const expiryText = expiryRow.querySelector("span") as HTMLElement;
        if (expiryText) {
          expiryText.style.fontSize = "17px";
          expiryText.style.fontWeight = "800";
          expiryText.style.marginLeft = "10px";
          expiryText.style.lineHeight = "1";
        }
      }

      // Footer Rows
      const footer = leftSide.querySelector(".border-t") as HTMLElement;
      if (footer) {
        footer.setAttribute("style", `
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          width: 100% !important;
          margin-top: 32px !important;
          padding-top: 24px !important;
          border-top: 1px solid rgba(0,0,0,0.1) !important;
        `);
        const footerDivs = footer.querySelectorAll("div");
        footerDivs.forEach((fd: HTMLElement) => {
          fd.style.display = "block";
          fd.style.fontSize = "12px";
          fd.style.fontWeight = "900";
          fd.style.letterSpacing = "0.1em";
        });
      }
    }

    // 5. Divider
    const divider = clonedDoc.getElementById("coupon-divider") as HTMLElement;
    if (divider) {
      divider.setAttribute("style", "display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; position: relative !important; width: 60px !important; height: 100% !important;");
      const punches = divider.querySelectorAll(".rounded-full");
      const pStyle = `position: absolute !important; width: 56px !important; height: 56px !important; background-color: #FFFFFF !important; border-radius: 99px !important; z-index: 10 !important; left: 50% !important; margin-left: -28px !important;`;
      if (punches[0]) (punches[0] as HTMLElement).setAttribute("style", pStyle + " top: -28px !important;");
      if (punches[1]) (punches[1] as HTMLElement).setAttribute("style", pStyle + " bottom: -28px !important;");
      
      const dash = divider.querySelector(".border-dashed") as HTMLElement;
      if (dash) {
        dash.setAttribute("style", `width: 0 !important; height: 100% !important; border-left: 2px dashed ${couponTxt} !important; opacity: 0.3 !important;`);
      }
    }

    // 6. Right Side - Center alignment (point 3)
    const rightSide = clonedDoc.getElementById("coupon-right-side") as HTMLElement;
    if (rightSide) {
      rightSide.setAttribute("style", `
        width: 380px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 40px !important;
        background: rgba(0,0,0,0.04) !important;
        height: 100% !important;
        box-sizing: border-box !important;
        text-align: center !important;
      `);

      // QR Code Box - Square ratio (point 4)
      const qrBox = rightSide.querySelector(".bg-white") as HTMLElement;
      if (qrBox) {
        qrBox.setAttribute("style", `
          background-color: white !important;
          padding: 24px !important;
          border-radius: 32px !important;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.2) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 256px !important;
          height: 256px !important;
          box-sizing: border-box !important;
        `);
        const qrImg = qrBox.querySelector("img") as HTMLElement;
        if (qrImg) {
          qrImg.style.width = "200px";
          qrImg.style.height = "200px";
          qrImg.style.display = "block";
          qrImg.style.objectFit = "contain";
        }
      }

      // "Scan to Redeem" - Center aligned (point 3)
      const scanP = rightSide.querySelector("p:nth-of-type(1)") as HTMLElement;
      if (scanP) {
        scanP.setAttribute("style", `
          display: block !important;
          width: 100% !important;
          font-size: 20px !important;
          font-weight: 950 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          margin-top: 32px !important;
          color: ${couponTxt} !important;
          text-align: center !important;
        `);
      }

      // "Show this at the counter" - Center aligned (point 3)
      const scanSub = rightSide.querySelector("p:nth-of-type(2)") as HTMLElement;
      if (scanSub) {
        scanSub.setAttribute("style", `
          display: block !important;
          width: 100% !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          opacity: 0.7 !important;
          margin-top: 6px !important;
          color: ${couponTxt} !important;
          text-align: center !important;
          line-height: 1.4 !important;
        `);
      }
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

      // Calculate dimensions for A4 Landscape
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      // We want the coupon to take a significant portion of the page
      const imgWidth = 240; // mm (nearly full width of A4 minus margins)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Add background color to the whole page if desired, or just the image
      const imgData = canvas.toDataURL("image/png");
      
      // Header info on PDF
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("OfferUs - Your Exclusive Coupon", 10, 10);
      pdf.text(`Downloaded on ${new Date().toLocaleDateString()}`, 230, 10);

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      
      // Footer/Needed data on PDF
      pdf.setFontSize(8);
      pdf.text(`Store: ${partner?.shopName} | Coupon Code: ${coupon.couponCode}`, pdfWidth/2, pdfHeight - 10, { align: 'center' });
      
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
          <div className="flex justify-center w-full overflow-hidden p-2">
            <div
              id="coupon-capture-target"
              ref={couponCardRef}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl w-full max-w-4xl bg-white text-black"
              style={{
                background: `linear-gradient(135deg, ${couponColor} 0%, ${couponColor}dd 100%)`,
              }}
            >
              {/* Premium Texture Overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Decorative Elements */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{
                  background: textColor,
                  transform: "translate(30%, -30%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{
                  background: textColor,
                  transform: "translate(-30%, 30%)",
                }}
              />

              {/* Main Content Container */}
              <div id="coupon-main-content" className="relative flex flex-col md:flex-row min-h-[400px]">
                {/* Left Side: Offer Info */}
                <div id="coupon-left-side" className="flex-1 p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 opacity-90">
                      <Store className="h-6 w-6" style={{ color: textColor }} />
                      <span
                        className="text-xl font-bold tracking-wider uppercase"
                        style={{ color: textColor }}
                      >
                        {partner?.shopName}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-none flex items-baseline gap-2"
                        style={{ color: textColor }}
                      >
                        <span className="text-7xl md:text-8xl font-black">{offer?.discount}%</span>
                        <span className="text-2xl md:text-3xl font-bold opacity-90">
                          OFF
                        </span>
                      </h3>
                      <p
                        className="text-2xl md:text-4xl font-black tracking-tight leading-tight max-w-md"
                        style={{ color: textColor }}
                      >
                        {offer?.title}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-6">
                      <div className="inline-flex items-center gap-3 bg-black/10 backdrop-blur-sm rounded-xl px-5 py-3 w-fit border border-white/20">
                        <Tag className="h-6 w-6" style={{ color: textColor }} />
                        <span
                          className="font-mono font-bold text-2xl tracking-[0.2em]"
                          style={{ color: textColor }}
                        >
                          {coupon.couponCode}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 text-base font-bold opacity-90"
                        style={{ color: textColor }}
                      >
                        <Calendar className="h-5 w-5" />
                        <span>
                          Valid until{" "}
                          {new Date(coupon.expiryDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-end">
                    <div
                      className="text-[10px] font-bold opacity-70 uppercase tracking-widest"
                      style={{ color: textColor }}
                    >
                      Terms & Conditions Apply
                    </div>
                    <div
                      className="text-[10px] font-mono font-bold opacity-50"
                      style={{ color: textColor }}
                    >
                      CODE: {coupon.couponCode}
                    </div>
                  </div>
                </div>

                {/* Divider (Vertical Dashed Line with Punch-outs) */}
                <div id="coupon-divider" className="relative hidden md:flex flex-col items-center justify-center py-4 w-10">
                  <div
                    className="w-[1px] h-full border-l-2 border-dashed opacity-30"
                    style={{ borderColor: textColor }}
                  />
                  {/* Punch-out Circles - Forcing white in MD to look like paper cuts */}
                  <div className="absolute top-0 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900 md:bg-white" />
                  <div className="absolute bottom-0 translate-y-1/2 w-8 h-8 rounded-full bg-neutral-50 dark:bg-neutral-900 md:bg-white" />
                </div>

                {/* Right Side: QR Code */}
                <div id="coupon-right-side" className="w-full md:w-[340px] bg-black/5 p-8 md:p-12 flex flex-col items-center justify-center text-center relative">
                  {/* Mobile Horizontal Divider */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] border-t-2 border-dashed opacity-30 md:hidden"
                    style={{ borderColor: textColor }}
                  />

                  <div className="bg-white p-5 rounded-2xl shadow-xl mb-6 transform transition-transform hover:scale-105 duration-300">
                    {coupon.qrCodeDataUrl ? (
                      <Image
                        src={coupon.qrCodeDataUrl}
                        alt="Coupon QR Code"
                        width={256}
                        height={256}
                        className="w-52 h-52 object-contain"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    ) : (
                      <div className="w-52 h-52 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        No QR Code
                      </div>
                    )}
                  </div>

                  <p
                    className="text-base font-black tracking-[0.2em] uppercase opacity-95 mb-1"
                    style={{ color: textColor }}
                  >
                    Scan to Redeem
                  </p>
                  <p
                    className="text-xs font-bold opacity-60"
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
