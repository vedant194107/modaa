import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="w-full min-h-screen">
      
{/*  TopNavBar  */}
<Navbar />
<main className="min-h-screen max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap overflow-hidden">
{/*  Hero Section: Triumphant Headline  */}
<section className="staggered-entry text-center mb-section-gap relative">
<div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none select-none">
<span className="font-display-xl text-[200px] leading-none whitespace-nowrap">SUCCESS</span>
</div>
<h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-primary-container mb-4 uppercase tracking-tighter mix-blend-multiply">
                ORDER CONFIRMED
            </h1>
<p className="font-headline-md text-headline-md text-on-surface max-w-2xl mx-auto">
                THE DROP IS SECURED. YOUR SELECTION HAS BEEN REGISTERED INTO OUR SYSTEM.
            </p>
</section>
{/*  Order Information Grid  */}
<section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap">
{/*  Left: Order Details  */}
<div className="md:col-span-4 flex flex-col gap-12">
<div className="editorial-border p-8 bg-surface-container-lowest">
<p className="font-label-sm text-label-sm uppercase mb-2">Order Number</p>
<p className="font-headline-md text-headline-md text-primary mb-8">#DRP-99284-X2</p>
<p className="font-label-sm text-label-sm uppercase mb-2">Estimated Arrival</p>
<p className="font-headline-md text-headline-md">OCTOBER 14, 2024</p>
</div>
<div className="flex flex-col gap-4">
<p className="font-label-bold text-label-bold">NEXT STEPS</p>
<ul className="font-body-md text-body-md space-y-4">
<li className="flex gap-4 items-start">
<span className="material-symbols-outlined text-primary">mail</span>
<span>A confirmation email has been sent to your inbox with full tracking details.</span>
</li>
<li className="flex gap-4 items-start">
<span className="material-symbols-outlined text-primary">package_2</span>
<span>Your items are currently being prepared for expedited dispatch from our Tokyo vault.</span>
</li>
</ul>
</div>
</div>
{/*  Right: Order Summary Bento  */}
<div className="md:col-span-8">
<div className="editorial-border bg-white overflow-hidden">
<div className="p-8 border-b-2 border-on-surface bg-on-surface text-surface">
<h2 className="font-headline-md text-headline-md uppercase">Order Summary</h2>
</div>
{/*  Item 1  */}
<div className="flex items-center p-6 gap-6 image-divider">
<div className="w-24 h-32 flex-shrink-0 editorial-border bg-surface-variant overflow-hidden">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover" alt="A high-contrast studio editorial photograph of a minimalist streetwear hoodie in deep charcoal gray. The lighting is sharp and dramatic, highlighting the heavy-duty cotton texture and precision stitching against a neutral light-toned background. The aesthetic is clean, premium, and modern, fitting a luxury fashion brand's product catalog." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKRPiw47SJowAzW_5yfI38BovpsFzqZRki07MYmfwI_uso11VcfI5LXYkQkCRc_FGLCFaXn3yHMGwNzpL3y_JLKTG9Ci9_t3oHdR-SifmpzWnqEHCSOnTHR6ls4DpoxcRCwHtl45k0UF_SjmEJiCsJvtSqL34s_sW_QUpm5anga3rRuRu2Oy8yAHGfhlGJvB8N3YATWjmFGijf3N7bc_9qeZ0Wt0ofWGpC8Qf9ECgVyNy7H0y8NFPlpTaifkVlH075qtja4Zt5zac"/></Link>
</div>
<div className="flex-grow">
<p className="font-label-bold text-label-bold">ARC-01 OVERSIZED HOODIE</p>
<p className="font-body-md text-body-md text-on-surface-variant">Size: L / Color: Obsidian</p>
</div>
<div className="text-right">
<p className="font-headline-md text-headline-md">$185.00</p>
</div>
</div>
{/*  Item 2  */}
<div className="flex items-center p-6 gap-6 image-divider">
<div className="w-24 h-32 flex-shrink-0 editorial-border bg-surface-variant overflow-hidden">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover" alt="A sleek, architectural fashion accessory, specifically a matte black structured crossbody bag. The image is a close-up product shot in a high-fashion editorial style, with bold shadows and high-key highlights. The background is a minimalist, creamy white, reflecting the brand's sophisticated and exclusive identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8zBWdh181vseVG-37wXJnn5wRax8ONe5qf-XQ0bIHBQMpxqrjNdjwy9WLu3OJTrqOvdumaHgBGcRCBKRIFWnXN-1dTL7Uucpt_l07FK2PLmmZ--_Q3Ezx2Qi5TeB8xF__kJKjPbWNpF1O7CVuGgWPRhw1iPhgErgQbs_aN425SsRce_ooTokGNHSqsxOiKRnDmccky8paiF7aWB9tkNux3l2kv5mz3S7k-rAUb9YXwekDu8lr5RWO26WjBE3dyc7qfDdWXQnZMM"/></Link>
</div>
<div className="flex-grow">
<p className="font-label-bold text-label-bold">VAULT CROSSBODY BAG</p>
<p className="font-body-md text-body-md text-on-surface-variant">Size: OS / Color: Matte Black</p>
</div>
<div className="text-right">
<p className="font-headline-md text-headline-md">$320.00</p>
</div>
</div>
<div className="p-8 space-y-2">
<div className="flex justify-between font-body-md text-body-md">
<span>Subtotal</span>
<span>$505.00</span>
</div>
<div className="flex justify-between font-body-md text-body-md">
<span>Shipping (Expedited)</span>
<span>$25.00</span>
</div>
<div className="flex justify-between font-headline-md text-headline-md border-t-2 border-on-surface pt-4 mt-4">
<span>TOTAL</span>
<span className="text-primary">$530.00</span>
</div>
</div>
</div>
</div>
</section>
{/*  Call to Actions & Social Share  */}
<section className="flex flex-col md:flex-row gap-gutter items-stretch">
<div className="flex-1 flex flex-col gap-4">
<Link className="flex-1 flex items-center justify-center bg-on-surface text-surface py-8 px-8 uppercase font-headline-lg text-headline-md md:text-headline-lg btn-instant hover:bg-primary-container group" href="/products">
                    Continue Shopping
                    <span className="material-symbols-outlined ml-4 text-4xl group-hover:translate-x-2 transition-transform duration-200">arrow_forward</span>
</Link>
<Link className="flex items-center justify-center bg-milano-red text-lemon-chiffon py-4 px-8 uppercase font-headline-md text-sm tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors" href="/orders/view-orders?id=DRP-99284-X2">
                    View Order Details & Tracking
</Link>
</div>
<div className="flex-1 editorial-border p-12 bg-primary-container text-surface flex flex-col justify-center items-center text-center">
<p className="font-label-bold text-label-bold mb-4 uppercase tracking-widest text-on-primary-container">Share your drop</p>
<h3 className="font-headline-lg text-headline-md md:text-headline-lg mb-8">TELL THE WORLD</h3>
<div className="flex gap-8">
<Link className="hover:opacity-70 transition-opacity" href="#"><span className="material-symbols-outlined text-4xl">public</span></Link>
<Link className="hover:opacity-70 transition-opacity" href="#"><span className="material-symbols-outlined text-4xl">alternate_email</span></Link>
<Link className="hover:opacity-70 transition-opacity" href="#"><span className="material-symbols-outlined text-4xl">share</span></Link>
</div>
</div>
</section>
{/*  Newsletter Upsell - Editorial Style  */}
<section className="mt-section-gap py-section-gap border-t-2 border-on-surface">
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<div>
<h2 className="font-display-xl text-headline-lg uppercase mb-4 leading-none">Don't miss the next drop</h2>
<p className="font-body-lg text-body-lg max-w-md">Join our private network to receive early access codes and exclusive release windows before they hit the public floor.</p>
</div>
<div className="flex flex-col gap-4">
<div className="relative">
<input className="w-full bg-transparent border-0 border-b-2 border-on-surface py-4 px-0 font-headline-md text-headline-md focus:ring-0 placeholder:text-on-surface/30" placeholder="YOUR@EMAIL.COM" type="email"/>
<button className="absolute right-0 bottom-4 font-label-bold text-label-bold text-primary hover:tracking-widest transition-all">JOIN</button>
</div>
</div>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full bg-on-surface dark:bg-on-surface">
<div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
<div className="mb-12 md:mb-0">
<h2 className="font-display-xl text-headline-lg text-surface dark:text-surface mb-6">THE DROP</h2>
<p className="font-body-md text-body-md text-surface/80 max-w-sm">Curating the future of rare apparel and collectible editorial culture. Limited availability by design.</p>
</div>
<div className="flex flex-wrap gap-x-16 gap-y-8">
<div className="flex flex-col gap-4">
<p className="font-label-bold text-label-bold text-surface">LEGAL</p>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Terms</Link>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Privacy</Link>
</div>
<div className="flex flex-col gap-4">
<p className="font-label-bold text-label-bold text-surface">SUPPORT</p>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Shipping</Link>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Returns</Link>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Contact</Link>
</div>
<div className="flex flex-col gap-4">
<p className="font-label-bold text-label-bold text-surface">SOCIAL</p>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Instagram</Link>
<Link className="font-body-md text-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Twitter</Link>
</div>
</div>
</div>
<div className="w-full px-margin-mobile md:px-margin-desktop pb-12 max-w-container-max mx-auto">
<p className="font-body-md text-body-md text-surface/50">© 2024 THE DROP EDITORIAL. ALL RIGHTS RESERVED.</p>
</div>
</footer>


    </div>
  );
}
