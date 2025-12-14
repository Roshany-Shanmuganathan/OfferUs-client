'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  HelpCircle,
  FileText,
  UserPlus
} from 'lucide-react';
import { LoginTrigger } from '@/components/layout/LoginTrigger';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're Here to Help. Have a question about an offer, partnership, or your account?
            </p>
            <p className="mt-2 text-muted-foreground">
              Reach out anytime — our team replies within 24–48 hours.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Contact Form - Left Column (2 spans) */}
              <div className="lg:col-span-2">
                <div className="bg-card border rounded-lg p-8 shadow-sm">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                    <p className="text-muted-foreground">
                      Please fill out the form below, and our support team will get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          placeholder="John Doe" 
                          required 
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          required 
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          placeholder="+94 77 123 4567" 
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select onValueChange={handleSelectChange} value={formData.subject} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="offer-issue">Offer Issue</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="feedback">Feedback / Suggestions</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder="How can we help you?" 
                        className="min-h-[150px]" 
                        required 
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attachment">Attachment (Optional)</Label>
                      <Input id="attachment" type="file" className="cursor-pointer" />
                      <p className="text-xs text-muted-foreground">Upload screenshots or documents</p>
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Send Message
                    </Button>

                    <p className="text-xs text-muted-foreground mt-4">
                      Your information will only be used to respond to your request. We respect your privacy.
                    </p>
                  </form>
                </div>
              </div>

              {/* Sidebar - Right Column (1 span) */}
              <div className="space-y-8">
                
                {/* Direct Contact */}
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <h3 className="font-bold text-xl mb-4">Direct Contact</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">Email</p>
                          <a href="mailto:support@offerus.lk" className="text-muted-foreground hover:text-primary transition-colors">
                            support@offerus.lk
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <a href="tel:+94775058422" className="text-muted-foreground hover:text-primary transition-colors">
                            +94 775058422
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">Business Hours</p>
                          <p className="text-muted-foreground text-sm">
                            Monday–Friday<br />9:00 AM – 5:00 PM (GMT+5:30)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">Our Location</p>
                          <p className="text-muted-foreground">Vavuniya, Sri Lanka</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Social Media */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Additional Support Channels</h4>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Facebook className="w-4 h-4" />
                          <span>OfferUs</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <Instagram className="w-4 h-4" />
                          <span>@offerus.lk</span>
                        </a>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-sm font-medium">Partner Help:</span>
                          <a href="mailto:partners@offerus.lk" className="hover:text-primary transition-colors text-sm">partners@offerus.lk</a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">Frequently Asked Questions</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Before contacting us, you may browse our FAQ section:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/faq#save-offer" className="text-primary hover:underline flex items-center gap-2">
                          <FileText className="w-3 h-3" /> How to save an offer
                        </Link>
                      </li>
                      <li>
                        <Link href="/faq#become-partner" className="text-primary hover:underline flex items-center gap-2">
                          <FileText className="w-3 h-3" /> How to become a partner
                        </Link>
                      </li>
                      <li>
                        <Link href="/faq#approval" className="text-primary hover:underline flex items-center gap-2">
                          <FileText className="w-3 h-3" /> How offer approval works
                        </Link>
                      </li>
                      <li>
                        <Link href="/faq#account" className="text-primary hover:underline flex items-center gap-2">
                          <FileText className="w-3 h-3" /> Account & login help
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Partner CTA */}
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <UserPlus className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Want to Become a Partner?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're a business owner interested in promoting your offers through OfferUs:
                  </p>
                  <div className="space-y-2">
                    <Link href="/partner/register">
                      <Button className="w-full" variant="outline">
                        Visit Partner Signup Page
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                      or email: <a href="mailto:partners@offerus.lk" className="text-primary hover:underline">partners@offerus.lk</a>
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="mt-12">
               <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center border">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Google Map Embed Placeholder</p>
                    <p className="text-sm">(Vavuniya, Sri Lanka)</p>
                  </div>
               </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-12 text-center border-t pt-8">
              <h4 className="font-semibold text-sm mb-2">Privacy Note</h4>
              <p className="text-xs text-muted-foreground max-w-xl mx-auto">
                We only use your details to handle your request. Read more in our <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

