"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
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
  const [scrollY, setScrollY] = useState(0);
  const revealRef = useRef<HTMLElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const lookbookRef = useRef<HTMLElement>(null);
  const [lookbookProgress, setLookbookProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentArrivalSlide, setCurrentArrivalSlide] = useState(0);
  const [arrivalTouchStart, setArrivalTouchStart] = useState<number | null>(null);
  const [isArrivalDragging, setIsArrivalDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
const [touchStart, setTouchStart] = useState<number | null>(null);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload sticky scroll animation frames
  useEffect(() => {
    // We delay the preload slightly so it doesn't block initial page load
    const timer = setTimeout(() => {
      for (let i = 1; i <= 270; i++) {
        const img = new window.Image();
        img.src = `/men_sequence/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    
return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      
      setScrollY(window.scrollY);
      if (revealRef.current) {
        const rect = revealRef.current.getBoundingClientRect();
        if (rect.top <= 0) {
          const progress = Math.min(1, -rect.top / window.innerHeight);
          setRevealProgress(progress);
        } else {
          setRevealProgress(0);
        }
      }

      if (lookbookRef.current) {
        const rect = lookbookRef.current.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
          const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
          setLookbookProgress(progress);
        } else if (rect.top > 0) {
          setLookbookProgress(0);
        } else if (rect.bottom < window.innerHeight) {
          setLookbookProgress(1);
        }
      }


    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-advance slides every 5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const [isHeroDragging, setIsHeroDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsHeroDragging(true);
    setTouchStart(e.clientX);
    setIsPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsHeroDragging(false);
    if (touchStart === null) return;
    const diff = touchStart - e.clientX;
    
    if (diff > 50) {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (diff < -50) {
      setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
    setTouchStart(null);
    setIsPaused(false);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (isHeroDragging) {
      handlePointerUp(e);
    }
  };

  const NEW_ARRIVALS = [
    { id: 'prod_1', title: 'ARCHIVE HOODIE / BLK', price: 185, cat: 'OUTERWEAR', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro' },
    { id: 'prod_2', title: 'TACTICAL PANT 02', price: 240, cat: 'BOTTOMS', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDttnpXadaa46-oxQNQSH17C1Mf46Pdm_xTRrTCufhocwbzysLEJAMwaktgNSequZEN0IAM36LmZdW-mhJj4y_2ZkmvsaAnw2K1Qq3HXRHVQfMy1NjqxI26G7n3jaQWrQvZvxXAIxX-nadn4mJGHj6Xzbfp6lwiUS8fGN_N1MfB3cHUKS5qQTZ0soX8540QCjOEFEpzGudvIgP7_RhzbkvYLtuY7mlK_2Xg3V4j5dtTmdPfNJgnDrqbJI_ZOELGwWGCd5VcdZmuHLI' },
    { id: 'prod_3', title: 'GRAPHIC TEE / RED', price: 75, cat: 'TOPS', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqBXdrJO3-EFMJCE6sbxxP41wzr3xX7pN6BKhteHRo31X-0oOV6PjO2iDitxmHh132-dZQ0rE-Pf-aGtuhsVogJSfE3GYjuCHhOf57uDv6h06-NKhkwg8_-8_BTNo5axg6dX1iu-CKYY65esVx36vtQJ8u7b2IjaWimtABgQE6gz0aHOziSiIBLrzG0MP1-oAN_Jx9XzLEReWYrFLZwwmqGGSMbzbR8qQULP8P3iygBSWRjaTJT5K9ZwfkgSynfPbr0qFZ69BebJs' },
    { id: 'prod_4', title: 'TECH SLING / 01', price: 130, cat: 'ACCESSORIES', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYZY7z2ZrxeLdlhYfAoaTtUm-tsH2pQ6C65MW36Q_Dny63WBlpUgSs7N-sZA_CnCsv0Xzgct-8rxBbquXRrJiVOJxRQ4KujwoqMXEoPlTKCxxGEXrvsVMoing9XBPiMhUpcYjgyxhmSPvC8mXqeslzyGyr-WOI6O0UlD0Wl64LyILJ8HOIetR_C6FmGdD3PIHPwBx37Rs0hXeLkDuXxNkP8KbOICK042ADdBCHl9-tGhefIBUqImwFumqQ5JAwc--ZXDWU_xzLAXo' }
  ];

  const handleArrivalPointerDown = (e: React.PointerEvent) => {
    setIsArrivalDragging(true);
    setArrivalTouchStart(e.clientX);
  };

  const handleArrivalPointerUp = (e: React.PointerEvent) => {
    setIsArrivalDragging(false);
    if (arrivalTouchStart === null) return;
    const diff = arrivalTouchStart - e.clientX;
    
    if (diff > 50) {
      setCurrentArrivalSlide((prev) => Math.min(prev + 1, NEW_ARRIVALS.length - 1));
    } else if (diff < -50) {
      setCurrentArrivalSlide((prev) => Math.max(prev - 1, 0));
    }
    setArrivalTouchStart(null);
  };

  const handleArrivalPointerLeave = (e: React.PointerEvent) => {
    if (isArrivalDragging) {
      handleArrivalPointerUp(e);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <Preloader />
      {/* TopNavBar */}
      <Navbar />

      {/* ── THE ULTIMATE EDITORIAL PARALLAX HERO ── */}
      <section
        ref={heroRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); setMousePos({ x: 0, y: 0 }); }}
        onMouseMove={handleMouseMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`relative w-full h-[calc(100vh-64px)] min-h-[550px] overflow-hidden transition-colors duration-1000 ${slide.bg} flex items-center justify-center select-none touch-pan-y`}
        style={{ perspective: '1500px' }}
      >
        {/* Background Noise and Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:24px_24px] mix-blend-overlay z-0"></div>

        {/* Dynamic Background Typography - Parallax Layer 1 */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] font-display-xl whitespace-nowrap overflow-hidden z-0"
          style={{ 
              transform: `translate(${-mousePos.x * 60}px, ${-mousePos.y * 60}px)`,
              transition: 'transform 0.2s ease-out'
          }}
        >
          <span className="text-[300px] md:text-[500px] leading-none tracking-tighter">
            {slide.titleLine1}
          </span>
        </div>

        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          
          {/* Left: Huge Typography & CTA - Parallax Layer 2 */}
          <div 
            className="w-full md:w-1/2 space-y-6 md:space-y-8 z-20 pt-20 md:pt-0"
            style={{ 
              transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg) translateZ(30px)`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            <div className="inline-flex items-center gap-3 bg-black text-white px-4 py-2 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-milano-red animate-pulse"></span>
              <span className="font-label-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
                {slide.tag}
              </span>
            </div>

            <h1 className="font-display-xl text-7xl sm:text-8xl md:text-[150px] uppercase leading-[0.8] tracking-tighter text-white">
              <span className="block drop-shadow-2xl">{slide.titleLine1}</span>
              <span className="block text-transparent [-webkit-text-stroke:2px_#ffffff] md:[-webkit-text-stroke:3px_#ffffff]">{slide.titleLine2}</span>
              <span className="block drop-shadow-2xl text-milano-red">{slide.titleLine3}</span>
            </h1>

            <p className="font-body-lg text-lg md:text-xl max-w-md leading-relaxed font-medium text-white/90 border-l-4 border-milano-red pl-4">
              {slide.desc}
            </p>

            <div className="pt-4">
              <Link
                href={slide.link}
                className="group relative inline-flex items-center justify-center font-label-bold text-sm md:text-base tracking-[0.2em] py-4 px-10 uppercase bg-white text-black overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  SHOP {formatPrice(slide.price, currency)}
                </span>
                <div className="absolute inset-0 bg-milano-red -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
              </Link>
            </div>
          </div>

          {/* Right: Immersive Images - Parallax Layer 3 */}
          <div className="w-full md:w-1/2 relative h-[50vh] md:h-[80vh] flex items-center justify-center z-10 mt-8 md:mt-0 pointer-events-none">
            
            {/* Secondary Image - Background Floating */}
            <div 
              className="absolute w-[50%] md:w-[55%] h-[60%] md:h-[55%] z-10 shadow-2xl left-0 md:-left-10 bottom-10 md:bottom-20 pointer-events-auto"
              style={{ 
                transform: `translate(${-mousePos.x * 40}px, ${-mousePos.y * 40}px) rotate(${-mousePos.x * 5}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <Link href={slide.link} className="block w-full h-full overflow-hidden border border-white/10 group">
                <img
                  key={`sec-${slide.id}`}
                  src={slide.imgSecondary}
                  alt=""
                  className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                />
              </Link>
            </div>

            {/* Primary Image - Main Focus */}
            <div 
              className="absolute w-[70%] md:w-[65%] h-[80%] md:h-[75%] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] right-0 top-0 md:top-10 pointer-events-auto"
              style={{ 
                transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) rotate(${mousePos.x * 2}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
            >
              <Link href={slide.link} className="block w-full h-full overflow-hidden group border-2 border-white/20">
                <img
                  key={`main-${slide.id}`}
                  src={slide.imgMain}
                  alt={slide.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-milano-red/0 group-hover:bg-milano-red/10 transition-colors duration-500 mix-blend-overlay"></div>
              </Link>
              
              {/* Floating Product Name Badge */}
              <div className="absolute -bottom-6 -left-6 bg-black text-white px-6 py-4 font-headline-md text-2xl tracking-wide shadow-xl border border-white/10 hidden md:block">
                {slide.productName}
              </div>
            </div>
            
            {/* Accent Elements */}
            <div 
              className="absolute top-[10%] right-[-5%] font-display-xl text-8xl text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)] z-0 pointer-events-none"
              style={{ transform: `translate(${-mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
            >
              00{currentSlide + 1}
            </div>
          </div>
        </div>

        {/* Progress Bar & Controls */}
        <div className="absolute bottom-0 w-full z-30 pointer-events-none">
          <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop pb-6 flex items-end justify-end gap-12 pointer-events-auto">
            <div className="flex gap-3">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className="group py-2 flex flex-col gap-2 cursor-pointer"
                >
                  <span className={`text-[10px] font-label-bold tracking-widest transition-colors ${
                    currentSlide === idx 
                      ? slide.bg.includes('bg-surface-container') ? 'text-black' : 'text-white' 
                      : slide.bg.includes('bg-surface-container') ? 'text-black/40 group-hover:text-black/80' : 'text-white/40 group-hover:text-white/80'
                  }`}>
                    0{idx + 1}
                  </span>
                  <div className={`h-[2px] transition-all duration-300 ${
                    currentSlide === idx 
                      ? 'w-16 bg-milano-red' 
                      : slide.bg.includes('bg-surface-container') ? 'w-8 bg-black/20 group-hover:bg-black/40' : 'w-8 bg-white/30 group-hover:bg-white/60'
                  }`}></div>
                </button>
              ))}
            </div>
            
            <div className="hidden md:flex gap-4">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm ${
                  slide.bg.includes('bg-surface-container')
                    ? 'border-black/30 text-black hover:bg-black hover:text-white bg-white/20'
                    : 'border-white/30 text-white hover:bg-white hover:text-black bg-black/20'
                }`}
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm ${
                  slide.bg.includes('bg-surface-container')
                    ? 'border-black/30 text-black hover:bg-black hover:text-white bg-white/20'
                    : 'border-white/30 text-white hover:bg-white hover:text-black bg-black/20'
                }`}
              >
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>
            
      {/* ── KINETIC TYPOGRAPHY MANIFESTO ── */}
      <section className="w-full bg-black text-lemon-chiffon py-24 md:py-40 overflow-hidden flex flex-col justify-center border-t-2 border-on-surface">
        <div className="flex flex-col gap-4 whitespace-nowrap">
          <div 
            className="font-display-xl text-[100px] sm:text-[140px] md:text-[200px] leading-none uppercase tracking-tighter"
            style={{ transform: `translateX(${-30 + (scrollY * 0.02)}vw)` }}
          >
            REDEFINING ARCHIVAL AESTHETICS • REDEFINING ARCHIVAL AESTHETICS • REDEFINING ARCHIVAL AESTHETICS
          </div>
          <div 
            className="font-display-xl text-[100px] sm:text-[140px] md:text-[200px] leading-none uppercase tracking-tighter text-transparent [-webkit-text-stroke:2px_#FFFBD4]"
            style={{ transform: `translateX(${-10 + (scrollY * -0.02)}vw)` }}
          >
            NO COMPROMISE • NO COMPROMISE • NO COMPROMISE • NO COMPROMISE • NO COMPROMISE
          </div>
          <div 
            className="font-display-xl text-[100px] sm:text-[140px] md:text-[200px] leading-none uppercase tracking-tighter text-milano-red"
            style={{ transform: `translateX(${-50 + (scrollY * 0.03)}vw)` }}
          >
            FW26 COLLECTION DROPS NOW • FW26 COLLECTION DROPS NOW • FW26 COLLECTION DROPS NOW
          </div>
        </div>
      </section>

      {/* ── 3D PARALLAX COVERFLOW CAROUSEL ── */}
      <section className="bg-on-surface py-16 sm:py-24 md:py-32 overflow-hidden relative">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-milano-red blur-[120px] mix-blend-screen transition-transform duration-1000" style={{ transform: `translateX(${(currentArrivalSlide - 1.5) * -20}vw)` }}></div>
        </div>

        <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-margin-desktop flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-20 relative z-10">
          <div>
            <span className="font-label-bold text-xs sm:text-label-bold text-lemon-chiffon uppercase tracking-widest block mb-2 opacity-70">JUST ARRIVED // 004</span>
            <h2 className="font-display-xl text-5xl sm:text-7xl md:text-8xl lg:text-[120px] leading-none uppercase text-lemon-chiffon tracking-tighter">
              NEW DROPS
            </h2>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button
              onClick={() => setCurrentArrivalSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentArrivalSlide === 0}
              className="w-12 h-12 rounded-full border border-lemon-chiffon/30 flex items-center justify-center text-lemon-chiffon hover:bg-lemon-chiffon hover:text-on-surface transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-lemon-chiffon cursor-pointer backdrop-blur-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              onClick={() => setCurrentArrivalSlide(prev => Math.min(prev + 1, NEW_ARRIVALS.length - 1))}
              disabled={currentArrivalSlide === NEW_ARRIVALS.length - 1}
              className="w-12 h-12 rounded-full border border-lemon-chiffon/30 flex items-center justify-center text-lemon-chiffon hover:bg-lemon-chiffon hover:text-on-surface transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-lemon-chiffon cursor-pointer backdrop-blur-sm"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 3D Coverflow Container */}
        <div 
          className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center perspective-[1500px] select-none touch-pan-y"
          onPointerDown={handleArrivalPointerDown}
          onPointerUp={handleArrivalPointerUp}
          onPointerLeave={handleArrivalPointerLeave}
        >
          {NEW_ARRIVALS.map((item, idx) => {
            const diff = idx - currentArrivalSlide;
            const absDiff = Math.abs(diff);
            
            // Calculate 3D transforms
            const translateX = diff * (isMobile ? 60 : 120);
            const translateZ = absDiff * -250;
            const rotateY = diff * -25;
            const opacity = 1 - absDiff * 0.3;
            const zIndex = 50 - absDiff;
            
            return (
              <div 
                key={item.id}
                onClick={() => {
                  if (diff !== 0) setCurrentArrivalSlide(idx);
                }}
                className="absolute w-[280px] sm:w-[350px] md:w-[450px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group"
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                  opacity: opacity > 0 ? opacity : 0,
                  zIndex,
                  pointerEvents: absDiff > 2 ? 'none' : 'auto'
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl bg-surface-variant group-hover:shadow-[0_0_40px_rgba(169,14,2,0.15)] transition-shadow duration-500">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 select-none"
                    style={{ transformOrigin: 'center' }}
                  />
                  {/* Subtle glass overlay that disappears when active */}
                  <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${diff === 0 ? 'opacity-0' : 'opacity-40 group-hover:opacity-20'}`}></div>
                  
                  {/* Click to view detail button (only visible on active slide) */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${diff === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <Link href={`/product-detail?id=${item.id}`} className="inline-block w-max bg-lemon-chiffon text-on-surface px-6 py-3 font-headline-md text-sm uppercase tracking-widest hover:bg-milano-red hover:text-white transition-colors">
                        VIEW PRODUCT
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Typography Layer below card */}
                <div className={`mt-6 text-center transition-all duration-700 ${diff === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <span className="font-label-bold text-xs uppercase tracking-widest text-milano-red block mb-2">{item.cat}</span>
                  <h3 className="font-display-xl text-3xl sm:text-4xl uppercase tracking-tighter text-lemon-chiffon mb-1">{item.title}</h3>
                  <p className="font-headline-md text-lg text-lemon-chiffon/70">{formatPrice(item.price, currency)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {NEW_ARRIVALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentArrivalSlide(idx)}
              className={`h-1 transition-all duration-500 ${currentArrivalSlide === idx ? 'w-12 bg-milano-red' : 'w-4 bg-lemon-chiffon/20 hover:bg-lemon-chiffon/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </section>

      
      {/* ── STICKY SCROLL IMAGE SEQUENCE ── */}
      <section ref={revealRef} className="relative w-full h-[300vh] bg-black border-y-2 border-on-surface">
        <div className="sticky top-0 w-full h-screen overflow-hidden bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={`/men_sequence/ezgif-frame-${String(Math.min(270, Math.max(1, Math.floor(revealProgress * 270) + 1))).padStart(3, '0')}.jpg`} 
            alt="Sequence frame" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center pointer-events-none">
            <h2 
              className="font-display-xl text-5xl md:text-8xl lg:text-[120px] uppercase text-white tracking-tighter leading-[0.8] mb-6 drop-shadow-2xl"
              style={{
                opacity: revealProgress > 0.3 && revealProgress < 0.8 ? 1 : 0,
                transform: `translateY(${(0.5 - revealProgress) * 100}px)`,
                transition: 'opacity 0.3s, transform 0.1s ease-out'
              }}
            >
              EXQUISITE<br />DETAILS
            </h2>
            <Link 
              href="/products"
              className="inline-block border-2 border-white text-white px-8 py-4 font-headline-md text-sm tracking-widest hover:bg-white hover:text-black transition-colors pointer-events-auto"
              style={{
                opacity: revealProgress > 0.6 && revealProgress < 0.9 ? 1 : 0,
                transition: 'opacity 0.3s'
              }}
            >
              EXPLORE THE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPANDING SPLIT-SCREEN CATEGORIES ── */}
      <section className="w-full border-t-2 border-on-surface bg-on-surface overflow-hidden">
        <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex flex-col md:flex-row group/split">
          {/* MEN */}
          <Link 
            href="/products"
            className="relative flex-1 md:group-hover/split:flex-1 md:hover:!flex-[2.5] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-b-2 md:border-b-0 md:border-r-2 border-on-surface overflow-hidden group/card"
          >
            <div className="absolute inset-0 bg-on-surface z-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHx3vBVf17o2brWQeW81OeaXsoWtiPZO86beqJrrMpIygPBI_BcWeITDNH11zzRpxiayScS4mlOsuPvqOpQ_iG4sEoC2ov2o3EVS7PmEO495yg4WZkJdOVP6dweokb533Vq1JqF9u54RIqUuPnUMP5NZgBx2h3MTEiJjtmJQWt7-iHH8HJTQ2ndT7xTidl9UGMetHmRpZ6D5GbgyWS2Revn7xDxp_cy4nTftE8szkPMh2JPmMXhZdpUq6DnIwA9vmPTFu9yOaN700"
                alt="Men"
                className="w-full h-full object-cover opacity-60 group-hover/card:opacity-90 group-hover/card:scale-110 transition-all duration-1000 grayscale group-hover/card:grayscale-0"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-700 group-hover/card:opacity-70"></div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 z-10">
              <span className="font-label-bold text-xs text-milano-red uppercase tracking-widest mb-4 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-100">
                Explore The Collection
              </span>
              <h2 className="font-display-xl text-7xl sm:text-8xl lg:text-[140px] leading-none uppercase text-lemon-chiffon tracking-tighter">
                MEN
              </h2>
            </div>
          </Link>

          {/* WOMEN */}
          <Link 
            href="/products"
            className="relative flex-1 md:group-hover/split:flex-1 md:hover:!flex-[2.5] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden group/card bg-on-surface"
          >
            <div className="absolute inset-0 bg-on-surface z-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000"
                alt="Women"
                className="w-full h-full object-cover opacity-60 group-hover/card:opacity-90 group-hover/card:scale-110 transition-all duration-1000 grayscale group-hover/card:grayscale-0"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-700 group-hover/card:opacity-70"></div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 z-10">
              <span className="font-label-bold text-xs text-milano-red uppercase tracking-widest mb-4 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 delay-100">
                Archive Drop 004
              </span>
              <h2 className="font-display-xl text-7xl sm:text-8xl lg:text-[140px] leading-none uppercase text-lemon-chiffon tracking-tighter">
                WOMEN
              </h2>
            </div>
          </Link>
        </div>
      </section>

      
      {/* ── ASYMMETRIC BENTO BOX GRID ── */}
      <section className="w-full bg-background py-20 md:py-32 border-b-2 border-on-surface">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16">
            <h2 className="font-display-xl text-6xl md:text-8xl uppercase leading-none tracking-tighter text-on-surface">
              CURATED<br />ESSENTIALS
            </h2>
            <Link href="/products" className="inline-block border-b-2 border-on-surface pb-1 mt-6 md:mt-0 font-headline-md text-sm uppercase tracking-widest hover:text-milano-red hover:border-milano-red transition-colors">
              VIEW ALL ACCESSORIES
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
            {/* Bento Item 1 - Large Left */}
            <Link href="/product-detail?id=prod_3" className="md:col-span-7 row-span-1 group relative overflow-hidden bg-surface-container border-2 border-on-surface shadow-[8px_8px_0px_0px_rgba(39,24,21,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000" alt="Sneakers" className="w-full h-full object-cover filter contrast-125 group-hover:scale-110 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              <div className="absolute top-6 left-6 bg-lemon-chiffon text-on-surface px-3 py-1 font-label-bold text-[10px] uppercase tracking-widest border border-on-surface">FOOTWEAR</div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end mix-blend-difference text-lemon-chiffon">
                <h3 className="font-display-xl text-4xl uppercase">Crimson Runner</h3>
                <span className="font-headline-md text-xl">$145</span>
              </div>
            </Link>

            {/* Bento Item 2 - Top Right */}
            <Link href="/product-detail?id=prod_4" className="md:col-span-5 row-span-1 group relative overflow-hidden bg-surface-container border-2 border-on-surface shadow-[8px_8px_0px_0px_rgba(39,24,21,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800" alt="Bag" className="w-full h-full object-cover filter contrast-125 group-hover:scale-110 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              <div className="absolute top-6 left-6 bg-lemon-chiffon text-on-surface px-3 py-1 font-label-bold text-[10px] uppercase tracking-widest border border-on-surface">ACCESSORIES</div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end mix-blend-difference text-lemon-chiffon">
                <h3 className="font-display-xl text-3xl uppercase">Tactical Sling</h3>
                <span className="font-headline-md text-xl">$85</span>
              </div>
            </Link>

            {/* Bento Item 3 - Bottom Left */}
            <Link href="/product-detail?id=prod_5" className="md:col-span-4 row-span-1 group relative overflow-hidden bg-on-surface border-2 border-on-surface shadow-[8px_8px_0px_0px_rgba(39,24,21,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-300 flex items-center justify-center p-8">
              <h3 className="font-display-xl text-5xl md:text-7xl uppercase text-lemon-chiffon text-center leading-none">
                HARD<br/>WARE<br/>SERIES
              </h3>
            </Link>

            {/* Bento Item 4 - Bottom Right */}
            <Link href="/product-detail?id=prod_6" className="md:col-span-8 row-span-1 group relative overflow-hidden bg-surface-container border-2 border-on-surface shadow-[8px_8px_0px_0px_rgba(39,24,21,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=1000" alt="Rings" className="w-full h-full object-cover filter contrast-125 group-hover:scale-110 transition-transform duration-700 ease-out" style={{ objectPosition: 'center 30%' }} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              <div className="absolute top-6 left-6 bg-lemon-chiffon text-on-surface px-3 py-1 font-label-bold text-[10px] uppercase tracking-widest border border-on-surface">JEWELRY</div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end mix-blend-difference text-lemon-chiffon">
                <h3 className="font-display-xl text-4xl uppercase">Signet Ring 01</h3>
                <span className="font-headline-md text-xl">$60</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE CAMPAIGN LOOKBOOK (STICKY HORIZONTAL SCROLL) ── */}
      <section ref={lookbookRef} className="relative w-full h-[300vh] bg-black">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center border-t-2 border-white/20">
          <div className="absolute top-10 left-10 z-20">
            <h2 className="font-display-xl text-4xl md:text-6xl text-white uppercase tracking-tighter">
              FW26 LOOKBOOK
            </h2>
            <div className="w-full h-[2px] bg-white/20 mt-4 overflow-hidden">
              <div 
                className="h-full bg-milano-red transition-all duration-100 ease-linear"
                style={{ width: `${lookbookProgress * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Horizontal Track */}
          <div 
            className="flex items-center gap-8 md:gap-20 px-10 md:px-[10vw] w-fit h-[60vh]"
            style={{ 
              transform: `translateX(${-lookbookProgress * 65}%)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Image 1 */}
            <div className="relative w-[80vw] md:w-[60vw] h-full shrink-0 group overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1550614000-4b95d4ebf5eb?auto=format&fit=crop&q=80&w=1200" alt="Look 1" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
              <div className="absolute bottom-6 right-6 font-display-xl text-5xl text-white mix-blend-overlay">01</div>
            </div>
            
            {/* Image 2 */}
            <div className="relative w-[80vw] md:w-[60vw] h-full shrink-0 group overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200" alt="Look 2" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
              <div className="absolute bottom-6 right-6 font-display-xl text-5xl text-white mix-blend-overlay">02</div>
            </div>
            
            {/* Image 3 */}
            <div className="relative w-[80vw] md:w-[60vw] h-full shrink-0 group overflow-hidden border border-white/10">
              <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200" alt="Look 3" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
              <div className="absolute bottom-6 right-6 font-display-xl text-5xl text-white mix-blend-overlay">03</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
