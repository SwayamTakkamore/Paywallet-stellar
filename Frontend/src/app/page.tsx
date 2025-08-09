import Link from "next/link";
import { ArrowRight, Globe, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: "Instant Global Payments",
      description: "Send salaries across borders in seconds, not days. Powered by Stellar blockchain for lightning-fast settlements."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with KYC verification and regulatory compliance across multiple jurisdictions."
    },
    {
      icon: Globe,
      title: "Multi-Currency Support",
      description: "Pay in local currencies or digital assets. Automatic currency conversion with transparent fees."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Manage your entire workforce, create payment schedules, and track payroll analytics in one platform."
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-green-200 bg-green-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-green-900">PayWallet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-green-700 hover:text-green-900 hover:bg-green-100">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-green-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-green-900 sm:text-6xl animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
              Pay Your Team{" "}
              <span className="text-green-600">Globally</span>{" "}
              in Seconds
            </h1>
            <p className="mt-6 text-lg leading-8 text-green-700 max-w-3xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-150">
              Transform your payroll with blockchain technology. Send salaries instantly across borders, 
              reduce fees, and give your team access to their earnings anywhere in the world.
            </p>
            <div className="mt-10 flex items-center justify-center animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/signup">
                <Button size="lg" className="flex items-center bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight text-green-900 sm:text-4xl">
              Built for Modern Businesses
            </h2>
            <p className="mt-4 text-lg text-green-700 max-w-2xl mx-auto">
              Everything you need to manage payroll in the digital age, powered by blockchain technology.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 slide-in-from-bottom-4 delay-100"
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-green-600 transition-all duration-300" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold tracking-tight text-green-900 sm:text-4xl text-center">
              Choose Your Role
            </h2>
            <p className="mt-4 text-lg text-green-700 text-center">
              Whether you&apos;re paying salaries or receiving them, we&apos;ve got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employer Card */}
            <Card className="p-8 text-center shadow-xl border-green-200 hover:border-green-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-in fade-in-50 slide-in-from-left-4 duration-700 delay-200">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:bg-green-200">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">For Employers</CardTitle>
                <CardDescription className="text-lg text-green-700 mt-4">
                  Streamline your payroll process and pay your team globally with zero hassle.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-3 mb-8 text-green-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Manage unlimited employees
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Automated payroll schedules
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Real-time payment tracking
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Comprehensive analytics
                  </li>
                </ul>
                <Link href="/signup?type=employer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg" size="lg">
                    Sign Up as Employer
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Worker Card */}
            <Card className="p-8 text-center shadow-xl border-green-200 hover:border-green-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-in fade-in-50 slide-in-from-right-4 duration-700 delay-400">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:bg-green-200">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">For Workers</CardTitle>
                <CardDescription className="text-lg text-green-700 mt-4">
                  Receive your salary instantly and access your earnings from anywhere in the world.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-3 mb-8 text-green-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Instant salary deposits
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Multiple withdrawal options
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Transaction history & receipts
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Multi-currency wallet
                  </li>
                </ul>
                <Link href="/signup?type=worker">
                  <Button className="w-full border-green-600 text-green-700 hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg" size="lg" variant="outline">
                    Sign Up as Worker
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
            Ready to Transform Your Payroll?
          </h2>
          <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-150">
            Join thousands of companies already using PayWallet to pay their teams globally.
          </p>
          <div className="mt-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-300">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">PayWallet</span>
            </div>
            <div className="text-green-100 text-sm">
              © 2025 PayWallet Stellar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
