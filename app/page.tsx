"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

const HERO_SLIDES = [
  {
    id: "slide_1",
    tag: "LIMITED ARCHIVE DROP // 004/24",
    titleLine1: "RARE",
    titleLine2: "ESSENTIALS",
    titleLine3: "004 / 24",
    desc: "High-performance streetwear engineered for the modern landscape. Limited quantities. Uncompromising quality.",
    bg: "bg-milano-red text-lemon-chiffon",
    btnStyle: "bg-on-surface text-lemon-chiffon hover:bg-lemon-chiffon hover:text-on-surface",
    imgMain: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6VkH8nooirJnN2OH0SPitwY0p6wAty_ThByoyBlfp0sarheVj7Xb-w9YbA6Pq7EsWxGSl-xCukOJC7_0-H-m1qphanZJqm3E0ghW7R_yvYZ8jzvShGI8WM2iai_Z-W0xjLP939T917IhPtTvJkH1E7DNgtT9chGd8l-Qgg9pln3DybHRp5rxlY4IaHFc-BM5pNtghB-VtpP3rZblsFoYs0zrOaw2oYiLAL-Js2dPKS6M1-fUJ4pVJYRbj3nwmM7R1P1h1kOzNiek",
    imgSecondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    link: "/product-detail?id=prod_1784982567628",
    productName: "MILANO RED PUFFER JACKET",
    category: "OUTERWEAR",
    price: 245,
  },
  {
    id: "slide_2",
    tag: "TECHNICAL UTILITY SYSTEM",
    titleLine1: "ARCHITECT",
    titleLine2: "CARGO",
    titleLine3: "SYSTEM",
    desc: "Multi-pocket modular ripstop cargo pants engineered for tactical utility and articulated mobility.",
    bg: "bg-on-surface text-lemon-chiffon",
    btnStyle: "bg-milano-red text-lemon-chiffon hover:bg-lemon-chiffon hover:text-on-surface",
    imgMain: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fvWUk",
    imgSecondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqi2F8P9NDi5gTUY3VeIUxDLfmsVXF6QAwZVYSg5cLwYd9FGDs4CMLAc8f-KxMulLbfwOUsA7GDnWNsBkX7pl7855UQKwDPmd-buyjMkewMW6kUtQUrTymR5LAJOYe9rdcxAkK3P8jh1rScRKr88naZGd6KcM8nIm-i6bVF1m-S6NgvKNJTRY592ihZf4Y46mUh6bGSYjYEF90Sfd3T2BjVN2nWDNUkW8-LAfIQbRxH3PjVBwkMO8mbVrezAqAa5x0BY8_cbQyUGU",
    link: "/product-detail?id=prod_2",
    productName: "ARCHITECT CARGO SYSTEM",
    category: "PANTS",
    price: 180,
  },
  {
    id: "slide_3",
    tag: "500GSM HEAVYWEIGHT KNIT",
    titleLine1: "URBAN",
    titleLine2: "DECAY",
    titleLine3: "HOODIE",
    desc: "Custom woven ultra-dense cotton fleece featuring signature distressed contrast stitching and boxy drop-shoulder cut.",
    bg: "bg-surface-container text-on-surface",
    btnStyle: "bg-milano-red text-lemon-chiffon hover:bg-on-surface hover:text-lemon-chiffon",
    imgMain: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmM3dFYFdmbfG8iyYU1FdgUgiWIXoAbojb-UTfat8oLcmGbNgbwKoAgxqjMQUdZRMT-EPGAjtIo27Ze6dnms3MQv8cqNqVYimWK8aEmEJwBxqnQeMej_Ks-hdp4AIrPXhNjp6W9dRCvDWNF5Qwjkyqqbj8bQrU9ENQZxP7LbibxLP4kAWs8tCOiZO5ldpUsGjs9ycmLt-glI-0aZusmDv6BWypRdxLicFBsRQmHbhVtd8g6mXb-w57CSm2Kf5osP7PYARA83fRE7M",
    imgSecondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrsfzMMAc4AsPLC2kiQ-KJsQQhq2LtlUPizDxjwYMq4JjUnOmN4Z0sEFBGU96ZHttvj7wO2v6PwVByUKqaIaIC-AScypD1VxHeaZZr_shSJHWbVKL0qnVPguPxkZUZOpaGSRTgpfcCb_X3JIN1NlYBJHPdXwaDj92yaTzwOal-RNCYTiytmJHxL97b2VrMocPVblMBZerunLeiSh8NqrYfoOx-Nhv95q18Tak4hhQuey_LyWpSuWwYQnEP18eoFvyhLlbu_a_5lok",
    link: "/product-detail?id=prod_3",
    productName: "CORE 500GSM HOODIE",
    category: "TOPS",
    price: 155,
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  // Auto-advance slides every 4 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="w-full min-h-screen">
      {/* TopNavBar */}
      <Navbar />

      {/* ── ANIMATED DYNAMIC HERO REEL SECTION ── */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`relative min-h-[650px] sm:min-h-[750px] md:min-h-[850px] flex items-center overflow-hidden py-12 sm:py-16 transition-colors duration-700 ${slide.bg}`}
      >
        {/* Subtle Noise / Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="md:col-span-6 space-y-6 animate-fadeIn">
            <span className="font-label-bold text-xs uppercase tracking-widest px-3 py-1 bg-on-surface text-lemon-chiffon inline-block border border-on-surface font-bold shadow-[2px_2px_0px_0px_#a90e02]">
              {slide.tag}
            </span>

            <h1 className="font-display-xl text-5xl sm:text-7xl md:text-8xl uppercase leading-[0.88] tracking-tight drop-shadow-md">
              {slide.titleLine1}<br />
              {slide.titleLine2}<br />
              <span className="text-amber-300 underline decoration-milano-red underline-offset-8">{slide.titleLine3}</span>
            </h1>

            <p className="font-body-lg text-sm sm:text-base md:text-lg max-w-md opacity-90 leading-relaxed font-medium">
              {slide.desc}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={slide.link}
                className={`inline-block font-label-bold uppercase tracking-widest text-xs sm:text-sm py-3 sm:py-4 px-6 sm:px-8 transition-all ${slide.btnStyle} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              >
                SHOP NOW — {formatPrice(slide.price, currency)}
              </Link>
              <Link
                href="/products"
                className="text-center py-4 px-8 font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface bg-lemon-chiffon text-on-surface hover:bg-on-surface hover:text-lemon-chiffon transition-colors font-bold"
              >
                VIEW FULL CATALOG
              </Link>
            </div>
          </div>

          {/* Right Column: Animated Dual-Layer Image Carousel */}
          <div className="md:col-span-6 relative h-[360px] sm:h-[480px] md:h-[580px] flex items-center justify-center">
            
            {/* Background Secondary Image Card (Sliding Parallax Layer) */}
            <div className="absolute top-4 left-0 w-2/3 h-3/4 z-10 border-4 border-on-surface overflow-hidden shadow-[8px_8px_0px_0px_#000] transition-all duration-700 transform hover:rotate-1">
              <Link href={slide.link} className="block w-full h-full">
                <img
                  key={`sec-${slide.id}`}
                  src={slide.imgSecondary}
                  alt={slide.productName}
                  className="w-full h-full object-cover animate-fadeIn scale-100 hover:scale-110 transition-transform duration-700"
                />
              </Link>
              <span className="absolute top-2 left-2 bg-milano-red text-lemon-chiffon font-label-bold text-[9px] px-2 py-0.5 uppercase tracking-wider">
                ARCHIVE LOOKBOOK
              </span>
            </div>

            {/* Foreground Main Image Card (Interactive Focal Layer) */}
            <div className="absolute bottom-4 right-0 w-3/4 h-4/5 z-20 border-4 border-on-surface overflow-hidden shadow-[12px_12px_0px_0px_#a90e02] transition-all duration-700 transform hover:-translate-y-2">
              <Link href={slide.link} className="block w-full h-full group relative">
                <img
                  key={`main-${slide.id}`}
                  src={slide.imgMain}
                  alt={slide.productName}
                  className="w-full h-full object-cover animate-fadeIn group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Telemetry Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-lemon-chiffon/95 border-2 border-on-surface p-3 backdrop-blur-sm flex justify-between items-center text-on-surface">
                  <div>
                    <span className="font-label-bold text-[9px] uppercase tracking-widest text-milano-red font-bold block">{slide.category}</span>
                    <p className="font-headline-md text-sm uppercase truncate font-bold">{slide.productName}</p>
                  </div>
                  <span className="font-display-xl text-lg text-milano-red">{slide.price}</span>
                </div>
              </Link>
            </div>

            {/* Carousel Navigation Arrow Controls (Floating on Desktop) */}
            <div className="absolute bottom-2 left-2 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-10 h-10 border-2 border-on-surface bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                title="Previous Editorial Slide"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-10 h-10 border-2 border-on-surface bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                title="Next Editorial Slide"
              >
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Indicator Dots & Bar at Bottom */}
        <div className="absolute bottom-4 inset-x-0 z-20 max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 transition-all duration-300 border border-on-surface cursor-pointer ${
                  currentSlide === idx ? "w-10 bg-amber-300" : "w-3 bg-lemon-chiffon/60 hover:bg-lemon-chiffon"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <span className="font-label-bold text-[10px] uppercase tracking-widest bg-on-surface text-lemon-chiffon px-2.5 py-1 border border-on-surface">
            {isPaused ? "PAUSED" : "AUTO-SWIPE ON"} ({currentSlide + 1} / {HERO_SLIDES.length})
          </span>
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="py-12 sm:py-16 md:py-section-gap bg-background">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop mb-8 sm:mb-12 flex justify-between items-end">
          <div>
            <span className="font-label-bold text-xs sm:text-label-bold text-primary uppercase tracking-widest">JUST ARRIVED</span>
            <h2 className="font-headline-lg text-2xl sm:text-4xl md:text-headline-lg uppercase">NEW ARRIVALS</h2>
          </div>
          <Link className="font-label-bold text-xs sm:text-label-bold underline hover:text-primary transition-colors" href="/products">VIEW ALL</Link>
        </div>
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop">
          <div className="hide-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-gutter pb-6 sm:pb-12">
            {/* Product Card 1 */}
            <div className="snap-start flex-none w-[220px] sm:w-[300px] md:w-[400px] group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-3 sm:mb-4 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail?id=prod_1">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Archive Hoodie" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro"/>
                </Link>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-white px-2.5 sm:px-3 py-1 font-label-bold text-[10px] sm:text-label-sm">SOLD OUT</div>
              </div>
              <div className="pt-2 border-t-2 border-on-surface">
                <h3 className="font-label-bold text-xs sm:text-label-bold uppercase truncate">ARCHIVE HOODIE / BLK</h3>
                <p className="font-body-md text-xs sm:text-body-md opacity-70">{formatPrice(185, currency)}</p>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="snap-start flex-none w-[220px] sm:w-[300px] md:w-[400px] group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-3 sm:mb-4 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail?id=prod_2">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Tactical Pant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDttnpXadaa46-oxQNQSH17C1Mf46Pdm_xTRrTCufhocwbzysLEJAMwaktgNSequZEN0IAM36LmZdW-mhJj4y_2ZkmvsaAnw2K1Qq3HXRHVQfMy1NjqxI26G7n3jaQWrQvZvxXAIxX-nadn4mJGHj6Xzbfp6lwiUS8fGN_N1MfB3cHUKS5qQTZ0soX8540QCjOEFEpzGudvIgP7_RhzbkvYLtuY7mlK_2Xg3V4j5dtTmdPfNJgnDrqbJI_ZOELGwWGCd5VcdZmuHLI"/>
                </Link>
              </div>
              <div className="pt-2 border-t-2 border-on-surface">
                <h3 className="font-label-bold text-xs sm:text-label-bold uppercase truncate">TACTICAL PANT 02</h3>
                <p className="font-body-md text-xs sm:text-body-md opacity-70">{formatPrice(240, currency)}</p>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="snap-start flex-none w-[220px] sm:w-[300px] md:w-[400px] group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-3 sm:mb-4 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail?id=prod_3">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Graphic Tee" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqBXdrJO3-EFMJCE6sbxxP41wzr3xX7pN6BKhteHRo31X-0oOV6PjO2iDitxmHh132-dZQ0rE-Pf-aGtuhsVogJSfE3GYjuCHhOf57uDv6h06-NKhkwg8_-8_BTNo5axg6dX1iu-CKYY65esVx36vtQJ8u7b2IjaWimtABgQE6gz0aHOziSiIBLrzG0MP1-oAN_Jx9XzLEReWYrFLZwwmqGGSMbzbR8qQULP8P3iygBSWRjaTJT5K9ZwfkgSynfPbr0qFZ69BebJs"/>
                </Link>
              </div>
              <div className="pt-2 border-t-2 border-on-surface">
                <h3 className="font-label-bold text-xs sm:text-label-bold uppercase truncate">GRAPHIC TEE / RED</h3>
                <p className="font-body-md text-xs sm:text-body-md opacity-70">{formatPrice(75, currency)}</p>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="snap-start flex-none w-[220px] sm:w-[300px] md:w-[400px] group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden mb-3 sm:mb-4 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail?id=prod_4">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Tech Sling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYZY7z2ZrxeLdlhYfAoaTtUm-tsH2pQ6C65MW36Q_Dny63WBlpUgSs7N-sZA_CnCsv0Xzgct-8rxBbquXRrJiVOJxRQ4KujwoqMXEoPlTKCxxGEXrvsVMoing9XBPiMhUpcYjgyxhmSPvC8mXqeslzyGyr-WOI6O0UlD0Wl64LyILJ8HOIetR_C6FmGdD3PIHPwBx37Rs0hXeLkDuXxNkP8KbOICK042ADdBCHl9-tGhefIBUqImwFumqQ5JAwc--ZXDWU_xzLAXo"/>
                </Link>
              </div>
              <div className="pt-2 border-t-2 border-on-surface">
                <h3 className="font-label-bold text-xs sm:text-label-bold uppercase truncate">TECH SLING / 01</h3>
                <p className="font-body-md text-xs sm:text-body-md opacity-70">{formatPrice(130, currency)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop">
          <div className="w-full h-[2px] bg-surface-variant relative">
            <div className="absolute left-0 top-0 h-full bg-on-surface w-1/4 transition-all duration-300" id="carousel-progress"></div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-8 sm:py-16 md:py-section-gap bg-surface-container my-8 sm:my-16 md:my-20">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-gutter h-auto md:h-[650px] lg:h-[750px]">
          {/* MEN Category Card */}
          <Link 
            className="md:col-span-8 group relative overflow-hidden border-2 border-on-surface min-h-[260px] h-[300px] sm:h-[400px] md:h-full block w-full bg-on-surface" 
            href="/products"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" 
              alt="MEN Collection" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent group-hover:via-on-surface/20 transition-colors duration-500 z-10"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20">
              <span className="font-label-bold text-[10px] sm:text-xs text-white uppercase tracking-widest bg-primary px-2.5 py-1 mb-2 inline-block shadow-md">
                Featured Collection
              </span>
              <h3 className="font-display-xl text-3xl sm:text-5xl md:text-headline-lg text-white uppercase drop-shadow-md">
                MEN'S COLLECTION
              </h3>
            </div>
          </Link>

          {/* WOMEN Category Card */}
          <Link 
            className="md:col-span-4 group relative overflow-hidden border-2 border-on-surface min-h-[260px] h-[300px] sm:h-[400px] md:h-full block w-full bg-on-surface" 
            href="/products"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" 
              alt="WOMEN Collection" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC2bYg0-sJc88bY1LhPq7T1S4b-1P0jG5wY70Hk8XzV62pL5R88y1M-pW7g5eX6q4n2wR7u-T5y8-Q2x1w6h2j8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent group-hover:via-on-surface/20 transition-colors duration-500 z-10"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-20">
              <span className="font-label-bold text-[10px] sm:text-xs text-white uppercase tracking-widest bg-primary px-2.5 py-1 mb-2 inline-block shadow-md">
                Archive Drop
              </span>
              <h3 className="font-display-xl text-3xl sm:text-4xl md:text-headline-lg text-white uppercase drop-shadow-md">
                WOMEN'S
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
