import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-lemon-chiffon overflow-hidden border-t-2 border-white/20">
      {/* Massive Typography Marquee */}
      <div className="w-full overflow-hidden whitespace-nowrap py-10 border-b border-white/10 flex select-none">
        <div className="font-display-xl text-[100px] md:text-[180px] leading-none uppercase tracking-tighter animate-[marquee_20s_linear_infinite]">
          MODAA WORLDWIDE • NO COMPROMISE • EST. 2026 • MODAA WORLDWIDE • NO COMPROMISE • EST. 2026 • MODAA WORLDWIDE • NO COMPROMISE • EST. 2026 • 
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        
        {/* Newsletter / Drop Signup */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h2 className="font-display-xl text-5xl md:text-7xl uppercase tracking-tighter mb-4">
              JOIN THE ARCHIVE
            </h2>
            <p className="font-body-lg text-lg text-white/70 max-w-md mb-8">
              Unlock access to highly limited capsules, editorial features, and unreleased samples before anyone else.
            </p>
            
            <form className="relative flex w-full max-w-md group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="w-full bg-transparent border-b-2 border-white/30 pb-4 font-headline-md text-xl tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-milano-red transition-colors"
                required
              />
              <button 
                type="submit" 
                className="absolute right-0 bottom-4 font-label-bold text-sm tracking-[0.2em] uppercase hover:text-milano-red transition-colors"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Links Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 pt-4">
          <div className="flex flex-col gap-6">
            <h3 className="font-label-bold text-xs uppercase tracking-[0.2em] text-white/40 mb-2">SHOP</h3>
            <Link href="/products" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">NEW ARRIVALS</Link>
            <Link href="/products?category=outerwear" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">OUTERWEAR</Link>
            <Link href="/products?category=tops" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">TOPS</Link>
            <Link href="/products?category=bottoms" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">BOTTOMS</Link>
          </div>
          
          <div className="flex flex-col gap-6">
            <h3 className="font-label-bold text-xs uppercase tracking-[0.2em] text-white/40 mb-2">EXPLORE</h3>
            <Link href="/collection" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">ARCHIVE</Link>
            <Link href="/our-story" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">EDITORIAL</Link>
            <Link href="/campaigns" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">CAMPAIGNS</Link>
            <Link href="/stockists" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">STOCKISTS</Link>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-label-bold text-xs uppercase tracking-[0.2em] text-white/40 mb-2">SUPPORT</h3>
            <Link href="/faq" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">FAQ</Link>
            <Link href="/shipping" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">SHIPPING</Link>
            <Link href="/returns" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">RETURNS</Link>
            <Link href="/contact" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">CONTACT</Link>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="font-label-bold text-xs uppercase tracking-[0.2em] text-white/40 mb-2">LEGAL</h3>
            <Link href="/terms" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">TERMS</Link>
            <Link href="/privacy" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">PRIVACY</Link>
            <Link href="/cookies" className="font-headline-md text-xl uppercase tracking-wide hover:text-milano-red transition-colors">COOKIES</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-label-bold text-[10px] tracking-widest text-white/40">
          © 2026 MODAA WORLDWIDE. ALL RIGHTS RESERVED.
        </span>
        
        <div className="flex gap-6">
          <Link href="#" className="font-label-bold text-[10px] tracking-widest text-white/40 hover:text-white transition-colors">INSTAGRAM</Link>
          <Link href="#" className="font-label-bold text-[10px] tracking-widest text-white/40 hover:text-white transition-colors">TWITTER</Link>
          <Link href="#" className="font-label-bold text-[10px] tracking-widest text-white/40 hover:text-white transition-colors">TIKTOK</Link>
        </div>
      </div>
    </footer>
  );
}
