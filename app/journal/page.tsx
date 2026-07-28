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
      {/* TopNavBar */}
      <Navbar />

      {/* Main Journal Hero */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-label-bold text-xs text-milano-red uppercase tracking-widest font-bold">EDITORIAL SERIES 004</span>
          <h1 className="font-display-xl text-4xl md:text-6xl uppercase mt-2 mb-4">THE JOURNAL & LOOKBOOK</h1>
          <p className="font-body-lg text-base text-on-surface/80">
            Explorations in high-performance streetwear, atelier craftsmanship, and interactive editorial lookbooks. Tap any hotspot target below to shop garments directly from the model campaign photo!
          </p>
        </div>

        {/* ── INTERACTIVE EDITORIAL LOOKBOOK CAMPAIGN WITH HOTSPOTS ── */}
        <section className="border-4 border-on-surface bg-surface p-6 md:p-8 shadow-[10px_10px_0px_0px_#a90e02] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-on-surface pb-4">
            <div>
              <span className="font-label-bold text-xs uppercase text-milano-red tracking-widest font-bold block">INTERACTIVE SHOPPABLE CAMPAIGN</span>
              <h2 className="font-display-xl text-3xl uppercase leading-none">FALL / WINTER ATELIER LOOKBOOK</h2>
            </div>
            <span className="bg-milano-red text-lemon-chiffon px-3 py-1 font-label-bold text-xs uppercase tracking-wider font-bold border border-on-surface">
              TAP HOTSPOTS TO SHOP OUTFIT
            </span>
          </div>

          {addedMsg && (
            <div className="bg-milano-red text-lemon-chiffon p-3 font-label-bold text-xs uppercase border border-on-surface animate-fadeIn flex justify-between items-center">
              <span>{addedMsg}</span>
              <span className="material-symbols-outlined text-base">check_circle</span>
            </div>
          )}

          {/* Campaign Image Canvas Container */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] border-2 border-on-surface overflow-hidden bg-black group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700"
              alt="Editorial Campaign Model Lookbook"
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Render Pulsing Hotspots */}
            {LOOKBOOK_HOTSPOTS.map((spot) => {
              const isActive = activeHotspot?.id === spot.id;
              return (
                <div
                  key={spot.id}
                  style={{ left: spot.x, top: spot.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : spot)}
                    className="relative flex items-center justify-center w-8 h-8 cursor-pointer focus:outline-none"
                    title={`Click to view ${spot.title}`}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-milano-red opacity-75"></span>
                    <span className={`relative inline-flex rounded-full h-7 w-7 border-2 border-lemon-chiffon flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${
                      isActive ? "bg-on-surface text-lemon-chiffon scale-125" : "bg-milano-red text-lemon-chiffon hover:scale-110"
                    }`}>
                      +
                    </span>
                  </button>

                  {/* Hotspot Garment Card Popover */}
                  {isActive && (
                    <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-64 bg-lemon-chiffon border-2 border-on-surface p-3 shadow-[6px_6px_0px_0px_#000] z-50 animate-fadeIn space-y-2">
                      <div className="flex gap-3">
                        <img src={spot.image} alt={spot.title} className="w-16 h-20 object-cover border border-on-surface bg-white shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-label-bold text-[9px] uppercase text-milano-red font-bold block">{spot.category}</span>
                          <h4 className="font-headline-md text-xs uppercase leading-tight truncate">{spot.title}</h4>
                          <span className="font-headline-md text-sm text-milano-red font-bold block mt-1">
                            {formatPrice(spot.price, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-on-surface/20">
                        <button
                          onClick={() => handleQuickAdd(spot)}
                          className="flex-1 py-2 bg-milano-red text-lemon-chiffon font-headline-md text-[10px] uppercase tracking-wider hover:bg-on-surface transition-colors border border-on-surface cursor-pointer"
                        >
                          QUICK ADD
                        </button>
                        <Link
                          href={`/product-detail?id=${encodeURIComponent(spot.prodId)}`}
                          className="px-2.5 py-2 bg-surface text-on-surface font-label-bold text-[10px] uppercase hover:bg-on-surface hover:text-lemon-chiffon transition-colors border border-on-surface"
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

        {/* Featured Article Hero */}
        <div className="border-4 border-on-surface shadow-[8px_8px_0px_0px_#a90e02] overflow-hidden bg-surface">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-7 aspect-[16/10] md:aspect-auto relative overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="Architectural Streetwear Feature"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700"
              />
            </div>
            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-between border-t-2 md:border-t-0 md:border-l-2 border-on-surface bg-surface">
              <div>
                <div className="flex items-center gap-4 mb-4 font-label-bold text-xs text-milano-red uppercase font-bold">
                  <span>ESSAY / 04</span>
                  <span>•</span>
                  <span>JULY 2025</span>
                </div>
                <h2 className="font-headline-lg text-3xl md:text-4xl uppercase mb-6 leading-tight">
                  CHRONICLES OF THE CONCRETE: THE ARCHITECTURE OF STREETWEAR
                </h2>
                <p className="font-body-md text-sm opacity-80 mb-8">
                  How brutalist urban landscapes inspired our latest drop of Milano Red heavy-gauge cotton and technical outerwear.
                </p>
              </div>
              <Link href="/our-story" className="w-fit bg-milano-red text-lemon-chiffon py-4 px-8 font-headline-md text-sm uppercase hover:bg-on-surface transition-colors border-2 border-on-surface">
                READ FEATURED STORY
              </Link>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="border-4 border-on-surface bg-surface flex flex-col justify-between shadow-[6px_6px_0px_0px_#a90e02]">
            <div className="aspect-[3/2] overflow-hidden border-b-2 border-on-surface">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Milano Red Colorway"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC60DvjPAvtJNwZUB6gvVVVkOmUOyk3SgGFQYSu0pr0MaB5e2HtXQCDO0Yr-j2gy034HdSfX4jdv3uxSFqnNS9kAikAmLmDlmvwyefAA27JsL7zHcerksXsCBit7rgCqv0fAGi2Pt8-ZbgH0_S0_0niX8t3qkeNL6pAf6MNnDC4jRsqRtIF3BctxpUaq3YSTvFI2cl146f0A6EK3Guo-_cgukPAUFTKWk2aXhPOr_Kl5fFVWzMBoduQk6nas4iQonhAE3mnYuSUg0I"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-label-bold text-xs text-milano-red uppercase block mb-2 font-bold">DESIGN • JUNE 2025</span>
                <h3 className="font-headline-md text-2xl uppercase mb-3 leading-snug">MILANO RED: DECODING THE PALETTE</h3>
                <p className="font-body-md text-sm opacity-70 mb-6">A deep dive into the signature high-chroma red dye created in collaboration with Italian textile artisans.</p>
              </div>
              <Link href="/our-story" className="font-label-bold text-xs uppercase underline hover:text-milano-red transition-colors font-bold">READ ESSAY →</Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border-4 border-on-surface bg-surface flex flex-col justify-between shadow-[6px_6px_0px_0px_#a90e02]">
            <div className="aspect-[3/2] overflow-hidden border-b-2 border-on-surface">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Raw Tailoring"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-label-bold text-xs text-milano-red uppercase block mb-2 font-bold">CRAFT • MAY 2025</span>
                <h3 className="font-headline-md text-2xl uppercase mb-3 leading-snug">RAW TAILORING & UTILITY</h3>
                <p className="font-body-md text-sm opacity-70 mb-6">Blending tactical functionality with bespoke luxury outerwear construction techniques.</p>
              </div>
              <Link href="/our-story" className="font-label-bold text-xs uppercase underline hover:text-milano-red transition-colors font-bold">READ ESSAY →</Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border-4 border-on-surface bg-surface flex flex-col justify-between shadow-[6px_6px_0px_0px_#a90e02]">
            <div className="aspect-[3/2] overflow-hidden border-b-2 border-on-surface">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                alt="Tokyo Nights"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-ybPowjH9-5SO4FX2Ic3FvO3Pd5HTuB65moyGJvulvdX6Xkm-v1D7gOO7QSH2aMlEDnIz1EOhAahLNsLx4Kb7TjMzAcIkODsxROPQg_SPRjNRFYSnZtxiNd5n7GcjFM8G2LACAY2cq8WDt0CF0YlNH79TV6reNPlOp4BlRZFY9PgoF5THBQ07Hh-cxXpMNDX8X-SJgplxel4gYZ0Vsh0YCUGIW2GQrUyQVTuY-YYdGTN-hOleKcZYxZiRXzKaUpRyvVcrURW-e8o"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-label-bold text-xs text-milano-red uppercase block mb-2 font-bold">CULTURE • APRIL 2025</span>
                <h3 className="font-headline-md text-2xl uppercase mb-3 leading-snug">TOKYO NIGHTS: ARCHIVAL CULTURE</h3>
                <p className="font-body-md text-sm opacity-70 mb-6">On the ground in Shibuya documenting the underground collectors shaping tomorrow's fashion landscape.</p>
              </div>
              <Link href="/our-story" className="font-label-bold text-xs uppercase underline hover:text-milano-red transition-colors font-bold">READ ESSAY →</Link>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-milano-red text-lemon-chiffon p-10 md:p-16 border-4 border-on-surface text-center max-w-4xl mx-auto shadow-[10px_10px_0px_0px_#000]">
          <h2 className="font-headline-lg text-4xl uppercase mb-4">JOIN THE JOURNAL DISPATCH</h2>
          <p className="font-body-lg text-sm md:text-base opacity-90 max-w-xl mx-auto mb-8 uppercase">Receive early editorial essays, behind-the-scenes atelier notes, and private collection drop dates directly to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input className="flex-1 bg-lemon-chiffon text-on-surface border-2 border-on-surface px-6 py-4 placeholder:text-on-surface/60 focus:outline-none font-label-bold text-xs uppercase" placeholder="ENTER YOUR EMAIL ADDRESS" type="email" />
            <button className="bg-on-surface text-lemon-chiffon py-4 px-8 font-headline-md text-sm hover:bg-lemon-chiffon hover:text-on-surface transition-colors uppercase border-2 border-on-surface cursor-pointer" type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
