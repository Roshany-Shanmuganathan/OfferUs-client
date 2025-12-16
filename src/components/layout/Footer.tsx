import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterProps {
  variant?: "full" | "simplified";
}

export function Footer({ variant = "full" }: FooterProps) {
  if (variant === "simplified") {
    return (
      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} OfferUs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo width={120} height={40} variant="light" />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Your trusted platform for discovering the best offers and deals
              from verified partners across Sri Lanka.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Browse Offers", href: "/offers" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Partners</h3>
            <ul className="space-y-3">
              {[
                { label: "Partner Registration", href: "/partner/register" },
                { label: "Partner Login", href: "#" },
                { label: "Partner FAQ", href: "/faq" },
                { label: "Partner Support", href: "/contact" },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  Vavuniya, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href="tel:+94775058422"
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  +94 775 058 422
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href="mailto:support@offerus.lk"
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  support@offerus.lk
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">
                Subscribe to Newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 h-10"
                  suppressHydrationWarning
                />
                <Button size="sm" variant="secondary" className="h-10 px-4" suppressHydrationWarning>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} OfferUs. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
