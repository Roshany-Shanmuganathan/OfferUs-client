import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  variant?: 'full' | 'simplified';
}

export function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'simplified') {
    return (
      <footer className="border-t bg-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>@2025 | All rights reserved</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#F5F5F0] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Contact Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm text-gray-800">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
              <span>Vavuniya, Sri Lanka</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-800">
              <Phone className="h-5 w-5 shrink-0" />
              <span>+94 775058422</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-800">
              <Mail className="h-5 w-5 shrink-0" />
              <span>support@offerus.lk</span>
            </div>
            
            <div className="pt-4">
              <h4 className="font-semibold mb-3 text-gray-900">Follow Us</h4>
              <div className="flex space-x-3">
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Company</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-gray-900 transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Resources</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="/partner/register" className="hover:text-gray-900 transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Support</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-gray-900 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="bg-[#9CA3AF] py-4">
        <div className="container mx-auto px-4 text-center text-sm text-black/80 font-medium">
          <p>@2025 | All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
