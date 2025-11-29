import Link from 'next/link';

interface FooterProps {
  variant?: 'full' | 'simplified';
}

export function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'simplified') {
    return (
      <footer className="border-t bg-background mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} OfferUs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">OfferUs</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for discovering the best offers and deals.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">For Partners</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/partner/register"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Join as Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/partner/login"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partner Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OfferUs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

