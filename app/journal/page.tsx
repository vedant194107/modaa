"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { addItemToCart } from "@/lib/cartHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

const LOOKBOOK_HOTSPOTS = [
  {
    id: "h1",
    x: "35%",
    y: "32%",
    title: "TACTICAL VEST - MK1",
    price: 210,
    category: "Outerwear",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMOOtcuHRV61KG0L9rtal2PL2jvQOp1ULIYAHxinTJFQzQvPj-rkylCOgVd8lYLQEd0eWs_tz7shvxztz2r4oZor-lTxhTNICCLlu3H75Znozt6Jx74NtwbzE13Jboua3bXx2_tAO9qfwolHV7R90gj7W_cYEJmBnENM6UqPQT6uiRsrIYlhD7CRMXFowE2NpEze1SpiiXD1NabPCbvM9ye1Lji7-Rn0o1vCL58lQHaS1HBhu0xp2KlU8pnIRGn_nnY02HXSGcCIw",
    prodId: "tactical-vest-mk1",
  },
  {
    id: "h2",
    x: "62%",
    y: "48%",
    title: "RAVEN DISTRESSED DENIM",
    price: 245,
    category: "Denim",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    prodId: "prod_1",
  },
  {
    id: "h3",
    x: "42%",
    y: "75%",
    title: "ARCHITECT CARGO SYSTEM",
    price: 180,
    category: "Pants",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fvWUk",
    prodId: "prod_2",
  },
];

const MASONRY_ARTICLES = [
  {
    id: 1,
    title: "MILANO RED: DECODING THE PALETTE",
    category: "DESIGN",
    date: "JUNE 2025",
    excerpt: "A deep dive into the signature high-chroma red dye created in collaboration with Italian textile artisans. It takes roughly 48 hours to perfect a single vat.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC60DvjPAvtJNwZUB6gvVVVkOmUOyk3SgGFQYSu0pr0MaB5e2HtXQCDO0Yr-j2gy034HdSfX4jdv3uxSFqnNS9kAikAmLmDlmvwyefAA27JsL7zHcerksXsCBit7rgCqv0fAGi2Pt8-ZbgH0_S0_0niX8t3qkeNL6pAf6MNnDC4jRsqRtIF3BctxpUaq3YSTvFI2cl146f0A6EK3Guo-_cgukPAUFTKWk2aXhPOr_Kl5fFVWzMBoduQk6nas4iQonhAE3mnYuSUg0I",
    heightClass: "aspect-[3/4]",
  },
  {
    id: 2,
    title: "RAW TAILORING & UTILITY",
    category: "CRAFT",
    date: "MAY 2025",
    excerpt: "Blending tactical functionality with bespoke luxury outerwear construction techniques.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro",
    heightClass: "aspect-square",
  },
  {
    id: 3,
    title: "TOKYO NIGHTS: ARCHIVAL CULTURE",
    category: "CULTURE",
    date: "APRIL 2025",
    excerpt: "On the ground in Shibuya documenting the underground collectors shaping tomorrow's fashion landscape.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-ybPowjH9-5SO4FX2Ic3FvO3Pd5HTuB65moyGJvulvdX6Xkm-v1D7gOO7QSH2aMlEDnIz1EOhAahLNsLx4Kb7TjMzAcIkODsxROPQg_SPRjNRFYSnZtxiNd5n7GcjFM8G2LACAY2cq8WDt0CF0YlNH79TV6reNPlOp4BlRZFY9PgoF5THBQ07Hh-cxXpMNDX8X-SJgplxel4gYZ0Vsh0YCUGIW2GQrUyQVTuY-YYdGTN-hOleKcZYxZiRXzKaUpRyvVcrURW-e8o",
    heightClass: "aspect-[4/5]",
  },
  {
    id: 4,
    title: "THE SOUND OF SILENCE",
    category: "AUDIO",
    date: "MARCH 2025",
    excerpt: "Why we integrated avant-garde atmospheric ambient drones into our digital storefronts.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700",
    heightClass: "aspect-[16/9]",
  },
  {
    id: 5,
    title: "BRUTALISM IN UI",
    category: "DIGITAL",
    date: "FEB 2025",
    excerpt: "Stripping away the excess. Embracing raw structure, heavy borders, and unapologetic contrast.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700",
    heightClass: "aspect-[3/4]",
  },
];

export default function JournalPage() {
  const [activeHotspot, setActiveHotspot] = useState<any | null>(null);
  const [addedMsg, setAddedMsg] = useState("");
  const currency: CurrencyCode = getActiveCurrency();

  const handleQuickAdd = (spot: any) => {
    addItemToCart({
      id: spot.prodId,
      title: spot.title,
      price: spot.price,
      image: spot.image,
    });
    setAddedMsg(`✓ ADDED ${spot.title} TO YOUR BAG!`);
    setTimeout(() => setAddedMsg(""), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      <Navbar />

      {/* Hero Parallax Area */}
      <div 
        className="w-full h-[60vh] md:h-[80vh] bg-fixed bg-center bg-cover border-b-4 border-on-surface flex items-center justify-center relative overflow-hidden"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center max-w-4xl px-4 animate-fadeIn">
          <span className="font-label-bold text-sm text-milano-red uppercase tracking-[0.3em] bg-white px-4 py-2 border-2 border-on-surface mb-6 inline-block">EDITORIAL SERIES 004</span>
          <h1 className="font-display-xl text-6xl md:text-[100px] text-white uppercase leading-none mix-blend-difference">
            THE JOURNAL
          </h1>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-4 md:px-12 py-16 space-y-24">
        
        {/* INTERACTIVE EDITORIAL LOOKBOOK CAMPAIGN WITH HOTSPOTS */}
        <section className="border-4 border-on-surface bg-surface p-6 md:p-12 shadow-[12px_12px_0px_0px_#a90e02]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="max-w-2xl">
              <span className="font-label-bold text-xs uppercase text-milano-red tracking-[0.2em] font-bold block mb-2">INTERACTIVE SHOPPABLE CAMPAIGN</span>
              <h2 className="font-display-xl text-4xl md:text-5xl uppercase leading-none">FALL / WINTER ATELIER LOOKBOOK</h2>
              <p className="mt-4 font-body-md opacity-70">Explore our latest structural outfitter collection. Tap targets on the image below to view and shop pieces directly from the editorial shoot.</p>
            </div>
          </div>

          {addedMsg && (
            <div className="bg-milano-red text-lemon-chiffon p-4 font-label-bold text-xs uppercase border-2 border-on-surface animate-fadeIn flex justify-between items-center mb-6">
              <span>{addedMsg}</span>
              <span className="material-symbols-outlined text-base">check_circle</span>
            </div>
          )}

          {/* Campaign Image Canvas */}
          <div className="relative aspect-[4/5] sm:aspect-[16/9] border-4 border-on-surface overflow-hidden bg-black group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700"
              alt="Editorial Lookbook"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
            />

            {LOOKBOOK_HOTSPOTS.map((spot) => {
              const isActive = activeHotspot?.id === spot.id;
              return (
                <div key={spot.id} style={{ left: spot.x, top: spot.y }} className="absolute -translate-x-1/2 -translate-y-1/2 z-30">
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : spot)}
                    className="relative flex items-center justify-center w-10 h-10 cursor-pointer focus:outline-none"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-milano-red opacity-75"></span>
                    <span className={`relative inline-flex rounded-full h-8 w-8 border-2 border-lemon-chiffon flex items-center justify-center font-bold text-lg shadow-2xl transition-transform ${isActive ? "bg-on-surface text-lemon-chiffon scale-125 rotate-45" : "bg-milano-red text-lemon-chiffon hover:scale-110"}`}>
                      +
                    </span>
                  </button>

                  {isActive && (
                    <div className="absolute left-1/2 bottom-full mb-4 -translate-x-1/2 w-72 bg-lemon-chiffon border-4 border-on-surface p-4 shadow-[8px_8px_0px_0px_#000] z-50 animate-fadeIn">
                      <div className="flex gap-4">
                        <img src={spot.image} alt={spot.title} className="w-20 h-24 object-cover border-2 border-on-surface bg-white shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-label-bold text-[10px] uppercase text-milano-red font-bold block tracking-widest">{spot.category}</span>
                          <h4 className="font-headline-md text-sm uppercase leading-tight mt-1 mb-2">{spot.title}</h4>
                          <span className="font-headline-md text-base block">{formatPrice(spot.price, currency)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 mt-4 border-t-2 border-on-surface/20">
                        <button
                          onClick={() => handleQuickAdd(spot)}
                          className="flex-1 py-3 bg-milano-red text-lemon-chiffon font-label-bold text-[10px] uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface"
                        >
                          QUICK ADD
                        </button>
                        <Link
                          href={`/product-detail?id=${encodeURIComponent(spot.prodId)}`}
                          className="px-4 py-3 bg-surface text-on-surface font-label-bold text-[10px] uppercase tracking-widest hover:bg-on-surface hover:text-lemon-chiffon transition-colors border-2 border-on-surface"
                        >
                          VIEW
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Masonry Blog Layout */}
        <section>
          <div className="mb-12 border-b-4 border-on-surface pb-4">
            <h2 className="font-display-xl text-5xl md:text-7xl uppercase">DISPATCHES</h2>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {MASONRY_ARTICLES.map((article) => (
              <div key={article.id} className="break-inside-avoid animate-fadeIn group">
                <Link href="/our-story" className="block border-4 border-on-surface bg-surface hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_#000]">
                  <div className={`w-full overflow-hidden border-b-4 border-on-surface ${article.heightClass}`}>
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-label-bold text-[10px] text-milano-red uppercase tracking-[0.2em]">{article.category}</span>
                      <span className="font-label-bold text-[10px] uppercase opacity-50">{article.date}</span>
                    </div>
                    <h3 className="font-headline-md text-2xl uppercase mb-4 leading-tight">{article.title}</h3>
                    <p className="font-body-md text-sm opacity-80 mb-6">{article.excerpt}</p>
                    <span className="font-label-bold text-[10px] uppercase border-b-2 border-on-surface pb-1 group-hover:text-milano-red group-hover:border-milano-red transition-colors inline-block tracking-widest">
                      READ ARCHIVE →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <div className="bg-milano-red text-lemon-chiffon p-12 md:p-24 border-4 border-on-surface text-center shadow-[16px_16px_0px_0px_#000]">
          <h2 className="font-display-xl text-5xl md:text-7xl uppercase mb-6">THE ARCHIVE DISPATCH</h2>
          <p className="font-body-lg text-lg opacity-90 max-w-2xl mx-auto mb-12 uppercase tracking-wide">
            Access private editorials, atelier notes, and early collection drops.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              className="flex-1 bg-surface text-on-surface border-4 border-on-surface px-6 py-5 placeholder:text-on-surface/50 focus:outline-none font-headline-md text-lg uppercase" 
              placeholder="ENTER EMAIL ADDRESS" 
              type="email" 
            />
            <button 
              className="bg-on-surface text-lemon-chiffon py-5 px-10 font-headline-md text-xl hover:bg-lemon-chiffon hover:text-on-surface transition-colors uppercase border-4 border-on-surface" 
              type="submit"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
