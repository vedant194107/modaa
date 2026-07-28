import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LoggedOutPage() {
  return (
    <div className="w-full min-h-screen bg-background text-on-background flex flex-col justify-between">
      {/* TopNavBar */}
      <nav className="w-full bg-surface border-b-2 border-on-surface">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto">
          <Link className="font-display-xl text-headline-md tracking-tighter text-primary" href="/">
            THE DROP
          </Link>
          <Link href="/products" className="font-headline-md text-on-surface hover:text-primary transition-colors">
            SHOP
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-margin-mobile py-16">
        <div className="w-full max-w-md bg-surface border-2 border-on-surface p-8 md:p-12 editorial-shadow text-center">
          <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-on-surface">
            <span className="material-symbols-outlined text-primary text-3xl">logout</span>
          </div>

          <span className="font-label-bold text-label-bold text-primary uppercase tracking-widest block mb-2">SESSION ENDED</span>
          <h1 className="font-display-xl text-4xl md:text-5xl uppercase mb-4">LOGGED OUT</h1>
          <p className="font-body-md text-body-md opacity-80 mb-8">
            You have been successfully signed out of your account. Your bag items have been saved to this browser session.
          </p>

          <div className="space-y-4">
            <Link href="/login" className="block w-full bg-primary text-white py-4 font-headline-md text-headline-md hover:bg-on-surface transition-colors uppercase">
              SIGN BACK IN
            </Link>
            <Link href="/products" className="block w-full border-2 border-on-surface text-on-surface py-4 font-headline-md text-headline-md hover:bg-on-surface hover:text-surface transition-colors uppercase">
              RETURN TO SHOP
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-inverse-surface border-t-2 border-on-surface py-6 text-center text-on-primary-fixed">
        <span className="opacity-60 font-label-bold text-xs">© 2024 THE DROP. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
}
