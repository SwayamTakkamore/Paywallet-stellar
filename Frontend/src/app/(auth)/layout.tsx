import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="ml-2 text-2xl font-bold text-green-900">PayWallet</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Image/Graphics */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
          <div className="text-center text-white p-12">
            <h2 className="text-3xl font-bold mb-4">
              Global Payroll Made Simple
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Send salaries across borders instantly with blockchain technology
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3 opacity-75"></div>
                <span className="text-lg">Instant cross-border payments</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3 opacity-75"></div>
                <span className="text-lg">Low transaction fees</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3 opacity-75"></div>
                <span className="text-lg">Secure & compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
