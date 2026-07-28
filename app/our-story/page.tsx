import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function OurStoryPage() {
  return (
    <div className="w-full min-h-screen">
      
{/*  TopNavBar  */}
<Navbar />
<main className="w-full">
{/*  Hero Section  */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-12 md:pt-24 mb-section-gap">
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
<div className="md:col-span-8">
<h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl uppercase leading-none">
                        Our Story:<br/>
<span className="text-primary italic">Intentional</span><br/>
                        Scarcity
                    </h1>
</div>
<div className="md:col-span-4 pb-4">
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">
                        Founded on the principle that true value lies in the finite. We don't just sell products; we orchestrate moments in culture.
                    </p>
</div>
</div>
<div className="mt-12 md:mt-24 relative">
<div className="aspect-[16/9] w-full bg-surface-variant overflow-hidden custom-border-heavy">
<img className="w-full h-full object-cover grayscale" alt="A high-contrast cinematic shot of a modern streetwear design studio in a renovated industrial warehouse. The lighting is dramatic, with sharp shadows and bright highlights illuminating rolls of premium fabric, tech-wear sketches, and a minimalist desk with architectural tools. The color palette is strictly white, black, and deep Milano Red accents, emphasizing an editorial and professional aesthetic. The atmosphere is quiet, focused, and luxurious." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTdUQvxKKbzGZgNpK2ogopxVkpxkS16C1b5tR0eyGetqEQrsxTQktHj7tSPr4jYZBRld9V4EzZSTqZ0DfbT1f_TNPfwGnyu_-HwHqZj_WsYoUYuHqs6B_eDWwT8YDI-ygzH6lomLUD-Kszk5gg5WN8yvF3DImDWCB8NDTGnpjMBN0MZtADWO_3UqFmzLxr4XtdAZDG2n0iSLh6f7EsVB0hm077yNm8SnNeyaH7hOWnEaFIKC6QLU9aCGJruV-Zx1pbI-7yruwCt8k"/>
</div>
<div className="absolute -bottom-12 -right-4 md:right-12 bg-primary text-white p-8 md:p-12 max-w-xs custom-border-heavy">
<p className="font-label-bold text-label-bold uppercase tracking-widest mb-4">Manifesto 01</p>
<p className="font-headline-md text-headline-md leading-tight">WE REJECT THE ENDLESS CYCLE OF MASS CONSUMPTION.</p>
</div>
</div>
</section>
{/*  THE VISION  */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
<div className="md:col-span-5 order-2 md:order-1">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-8">THE VISION</h2>
<div className="space-y-6 text-on-surface-variant">
<p className="font-body-lg text-body-lg">
                            At THE DROP, we believe that abundance breeds indifference. When everything is available to everyone, at all times, nothing carries weight. Our vision is to return the soul to the objects we wear by limiting their existence.
                        </p>
<p className="font-body-lg text-body-lg">
                            Each release is a singular event—a curated intersection of avant-garde design, premium craftsmanship, and cultural relevance. We don't restock. We don't discount. We only innovate.
                        </p>
</div>
<div className="mt-12 p-8 border-l-8 border-primary bg-surface-container-low">
<p className="font-headline-md text-headline-md text-primary italic leading-tight">
                            "Scarcity is not a marketing tactic; it is our philosophy of respect for the material and the maker."
                        </p>
</div>
</div>
<div className="md:col-span-6 md:col-start-7 order-1 md:order-2 mb-12 md:mb-0">
<div className="aspect-[4/5] bg-surface-variant custom-border-heavy overflow-hidden editorial-offset-right">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover" alt="A grainy, high-fashion black and white editorial photograph of a model standing in a brutalist concrete environment. The model is wearing an oversized, structured tactical vest with complex pocket details. The background is sharp and angular, casting long geometric shadows. The overall mood is cold, assertive, and highly stylistic, fitting a premium streetwear brand aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtJAwezCFqs8wQb6i6YrdedcI2VptaRb0XF4-WdI9Wxtw2bH6YAavaXRVvcgS2uFqk5DiqdhjG-xBN2IzMpDZ5djLPHhS9v9X-CHi9R2L9icNxcF2fbTUrHdkZnNzMmdJHFdFoPfcokzcMyXJp5tsnEksHKk0W9jI1wnuvkl88fDJbq9u8i26oofI2GF-F2Et4oKeytfSXgWjWZGPae_43KROpRpdW9VxPUuRlSBXlYKoCA58EjuWC-V95yp5qh1zWSqP87bI9RTY"/></Link>
</div>
</div>
</div>
</section>
{/*  THE PROCESS  */}
<section className="bg-on-surface py-section-gap">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-surface/20 pb-4">
<h2 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-surface uppercase">THE PROCESS</h2>
<span className="text-primary font-label-bold tracking-widest">BEHIND THE CURTAIN</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
{/*  Step 1  */}
<div className="group">
<div className="aspect-square bg-surface-dim mb-8 overflow-hidden">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" alt="A close-up, high-detail macro shot of industrial sewing machinery working on thick, heavy-duty black canvas fabric. Intense white studio lighting highlights the texture of the thread and the metallic gleam of the needle. The composition is tight and dynamic, focusing on the precision of luxury garment manufacturing." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWsfvokgOhU6JwwXsElN78M-h9ZBIGAZTb_LP-LN61N24CO68TIK28ejNMERlMK-xN9ObsGhykguNnWX_R4ECGZkDfWSVOjo-IGMm7hKwt7czuNmvnaTkIRPRur0KBGR9mlBTZMt3n5Yt4fulrz2qGxVSj5hlJ9HuedrQgaTrGhWdCEarEslCbdcPtJXOnNDILCJL_vpR6O0qYRrcKF4zxU593mQLh8uCGwTdaKXeLNOwLUDSukYOYRl_Ovq4Hzc8pe-PKW1wbvgY"/></Link>
</div>
<h3 className="font-headline-md text-headline-md text-surface uppercase mb-4">01. Conception</h3>
<p className="text-surface/70 font-body-md">Months of research into architectural silhouettes and technical textiles culminate in a single, perfect prototype.</p>
</div>
{/*  Step 2  */}
<div className="group md:mt-12">
<div className="aspect-square bg-surface-dim mb-8 overflow-hidden">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" alt="A top-down flat lay of high-end design tools on a white surface: professional shears, a graphite pencil, a Pantone swatch book showing deep reds and blacks, and a strip of custom-woven branded webbing. The lighting is clean and bright, following a minimalist light-mode aesthetic with high contrast." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqEOVeW4uEyoX9l5GXVe7eyytgjovG7MmkOha2OipByPIVDHcBr7r2peiSfTBh6G89NkewONsRqLJB7O5Gdm-xW3SLRA3AAQl5-DNIGH1lOjaS9GpsDsO5J7ZqZfcItsJ5z39XoH9O1SHTjkpRigS0I_q0W-xNCAT7cgHQdBtB_sq9xzmwTT5T2rOA8KhnckjR8UMM-2l0Dlv62VdGw-GAS0_qHKBjsERUaztwxZP2Lmgbt79kyf6d2s5hp1pSIDrXjwmpSZ-MJYg"/></Link>
</div>
<h3 className="font-headline-md text-headline-md text-surface uppercase mb-4">02. Destruction</h3>
<p className="text-surface/70 font-body-md">We stress-test every design in urban environments. If it doesn't withstand the friction of the city, it doesn't make the cut.</p>
</div>
{/*  Step 3  */}
<div className="group md:mt-24">
<div className="aspect-square bg-surface-dim mb-8 overflow-hidden">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" alt="An abstract, high-contrast image of an urban skyline at dusk, shot through a distorted glass lens. The lights of the city create blurry, glowing streaks of red and white against a deep black sky. The mood is energetic, nocturnal, and perfectly aligned with a premium streetwear brand identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOt7Q7MJTy6SiK45mJZK4f2YZjF5xzfvoLQDeMzw_BkOzBQC2X28xd4B4syOLONacQjUSQ148cVQhzJL_S82qdsc-1vc6SQBuvkNWvB7im4mbXx4iZIiORr_RwQ15HPsD4rPaaJSABzEIGESrlfK21zuuEMYOlkcygxeAUaRMdr3DPzd2ZT-xTN1uPxZhzjzH9OoJDpW5zpbdM4dgNJF8NW8IuduhHh4TXrw-RBuSxqi62dT6zTydrpbOPVeowhOTB3vj6wA6x8fI"/></Link>
</div>
<h3 className="font-headline-md text-headline-md text-surface uppercase mb-4">03. The Release</h3>
<p className="text-surface/70 font-body-md">A synchronized global launch. Limited quantities. No warnings. Only the most attentive gain access.</p>
</div>
</div>
</div>
</section>
{/*  THE COMMUNITY  */}
<section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<div className="md:col-span-7">
<div className="aspect-video bg-surface-variant custom-border-heavy overflow-hidden editorial-offset-left mb-12">
<Link className="block cursor-pointer" href="/product-detail"><img className="w-full h-full object-cover" alt="A candid, wide-angle shot of a crowd of stylish young people gathered in an underground art space. They are wearing modern, oversized tech-wear and minimalist fashion. The lighting is atmospheric, with red neon accents cutting through a dark, industrial interior. The scene conveys a sense of belonging and exclusive community culture." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKwixd9kuEHoEtcliM7qKCaxZLLmYIHTXM2e_VQwlOvEtyWWjjSw5id-XkvoIsyXel0iQLA9WleXu8NRaykYzXIGFXlQH990DgYyo-oHD-dJF-BEgA3qPstBPp2iszVarwGaOVJ-Ns-SeCFYvSSNDUh6Ik4oT5YCOuSwn-WD-5XxkJtaANx3eqMpW1KqVMu8kmgprmezLNjBkp_WiKet02zVK5ljmqRlAnRNdDa6i1O4e8ZEHgkPBDXGDvPNWPwBEzF8kccLmaJr0"/></Link>
</div>
<div className="max-w-xl">
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase mb-8 leading-none">THE COMMUNITY</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                            We don't have customers; we have a collective. Our community is built of individuals who seek depth over trends. They are the architects, the artists, and the outcasts who define the next era of street culture.
                        </p>
<p className="font-body-lg text-body-lg text-on-surface-variant">
                            Engagement with THE DROP is a badge of intentionality. It's a signal that you value the story as much as the stitch.
                        </p>
<div className="mt-12">
<button className="bg-on-surface text-surface font-headline-md px-12 py-4 uppercase custom-border-heavy instant-hover hover:bg-primary hover:text-white transition-none active:scale-95">Join the Collective</button>
</div>
</div>
</div>
<div className="md:col-span-4 md:col-start-9 flex flex-col justify-center">
<div className="space-y-12">
<div>
<p className="font-display-xl text-headline-lg text-primary leading-none">42</p>
<p className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant">Drops Released</p>
</div>
<div className="border-t-2 border-on-surface pt-8">
<p className="font-display-xl text-headline-lg text-primary leading-none">12K</p>
<p className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant">Global Archive Members</p>
</div>
<div className="border-t-2 border-on-surface pt-8">
<p className="font-display-xl text-headline-lg text-primary leading-none">0</p>
<p className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant">Restocks Ever Permitted</p>
</div>
</div>
</div>
</div>
</section>
{/*  Newsletter / CTA  */}
<section className="bg-primary-container text-white py-24">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
<h2 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl uppercase mb-8">Stay Ahead of the Curve</h2>
<p className="font-headline-md text-headline-md mb-12 max-w-2xl mx-auto opacity-90">SECURE YOUR ACCESS TO THE NEXT ARCHIVAL RELEASE. SIGN UP FOR ENCRYPTED ALERTS.</p>
<form className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
<input className="flex-grow bg-transparent border-b-2 border-white focus:border-white focus:ring-0 text-white placeholder:text-white/50 font-headline-md py-4" placeholder="EMAIL ADDRESS" type="email"/>
<button className="bg-white text-primary font-headline-md px-12 py-4 uppercase hover:bg-on-surface hover:text-white transition-colors duration-200" type="submit">Subscribe</button>
</form>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full bg-on-surface dark:bg-on-surface">
<div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
<div className="mb-12 md:mb-0">
<h2 className="font-display-xl text-headline-lg text-surface dark:text-surface mb-4">THE DROP</h2>
<p className="text-surface/60 font-body-md max-w-xs uppercase tracking-tight">Editorial excellence in limited apparel.</p>
</div>
<div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
<div>
<p className="text-surface font-label-bold uppercase mb-6">Internal</p>
<ul className="space-y-3">
<li><Link className="text-surface/80 font-body-md hover:text-primary-container transition-colors duration-100" href="/products">Shop</Link></li>
<li><Link className="text-surface/80 font-body-md hover:text-primary-container transition-colors duration-100" href="/summer-sale">New Arrivals</Link></li>
<li><Link className="text-surface underline font-body-md" href="/our-story">About</Link></li>
</ul>
</div>
<div>
<p className="text-surface font-label-bold uppercase mb-6">Service</p>
<ul className="space-y-3">
<li><Link className="text-surface/80 font-body-md hover:text-primary-container transition-colors duration-100" href="#">Shipping</Link></li>
<li><Link className="text-surface/80 font-body-md hover:text-primary-container transition-colors duration-100" href="#">Returns</Link></li>
<li><Link className="text-surface/80 font-body-md hover:text-primary-container transition-colors duration-100" href="#">Contact</Link></li>
</ul>
</div>
<div className="col-span-2 md:col-span-1">
<p className="text-surface font-label-bold uppercase mb-6">Social</p>
<ul className="flex gap-4">
<li><Link className="text-surface/80 hover:text-primary-container" href="#"><span className="material-symbols-outlined">share</span></Link></li>
<li><Link className="text-surface/80 hover:text-primary-container" href="#"><span className="material-symbols-outlined">camera</span></Link></li>
<li><Link className="text-surface/80 hover:text-primary-container" href="#"><span className="material-symbols-outlined">alternate_email</span></Link></li>
</ul>
</div>
</div>
</div>
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 border-t border-surface/10 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-surface/40 font-label-sm uppercase tracking-widest text-center md:text-left">© 2024 THE DROP EDITORIAL. ALL RIGHTS RESERVED.</p>
<div className="flex gap-6">
<Link className="text-surface/40 font-label-sm uppercase hover:text-surface" href="#">Terms</Link>
<Link className="text-surface/40 font-label-sm uppercase hover:text-surface" href="#">Privacy</Link>
</div>
</div>
</footer>


    </div>
  );
}
