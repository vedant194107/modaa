"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

export default function SummerSalePage() {
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  return (
    <div className="w-full min-h-screen">
      
{/*  TopNavBar  */}
<Navbar />
{/*  Marquee Banner  */}
<div className="bg-on-surface py-4 overflow-hidden flex whitespace-nowrap border-y-2 border-on-surface">
<div className="flex animate-marquee gap-8 items-center">
<span className="font-headline-md text-surface uppercase flex items-center gap-4">Limited Release <span className="material-symbols-outlined">bolt</span></span>
<span className="font-headline-md text-surface uppercase flex items-center gap-4">Archive Only <span className="material-symbols-outlined">bolt</span></span>
<span className="font-headline-md text-surface uppercase flex items-center gap-4">No Restocks <span className="material-symbols-outlined">bolt</span></span>
<span className="font-headline-md text-surface uppercase flex items-center gap-4">Summer 24 <span className="material-symbols-outlined">bolt</span></span>
</div>
<div aria-hidden="true" className="flex animate-marquee gap-8 items-center ml-8">
<span className="font-headline-md text-surface uppercase flex items-center gap-4">Limited Release <span className="material-symbols-outlined">bolt</span></span>
<span className="font-headline-md text-surface uppercase flex items-center gap-4">Archive Only <span className="material-symbols-outlined">bolt</span></span>
<span className="font-headline-md text-surface uppercase flex items-center gap-4">No Restocks <span className="material-symbols-outlined">bolt</span></span>
<span className="font-headline-md text-surface uppercase flex items-center gap-4">Summer 24 <span className="material-symbols-outlined">bolt</span></span>
</div>
</div>
{/*  Product & Lifestyle Grid  */}
<main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-section-gap">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-gutter">
{/*  Product Card 1  */}
<div className="group hover-lift">
<div className="relative overflow-hidden mb-6">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full aspect-[3/4] object-cover border-2 border-on-surface" alt="A high-fashion studio shot of a minimalist Milano Red leather crossbody bag. The background is a stark, clean Lemon Chiffon cream. Harsh editorial lighting creates sharp, bold shadows that emphasize the bag's structured form. The aesthetic is premium streetwear meets luxury editorial." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY_JO40wFti5gShMKNUtp4iJByLzwjvMpH529_dNS3fTAhy0kZpjzfvUwlxdTf2GZkhbmhV45GPOIidRstQ6EmfgBf10ocCIkALuRcQ_HumpRx9v15msZWdJh-gCHTQDFwGJ7bvIvgAVSmAUmVCHQm-utf3lKhFozvfDaPQ8IjoJM1n6WzVSMeaI00feDTyB5YND9r-pAIsx6bL6QQZbbai8I85oXN95imZjanPknxD042770f_yjwXsY5t6DMWDylna33Q3dvuWU"/></Link>
<span className="absolute top-4 left-4 bg-primary text-surface font-label-bold px-3 py-1 uppercase">-40%</span>
</div>
<div className="border-t-2 border-on-surface pt-4">
<div className="flex justify-between items-start">
<div>
<p className="font-label-bold text-label-bold uppercase">Archive Series</p>
<h3 className="font-headline-md text-headline-md uppercase mt-1">Struktur Crossbody</h3>
</div>
<p className="font-body-md text-body-md">
<span className="text-primary font-bold">{formatPrice(180, currency)}</span>
<span className="line-through text-on-surface/40 ml-2">{formatPrice(300, currency)}</span>
</p>
</div>
</div>
</div>
{/*  Product Card 2  */}
<div className="group hover-lift">
<div className="relative overflow-hidden mb-6">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full aspect-[3/4] object-cover border-2 border-on-surface" alt="Close up photography of premium heavyweight cotton t-shirt in bone white with a bold red graphic print on the chest. The fabric texture is clearly visible, draped elegantly on a minimalist hanger. Set against a deep Milano Red background to create high visual contrast and an aggressive editorial feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrdIMr_pyNjfjqvWTr384h8CrLApv1oSR1RSKlxfK8p0TSpf2fMCzb_Sx3chqJYvXQ6neEDBzpco0fJXvyYCrzIb2Pktcknp-flXjXkSUrOiuacmaEY87e4k-zXwmNTkUUVhVDUxVY7MltfuR6XdCig_RwUzScSJxQ0pLKHRa-K9PDdUYdkR0TGx5utCJG9mcJaPxGkpzvn7bPx8fIHY_mF6f2AUso9_2WndZJPC-EsgM0cMxfypDuWcnBe8GAuIP6n8RQD98o0Fw"/></Link>
<span className="absolute top-4 left-4 bg-primary text-surface font-label-bold px-3 py-1 uppercase">-50%</span>
</div>
<div className="border-t-2 border-on-surface pt-4">
<div className="flex justify-between items-start">
<div>
<p className="font-label-bold text-label-bold uppercase">Essential</p>
<h3 className="font-headline-md text-headline-md uppercase mt-1">Graphic Box Tee</h3>
</div>
<p className="font-body-md text-body-md">
<span className="text-primary font-bold">{formatPrice(45, currency)}</span>
<span className="line-through text-on-surface/40 ml-2">{formatPrice(90, currency)}</span>
</p>
</div>
</div>
</div>
{/*  Editorial Moment 1  */}
<div className="relative lg:row-span-2 hidden lg:block overflow-hidden border-2 border-on-surface editorial-shadow">
<div className="absolute inset-0 z-10 bg-gradient-to-t from-on-surface/80 to-transparent"></div>
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover" alt="A cinematic street style photograph of a model walking through a sun-drenched urban environment. The model is wearing an oversized blazer and avant-garde sunglasses. The color palette is dominated by warm cream tones and vibrant red accents from the city surroundings. The lighting is dramatic afternoon sun, creating high-contrast highlights and shadows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiwC_IPITslQuMNdzwq5EV8Dsh56dL4lgHxMITRDUhYUOvHboBg0Nole7MUR2r4TxyJu3ukcqy_kV01CRg-9wrihq3AaTawT4k_X-jux8Gt9RTgaSzu65taGKqyEqHjP666Lgdsk5UzoTPEWazhODqvhveJ8zcJsfhJgh0UavekcR10eWysYL-pLPTMlTdLgQWArsd5Xo5NbGnTlfign4Dl4MvC1vnLgwmP2ELidUVT2JnAVMPCjE2USaONyVQ8INYr9dq_w7ZLyM"/></Link>
<div className="absolute bottom-8 left-8 z-20">
<h2 className="font-display-xl text-headline-lg text-surface uppercase leading-none">The<br/>Archive<br/>Vibe</h2>
<p className="text-surface font-body-lg mt-4 max-w-xs">Captured in the heat of Summer '24. A study in red, cream, and movement.</p>
</div>
</div>
{/*  Product Card 3  */}
<div className="group hover-lift">
<div className="relative overflow-hidden mb-6">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full aspect-[3/4] object-cover border-2 border-on-surface" alt="A pair of sleek, futuristic technical sneakers in a monochromatic white and grey colorway with a singular vibrant red stripe along the sole. The shoes are displayed on a white marble plinth in a high-contrast studio setting. The lighting is sharp, casting long editorial shadows on a cream floor." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmmBXk3iuzJ3FOdJQuEv9JyLvoeFb8zxzEq0mgIrVXUAXJk7BS0vp7dUxQpiBApeagEmuVLlkuZ7BWemdjlil6U1317WVHnXeMJd04i_tqqJpeNqvzhBLqmYvh-TUP12SCpOY230KhXxOfPnyMYdNvi1X-3R9WbLxAAJ462jWREw3eeG2T2gpbh6tLbrRygH7WYOArhDnOEfveb5q3aRg0JXa2M7RuK4gLT0HbSbHsUpJXSea4OldhIE3zXB8LuQ3BtBmbVDjFMzU"/></Link>
<span className="absolute top-4 left-4 bg-primary text-surface font-label-bold px-3 py-1 uppercase">-30%</span>
</div>
<div className="border-t-2 border-on-surface pt-4">
<div className="flex justify-between items-start">
<div>
<p className="font-label-bold text-label-bold uppercase">Footwear</p>
<h3 className="font-headline-md text-headline-md uppercase mt-1">Vektor Runner</h3>
</div>
<p className="font-body-md text-body-md">
<span className="text-primary font-bold">{formatPrice(210, currency)}</span>
<span className="line-through text-on-surface/40 ml-2">{formatPrice(300, currency)}</span>
</p>
</div>
</div>
</div>
{/*  Product Card 4  */}
<div className="group hover-lift">
<div className="relative overflow-hidden mb-6">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full aspect-[3/4] object-cover border-2 border-on-surface" alt="Detail shot of a luxury watch with a Milano Red dial and a brushed silver metal band. The watch is resting on a stack of minimalist fashion magazines. The lighting is bright and clear, reflecting off the metal and glass. The composition uses a grid-based editorial aesthetic with strict alignment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaIOyKLFxhOBEm0N1kcHZvOP0JYIg4wAL14LIK950YeIEI8eh6vlOV_VJSMloXBxBYWY3kEaefsih0EBkTgaibooyDJukIxenTr1YS4yay90CEAGcmKtXJdMDIJTylg5EJONlGsPH_eMzMRTHzL0sHqWsbgIrPlh4z0QwBcg8ECyT_m-ruZJwG5Rz8qOZX31yj_EGO_m3Z4ZofFvJGalDjw8IdpOXobWJ3q2LQ1UMt0gwPINU8UKVJtfzJionvXJ8gv8DV8k43Q5I"/></Link>
<span className="absolute top-4 left-4 bg-primary text-surface font-label-bold px-3 py-1 uppercase">-20%</span>
</div>
<div className="border-t-2 border-on-surface pt-4">
<div className="flex justify-between items-start">
<div>
<p className="font-label-bold text-label-bold uppercase">Accessories</p>
<h3 className="font-headline-md text-headline-md uppercase mt-1">Chrono Red Dial</h3>
</div>
<p className="font-body-md text-body-md">
<span className="text-primary font-bold">{formatPrice(480, currency)}</span>
<span className="line-through text-on-surface/40 ml-2">{formatPrice(600, currency)}</span>
</p>
</div>
</div>
</div>
{/*  Product Card 5  */}
<div className="group hover-lift md:col-span-2 lg:col-span-1">
<div className="relative overflow-hidden mb-6">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full aspect-[3/4] object-cover border-2 border-on-surface" alt="A wide angle lifestyle shot of a cream-colored utility jacket laid flat on a dark wooden floor. Red stitching details are visible on the pockets. The shot is taken from a top-down perspective, common in luxury editorial lookbooks. The image is crisp, high-resolution, and adheres to a minimalist color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPF_Bb27uLlWf-8cv_voiv2MwgMv4Z1nyzV9ieGTwpUryglVNTeaC-v5wJmPzp4utZHb0bsZ7jknMXtoU927Yox_MA_ax5YN32W486EnYwtb25J4BloFV0SuV8GzguPhEa2TnrxMhwlLjtXUqHqWfiE7n36LFLux7cHuZzAL8Hs-YJwOvY_B6COTFa8yFMfkVcoDoSKmgiviYsufJVeotAeuFqHZ5BEebl0HQ7OExziIv3jVJuWAjqBZCrxm0D5Zj0k6QxHvZF4CU"/></Link>
<span className="absolute top-4 left-4 bg-primary text-surface font-label-bold px-3 py-1 uppercase">-60%</span>
</div>
<div className="border-t-2 border-on-surface pt-4">
<div className="flex justify-between items-start">
<div>
<p className="font-label-bold text-label-bold uppercase">Outerwear</p>
<h3 className="font-headline-md text-headline-md uppercase mt-1">Canvas Field Jacket</h3>
</div>
<p className="font-body-md text-body-md">
<span className="text-primary font-bold">{formatPrice(140, currency)}</span>
<span className="line-through text-on-surface/40 ml-2">{formatPrice(350, currency)}</span>
</p>
</div>
</div>
</div>
{/*  Asymmetric Editorial Moment 2  */}
<div className="md:col-span-2 lg:col-span-3 flex flex-col md:flex-row gap-gutter mt-12">
<div className="flex-1 bg-surface-container p-12 flex flex-col justify-center border-2 border-on-surface">
<span className="font-label-bold text-primary mb-4 block uppercase tracking-[0.2em]">Our Heritage</span>
<h2 className="font-headline-lg text-headline-lg uppercase mb-6 leading-tight">Preserving the Culture of the Drop</h2>
<p className="font-body-lg text-body-lg text-on-surface/80 mb-8 max-w-lg">
                        The archive sale isn't just about clearance. It's about giving icons a second life. Each piece selected for this collection represents a milestone in our design journey.
                    </p>
<Link className="inline-flex items-center gap-2 font-label-bold uppercase border-b-2 border-on-surface w-fit pb-1 hover:text-primary hover:border-primary transition-colors" href="/our-story">
                        Read the Full Story <span className="material-symbols-outlined">arrow_forward</span>
</Link>
</div>
<div className="flex-1 h-[500px]">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover border-2 border-on-surface" alt="An abstract artistic photograph of fabric textures in Milano Red and Bone White, swirling together. The image captures the essence of textiles and high-fashion craftsmanship. The lighting is soft and ambient, creating a luxurious and sophisticated mood that complements the overall editorial style of the design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD6k58MSyNKLzqi8c-xHC-Mx5BXy_iU_jJHm5OHymzAiuNv3hQp_2OIO-mKJVWPfjmOfxAnrG-TP9C542m03rEz5C2P3rqLyRCqKe9wnXgABr6vwraePVY8-4eOQo0j2QnQ2aiVkyNSiGtTfAitSlso32FPM6Nuuy-ApA_H43HxCGCiHvKpRHW-jSTagFiFLfJbrYek0OsndQgHDk-fYQMbG4V_G9MIll4-U65fXC9t4si6VPB-PR46_t9lAbbpBEk8IhEPVb6B4g"/></Link>
</div>
</div>
</div>
</main>
{/*  Call to Action Banner  */}
<section className="bg-primary-container py-24 px-4 md:px-margin-desktop">
<div className="max-w-container-max mx-auto text-center">
<h2 className="font-display-xl text-display-xl-mobile md:text-headline-lg text-on-primary-container uppercase mb-12">Don't miss the final drop</h2>
<div className="flex flex-col md:flex-row justify-center gap-6">
<input className="bg-transparent border-b-2 border-on-primary-container text-on-primary-container placeholder:text-on-primary-container/60 font-headline-md text-headline-md px-4 py-3 focus:outline-none focus:border-surface min-w-[300px]" placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS" type="email"/>
<button className="bg-on-surface text-surface font-headline-md px-12 py-4 uppercase sharp hover:bg-surface-bright hover:text-on-surface transition-all active:scale-95">Notify Me</button>
</div>
</div>
</section>
{/*  Footer  */}
<footer className="bg-on-surface text-surface w-full">
<div className="flex flex-col md:flex-row justify-between items-start w-full px-4 md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
<div className="mb-12 md:mb-0">
<Link className="font-display-xl text-headline-lg text-surface tracking-tighter" href="/">THE DROP</Link>
<p className="font-body-md text-surface/60 mt-4 max-w-xs">Premium editorial streetwear. Limited archives. Uncompromising quality.</p>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 gap-16">
<div>
<h4 className="font-label-bold uppercase text-surface mb-6">Explore</h4>
<ul className="space-y-4">
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="/products">Shop All</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="/summer-sale">New Arrivals</Link></li>
<li><Link className="font-body-md text-surface underline" href="#">Archives</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="/summer-sale">Lookbook</Link></li>
</ul>
</div>
<div>
<h4 className="font-label-bold uppercase text-surface mb-6">Support</h4>
<ul className="space-y-4">
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Shipping</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Returns</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Contact</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Size Guide</Link></li>
</ul>
</div>
<div className="col-span-2 md:col-span-1">
<h4 className="font-label-bold uppercase text-surface mb-6">Legal</h4>
<ul className="space-y-4">
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Terms</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Privacy</Link></li>
<li><Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors" href="#">Cookies</Link></li>
</ul>
</div>
</div>
</div>
<div className="border-t border-surface/10 py-8 px-4 md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<p className="font-body-md text-[12px] text-surface/40 uppercase tracking-widest">© 2024 THE DROP EDITORIAL. ALL RIGHTS RESERVED.</p>
<div className="flex gap-6">
<Link className="material-symbols-outlined text-surface/60 hover:text-surface" href="#">public</Link>
<Link className="material-symbols-outlined text-surface/60 hover:text-surface" href="#">camera</Link>
<Link className="material-symbols-outlined text-surface/60 hover:text-surface" href="#">video_library</Link>
</div>
</div>
</footer>


    </div>
  );
}
