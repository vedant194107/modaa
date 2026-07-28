"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FitCalculatorModal from "@/components/FitCalculatorModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { addItemToCart } from "@/lib/cartHelper";
import { toggleWishlistItem, isInWishlist } from "@/lib/wishlistHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

const DEFAULT_PRODUCT = {
  id: "tactical-vest-mk1",
  title: "TACTICAL VEST - MK1",
  price: 210,
  category: "Outerwear",
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMOOtcuHRV61KG0L9rtal2PL2jvQOp1ULIYAHxinTJFQzQvPj-rkylCOgVd8lYLQEd0eWs_tz7shvxztz2r4oZor-lTxhTNICCLlu3H75Znozt6Jx74NtwbzE13Jboua3bXx2_tAO9qfwolHV7R90gj7W_cYEJmBnENM6UqPQT6uiRsrIYlhD7CRMXFowE2NpEze1SpiiXD1NabPCbvM9ye1Lji7-Rn0o1vCL58lQHaS1HBhu0xp2KlU8pnIRGn_nnY02HXSGcCIw",
  image2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtP_DIlXrVVIaVJO7vgBR9pozKpi4qXd9aL30y3pSoy2-mlbDoXxoBD97CNDQlx5VGHHn-jx2lHbdl_-z3wcm1bBw1Rgp9QLrpccYY0jSH_oVMXSfb9bvcCayQlQQ2DH_ZEyBOnRT1YRQZDDktrHzqyh-mBQ4v_9nh2pfLEO4hZvTsD_GMwKV124-SjZ7QmVsHgMLIKNvgACpxWLrhdLRLrBpOhWAF9eWK-jnC9uSZtqmiI1d7_uBQeBNeb0C0LTHeG5VvrgnliIw",
  description: "Engineered for high-mobility environments. The MK1 Tactical Vest combines utilitarian heritage with avant-garde technical construction. Water-repellent ripstop body with modular webbing system.",
  stock: 15,
  materials: "500GSM Heavyweight Organic Japanese Cotton Ripstop with DWR Finish",
  fit_guide: "Oversized Boxy Fit with dropped shoulder construction. Model is 6'1 wearing Size L.",
  shipping_info: "Express Worldwide Shipping via DHL. Dispatched within 24 hours.",
  sustainability: "Ethically tailored in limited small batches using 100% GOTS-certified organic cotton.",
};

const BUNDLE_COMPLEMENTS = [
  {
    id: "prod_1",
    title: "RAVEN DISTRESSED DENIM",
    price: 245,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
  },
  {
    id: "prod_6",
    title: "INDUSTRIAL CHAIN NO.2",
    price: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtRttUHNJwG3jTta8xDbbwd8on5fhcQKRrq3Vzdepg3IpN86xFjP2u-kSCioo0Dk-M-YydHB4cc19r-lOKLOnRJTmeM1BZLvqK_wYiqY5YzqMClY7R9wS6Q-KKO8X6h8A6bFeEwTzb1z8gdd_fIFDuTbtUkMV9sGzVZwTxtYVTGmTzZGPruMKVJSLKIQfX_D8D1mSZx4KKpsVRdQj5YRxzdXDjo2yjJtcR_iQ4Of8ciacywnsORNBMxr40MxNR7MQ8SEdGgN5VeHw",
  },
];

const RELATED_PRODUCTS = [
  {
    id: "prod_2",
    title: "ARCHITECT CARGO SYSTEM",
    category: "Pants",
    price: 180,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVdjayF_lzJBVbPYqMV2nBjlzjQqclMmgAF6FyqTau4MAbCGCUfhAGssWRs6ms-axVrRO65YMrU--lPHNw_ypgnrlMZKQ3-TQuY0jn7xSWpR7hG9EAJSc9gZ-B3-INb_F_nxvcc8BpRiuNz1i6i44_YNy_ru8iiDhCvyT6CD5g4abVkQJ6M-fzQle_MmiqRQrsEGo2z1AAkZWEbcbwprfkbCg6uPWmwOx0sp-Qqh6GL0-ehNoVGxsaOz7C4_znAVpl2fkI2fvWUk",
    stock: 40,
  },
  {
    id: "prod_3",
    title: "CORE 500GSM HOODIE",
    category: "Tops",
    price: 155,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmM3dFYFdmbfG8iyYU1FdgUgiWIXoAbojb-UTfat8oLcmGbNgbwKoAgxqjMQUdZRMT-EPGAjtIo27Ze6dnms3MQv8cqNqVYimWK8aEmEJwBxqnQeMej_Ks-hdp4AIrPXhNjp6W9dRCvDWNF5Qwjkyqqbj8bQrU9ENQZxP7LbibxLP4kAWs8tCOiZO5ldpUsGjs9ycmLt-glI-0aZusmDv6BWypRdxLicFBsRQmHbhVtd8g6mXb-w57CSm2Kf5osP7PYARA83fRE7M",
    stock: 30,
  },
  {
    id: "prod_4",
    title: "TACTICAL VEST - RED",
    category: "Outerwear",
    price: 210,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrsfzMMAc4AsPLC2kiQ-KJsQQhq2LtlUPizDxjwYMq4JjUnOmN4Z0sEFBGU96ZHttvj7wO2v6PwVByUKqaIaIC-AScypD1VxHeaZZr_shSJHWbVKL0qnVPguPxkZUZOpaGSRTgpfcCb_X3JIN1NlYBJHPdXwaDj92yaTzwOal-RNCYTiytmJHxL97b2VrMocPVblMBZerunLeiSh8NqrYfoOx-Nhv95q18Tak4hhQuey_LyWpSuWwYQnEP18eoFvyhLlbu_a_5lok",
    stock: 15,
  },
  {
    id: "prod_1",
    title: "RAVEN DISTRESSED DENIM",
    category: "Denim",
    price: 245,
    image1: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    stock: 25,
  },
];

const sampleReviews = [
  {
    id: "r1",
    author: "Marcus T.",
    location: "London, UK",
    rating: 5,
    date: "Jul 12, 2025",
    title: "Best tactical piece I've owned",
    body: "The construction is absolutely insane. Every pocket has a purpose and the fabric feels premium. Runs true to size — I'm a medium and it fits perfectly over a hoodie.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    verified: true,
    helpful: 18,
    size: "M",
    color: "Milano Red",
  },
  {
    id: "r2",
    author: "Aisha K.",
    location: "Dubai, UAE",
    rating: 5,
    date: "Jun 28, 2025",
    title: "Statement piece for sure",
    body: "The Milano Red colourway is way more vibrant in person. Gets compliments every single time I wear it. The DWR coating held up in the rain too.",
    image_url: null,
    verified: true,
    helpful: 12,
    size: "S",
    color: "Milano Red",
  },
];

const RECENTLY_VIEWED_KEY = "the_drop_recently_viewed";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const prodIdParam = searchParams.get("id");
  const [product, setProduct] = useState<any>(DEFAULT_PRODUCT);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isFitModalOpen, setIsFitModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [restockEmail, setRestockEmail] = useState("");
  const [restockSuccess, setRestockSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // High-Res Fullscreen Photo Lightbox Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Frequently Bought Together State
  const [bundleChecked, setBundleChecked] = useState<Record<string, boolean>>({
    main: true,
    prod_1: true,
    prod_6: true,
  });
  const [bundleAdded, setBundleAdded] = useState(false);

  // Share Product State
  const [linkCopied, setLinkCopied] = useState(false);

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState(sampleReviews);
  const [reviewFilter, setReviewFilter] = useState<"all" | "5star" | "4star" | "photo">("all");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    body: "",
    author: "",
    image_url: "",
    size: "M",
    color: "Milano Red",
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  const galleryPhotos = [product.image, product.image2 || product.image];

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFilePreview(base64String);
      setNewReview((prev) => ({ ...prev, image_url: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Keyboard navigation for Lightbox Photo Gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      if (e.key === "Escape") setIsGalleryOpen(false);
      if (e.key === "ArrowRight") setGalleryIndex((prev) => (prev + 1) % galleryPhotos.length);
      if (e.key === "ArrowLeft") setGalleryIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, galleryPhotos.length]);

  // Fetch product details dynamically if ID is in URL search params
  useEffect(() => {
    if (prodIdParam) {
      fetch(`/api/admin/products?id=${encodeURIComponent(prodIdParam)}&t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            const p = data.product;
            const fetchedProd = {
              id: p.id,
              title: p.title,
              price: typeof p.price === "number" ? p.price : parseFloat(p.price),
              category: p.category,
              image: p.image1,
              image2: p.image2 || p.image1,
              description: p.description || DEFAULT_PRODUCT.description,
              stock: p.stock !== undefined ? p.stock : 50,
              materials: p.materials || DEFAULT_PRODUCT.materials,
              fit_guide: p.fit_guide || DEFAULT_PRODUCT.fit_guide,
              shipping_info: p.shipping_info || DEFAULT_PRODUCT.shipping_info,
              sustainability: p.sustainability || DEFAULT_PRODUCT.sustainability,
            };
            setProduct(fetchedProd);
            saveToRecentlyViewed(fetchedProd);
          }
        })
        .catch(() => {});
    } else {
      saveToRecentlyViewed(DEFAULT_PRODUCT);
    }
  }, [prodIdParam]);

  // Track Recently Viewed Items in localStorage
  const saveToRecentlyViewed = (currentProd: any) => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let list = saved ? JSON.parse(saved) : [];
      list = list.filter((item: any) => item.id !== currentProd.id);
      list.unshift({
        id: currentProd.id,
        title: currentProd.title,
        price: currentProd.price,
        image: currentProd.image,
        category: currentProd.category,
      });
      list = list.slice(0, 6);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
      setRecentlyViewed(list);
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (saved) setRecentlyViewed(JSON.parse(saved));
    } catch {}
  }, []);

  // Fetch reviews from database API
  useEffect(() => {
    fetch(`/api/products/reviews?product_id=${encodeURIComponent(product.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, [product.id]);

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
    const handleUpdate = () => setWishlisted(isInWishlist(product.id));
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, [product.id]);

  useEffect(() => {
    const handleScroll = () => {
      const descEl = document.getElementById("product-description-section");
      if (descEl) {
        const rect = descEl.getBoundingClientRect();
        // Trigger sticky Add to Bag pop-up bar after complete scroll of description section
        setShowStickyBar(rect.top <= window.innerHeight * 0.4);
      } else {
        setShowStickyBar(window.scrollY > 750);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToBag = () => {
    addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      color: "Milano Red",
      image: product.image,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlistItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      href: `/product-detail?id=${product.id}`,
    });
  };

  // Add Bundle to Bag
  const handleAddBundleToBag = () => {
    const itemsToAdd = [];
    if (bundleChecked.main) {
      itemsToAdd.push({ id: product.id, title: product.title, price: product.price, image: product.image });
    }
    BUNDLE_COMPLEMENTS.forEach((comp) => {
      if (bundleChecked[comp.id]) {
        itemsToAdd.push({ id: comp.id, title: comp.title, price: comp.price, image: comp.image });
      }
    });

    itemsToAdd.forEach((item) => addItemToCart(item));
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  // Calculate Bundle Pricing
  const totalBundleOriginal = (bundleChecked.main ? product.price : 0) +
    BUNDLE_COMPLEMENTS.reduce((sum, c) => sum + (bundleChecked[c.id] ? c.price : 0), 0);
  const bundleDiscounted = totalBundleOriginal * 0.85;

  // Share Handlers
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.title} on THE DROP: ${window.location.href}`)}`;
      window.open(url, "_blank");
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.title} on THE DROP`)}&url=${encodeURIComponent(window.location.href)}`;
      window.open(url, "_blank");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.title || !newReview.body || !newReview.author) return;

    try {
      const res = await fetch("/api/products/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          author: newReview.author,
          rating: newReview.rating,
          title: newReview.title,
          body: newReview.body,
          image_url: newReview.image_url || null,
          size: selectedSize,
          color: "Milano Red",
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
      } else {
        setReviews([
          {
            id: `r-${Date.now()}`,
            author: newReview.author,
            location: "Verified Buyer",
            rating: newReview.rating,
            date: "Today",
            title: newReview.title,
            body: newReview.body,
            image_url: newReview.image_url || null,
            verified: true,
            helpful: 0,
            size: selectedSize,
            color: "Milano Red",
          },
          ...reviews,
        ]);
      }

      setIsReviewModalOpen(false);
      setFilePreview(null);
      setReviewSubmitted(true);
      setNewReview({ rating: 5, title: "", body: "", author: "", image_url: "", size: "M", color: "Milano Red" });
      setTimeout(() => setReviewSubmitted(false), 4000);
    } catch {
      setIsReviewModalOpen(false);
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockEmail) return;

    try {
      await fetch("/api/restock-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, email: restockEmail }),
      });

      setRestockSuccess(true);
      setTimeout(() => {
        setIsRestockModalOpen(false);
        setRestockSuccess(false);
        setRestockEmail("");
      }, 2500);
    } catch {
      setIsRestockModalOpen(false);
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 5.0;

  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`material-symbols-outlined text-milano-red ${size === "lg" ? "text-2xl" : "text-sm"}`} style={{ fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background text-on-background">

      {/* Sticky Add-to-Bag Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full z-40 bg-lemon-chiffon border-t-2 border-on-surface shadow-[0_-4px_16px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-3 flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-on-surface shrink-0 cursor-pointer"
              onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
            />
            <div className="min-w-0">
              <p className="font-label-bold text-xs uppercase tracking-wider truncate">{product.title}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-milano-red text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span className="font-label-bold text-xs text-on-surface/50">{avgRating.toFixed(1)} ({reviews.length})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="font-display-xl text-lg sm:text-xl hidden sm:block">
              {formatPrice(product.price, currency)}
            </span>
            <button
              onClick={handleToggleWishlist}
              className={`w-10 h-10 border-2 border-on-surface flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                wishlisted ? "bg-milano-red text-lemon-chiffon" : "bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon"
              }`}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </button>
            <button
              onClick={handleAddToBag}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-on-surface text-lemon-chiffon font-headline-md text-xs sm:text-sm uppercase tracking-widest hover:bg-milano-red transition-colors border-2 border-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-base hidden sm:block">shopping_bag</span>
              Add to Bag
            </button>
          </div>
        </div>
      </div>
      
      {/* TopNavBar */}
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-12 font-label-bold text-label-bold uppercase tracking-widest text-on-surface/60">
          <Link className="hover:text-primary transition-colors" href="/">Home</Link>
          <span className="text-xs">/</span>
          <Link className="hover:text-primary transition-colors" href="/products">Shop</Link>
          <span className="text-xs">/</span>
          <Link className="hover:text-primary transition-colors" href="/products">{product.category}</Link>
          <span className="text-xs">/</span>
          <span className="text-on-surface">{product.title}</span>
        </nav>

        {/* Product Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16">
          {/* Left: Product Gallery (Clicking any photo opens Fullscreen Lightbox) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div
              onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
              className="border-2 border-on-surface aspect-[4/5] relative overflow-hidden bg-surface-container cursor-zoom-in group"
            >
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.title} src={product.image} />
              <div className="absolute top-4 left-4 bg-primary text-on-primary font-label-bold px-3 py-1 text-[10px] uppercase tracking-tighter">
                Limited Archive Edition
              </div>
              <div className="absolute bottom-4 right-4 bg-on-surface/80 text-lemon-chiffon px-3 py-1.5 font-label-bold text-xs uppercase flex items-center gap-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
                CLICK TO EXPAND HIGH-RES GALLERY 🔍
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => { setGalleryIndex(1); setIsGalleryOpen(true); }}
                className="border-2 border-on-surface aspect-square overflow-hidden bg-surface-container cursor-zoom-in group relative"
              >
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.title} src={product.image2 || product.image} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-label-bold text-xs uppercase">
                  🔍 EXPAND PHOTO 2
                </div>
              </div>
              <div
                onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true); }}
                className="border-2 border-on-surface aspect-square overflow-hidden bg-surface-container cursor-zoom-in group relative"
              >
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.title} src={product.image} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-label-bold text-xs uppercase">
                  🔍 EXPAND PHOTO 1
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Editorial Specs */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="sticky top-32 space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-1">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="font-label-bold text-[10px] ml-2 text-on-surface/50">({reviews.length} REVIEWS)</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary uppercase mb-1">{product.title}</h1>
                <p className="font-headline-md text-3xl text-on-surface">
                  {formatPrice(product.price, currency)}
                </p>
              </div>

              {/* Stock Radar Badge */}
              <div>
                <span className={`inline-block px-3 py-1 font-label-bold text-xs uppercase border-2 border-on-surface ${
                  product.stock === 0 ? "bg-milano-red text-lemon-chiffon" : product.stock <= 10 ? "bg-amber-400 text-on-surface font-bold animate-pulse" : "bg-lemon-chiffon text-on-surface"
                }`}>
                  {product.stock === 0 ? "SOLD OUT - BACK-IN-STOCK ALERT AVAILABLE" : product.stock <= 10 ? `URGENT: ONLY ${product.stock} UNITS LEFT` : `IN STOCK (${product.stock} UNITS AVAILABLE)`}
                </span>
              </div>
              
              {/* Selectors */}
              <div className="space-y-6">
                {/* Size Selector with AI Fit Calculator Modal Trigger */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-label-bold text-xs uppercase">Selected Size: <span className="text-milano-red font-bold">{selectedSize}</span></span>
                    <button
                      type="button"
                      onClick={() => setIsFitModalOpen(true)}
                      className="font-label-bold text-xs uppercase text-milano-red underline hover:text-on-surface flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span className="material-symbols-outlined text-base">straighten</span>
                      AI FIT & SIZE CALCULATOR
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {["XS", "S", "M", "L", "XL"].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`h-12 border-2 border-on-surface flex items-center justify-center font-headline-md text-lg transition-all duration-200 cursor-pointer ${
                          selectedSize === sz
                            ? "bg-on-surface text-lemon-chiffon font-bold shadow-[3px_3px_0px_0px_#a90e02]"
                            : "bg-surface text-on-surface hover:bg-milano-red hover:text-lemon-chiffon hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button 
                    disabled={product.stock === 0}
                    onClick={handleAddToBag}
                    className="flex-1 py-5 bg-primary text-on-primary font-headline-md text-2xl uppercase tracking-wider active:scale-[0.98] transition-transform hover:bg-on-surface cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? "SOLD OUT" : "ADD TO BAG"}
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`w-16 py-5 border-2 border-on-surface flex items-center justify-center transition-colors active:scale-[0.98] cursor-pointer ${
                      wishlisted ? "bg-milano-red text-lemon-chiffon" : "bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>

                {/* Back in Stock Notification Trigger */}
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(true)}
                  className="w-full py-3 bg-lemon-chiffon text-on-surface font-label-bold text-xs uppercase tracking-widest border-2 border-on-surface hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">notifications_active</span>
                  NOTIFY ME WHEN RESTOCKED IN MY SIZE
                </button>
              </div>

              {/* SHARE THIS PRODUCT HUB */}
              <div className="border-t-2 border-on-surface pt-4 space-y-2">
                <span className="font-label-bold text-xs uppercase text-milano-red tracking-wider block font-bold">SHARE THIS ARCHIVE PIECE</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-lemon-chiffon border-2 border-on-surface font-label-bold text-xs uppercase hover:bg-on-surface hover:text-lemon-chiffon transition-colors cursor-pointer flex items-center gap-1.5 font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">link</span>
                    {linkCopied ? "✓ LINK COPIED!" : "COPY PRODUCT LINK"}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="px-3 py-2 bg-emerald-600 text-white font-label-bold text-xs uppercase border-2 border-on-surface hover:bg-on-surface transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    WHATSAPP
                  </button>

                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="px-3 py-2 bg-sky-500 text-white font-label-bold text-xs uppercase border-2 border-on-surface hover:bg-on-surface transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    X / TWITTER
                  </button>
                </div>
              </div>

              {/* DYNAMIC BRAND SPECIFICATION ACCORDIONS FROM ADMIN EDITABLE FIELDS */}
              <div id="product-description-section" className="border-t-2 border-on-surface">
                {/* Accordion 1: Description */}
                <details className="group border-b-2 border-on-surface open:pb-4" open>
                  <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                    <span className="font-headline-md text-xl uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red text-base">info</span>
                      DESCRIPTION & DESIGN PHILOSOPHY
                    </span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="font-body-md text-xs text-on-surface-variant space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    <p className="font-label-bold text-[10px] uppercase text-milano-red font-bold">
                      ARCHIVE CODE: MODA-{product.id.toUpperCase()} • LIMITED EDITION RUN
                    </p>
                  </div>
                </details>

                {/* Accordion 2: Materials & Construction */}
                <details className="group border-b-2 border-on-surface open:pb-4">
                  <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                    <span className="font-headline-md text-xl uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red text-base">inventory</span>
                      MATERIALS & FABRIC SPECS
                    </span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    <p className="font-label-bold text-xs uppercase">{product.materials || DEFAULT_PRODUCT.materials}</p>
                  </div>
                </details>

                {/* Accordion 3: Fit & Model Specifications */}
                <details className="group border-b-2 border-on-surface open:pb-4">
                  <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                    <span className="font-headline-md text-xl uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red text-base">straighten</span>
                      FIT & SILHOUETTE GUIDE
                    </span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    <p className="font-label-bold text-xs uppercase">{product.fit_guide || DEFAULT_PRODUCT.fit_guide}</p>
                  </div>
                </details>

                {/* Accordion 4: Shipping & Returns */}
                <details className="group border-b-2 border-on-surface open:pb-4">
                  <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                    <span className="font-headline-md text-xl uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red text-base">local_shipping</span>
                      SHIPPING & COMPLIMENTARY RETURNS
                    </span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    <p className="font-label-bold text-xs uppercase">{product.shipping_info || DEFAULT_PRODUCT.shipping_info}</p>
                  </div>
                </details>

                {/* Accordion 5: Sustainability */}
                <details className="group border-b-2 border-on-surface open:pb-4">
                  <summary className="flex justify-between items-center py-4 cursor-pointer list-none">
                    <span className="font-headline-md text-xl uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-milano-red text-base">eco</span>
                      SUSTAINABILITY & CRAFTSMANSHIP
                    </span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    <p className="font-label-bold text-xs uppercase">{product.sustainability || DEFAULT_PRODUCT.sustainability}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
        <section className="max-w-container-max mx-auto mt-16 border-4 border-on-surface bg-surface p-6 sm:p-8 shadow-[10px_10px_0px_0px_#a90e02] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-on-surface pb-4">
            <div>
              <span className="font-label-bold text-xs uppercase text-milano-red tracking-widest font-bold block">EDITORIAL ARCHIVE BUNDLE</span>
              <h2 className="font-display-xl text-3xl uppercase leading-none">FREQUENTLY BOUGHT TOGETHER</h2>
            </div>
            <span className="bg-milano-red text-lemon-chiffon px-3 py-1 font-label-bold text-xs uppercase tracking-wider font-bold border border-on-surface">
              SAVE 15% ON COMPLETE OUTFIT BUNDLE
            </span>
          </div>

          {bundleAdded && (
            <div className="bg-milano-red text-lemon-chiffon p-3 font-label-bold text-xs uppercase border border-on-surface animate-fadeIn flex justify-between items-center">
              <span>✓ All selected bundle pieces added to shopping bag!</span>
              <span className="material-symbols-outlined text-base">check_circle</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Bundle Items Cards */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-4">
              {/* Item 1: Main Product */}
              <div className="flex-1 border-2 border-on-surface bg-lemon-chiffon p-3 flex items-center gap-3 w-full">
                <input
                  type="checkbox"
                  checked={bundleChecked.main}
                  onChange={(e) => setBundleChecked({ ...bundleChecked, main: e.target.checked })}
                  className="w-5 h-5 border-2 border-on-surface text-milano-red focus:ring-milano-red cursor-pointer"
                />
                <img src={product.image} alt={product.title} className="w-16 h-20 object-cover border border-on-surface shrink-0" />
                <div>
                  <span className="font-label-bold text-[9px] uppercase text-milano-red font-bold block">THIS ITEM</span>
                  <h4 className="font-headline-md text-xs uppercase leading-tight">{product.title}</h4>
                  <span className="font-headline-md text-sm text-milano-red">{formatPrice(product.price, currency)}</span>
                </div>
              </div>

              <span className="font-display-xl text-2xl text-on-surface/40">+</span>

              {/* Item 2: Complement 1 */}
              <div className="flex-1 border-2 border-on-surface bg-lemon-chiffon p-3 flex items-center gap-3 w-full">
                <input
                  type="checkbox"
                  checked={bundleChecked[BUNDLE_COMPLEMENTS[0].id]}
                  onChange={(e) => setBundleChecked({ ...bundleChecked, [BUNDLE_COMPLEMENTS[0].id]: e.target.checked })}
                  className="w-5 h-5 border-2 border-on-surface text-milano-red focus:ring-milano-red cursor-pointer"
                />
                <img src={BUNDLE_COMPLEMENTS[0].image} alt={BUNDLE_COMPLEMENTS[0].title} className="w-16 h-20 object-cover border border-on-surface shrink-0" />
                <div>
                  <span className="font-label-bold text-[9px] uppercase opacity-50 block">COMPLEMENT</span>
                  <h4 className="font-headline-md text-xs uppercase leading-tight">{BUNDLE_COMPLEMENTS[0].title}</h4>
                  <span className="font-headline-md text-sm text-milano-red">{formatPrice(BUNDLE_COMPLEMENTS[0].price, currency)}</span>
                </div>
              </div>

              <span className="font-display-xl text-2xl text-on-surface/40">+</span>

              {/* Item 3: Complement 2 */}
              <div className="flex-1 border-2 border-on-surface bg-lemon-chiffon p-3 flex items-center gap-3 w-full">
                <input
                  type="checkbox"
                  checked={bundleChecked[BUNDLE_COMPLEMENTS[1].id]}
                  onChange={(e) => setBundleChecked({ ...bundleChecked, [BUNDLE_COMPLEMENTS[1].id]: e.target.checked })}
                  className="w-5 h-5 border-2 border-on-surface text-milano-red focus:ring-milano-red cursor-pointer"
                />
                <img src={BUNDLE_COMPLEMENTS[1].image} alt={BUNDLE_COMPLEMENTS[1].title} className="w-16 h-20 object-cover border border-on-surface shrink-0" />
                <div>
                  <span className="font-label-bold text-[9px] uppercase opacity-50 block">ACCESSORY</span>
                  <h4 className="font-headline-md text-xs uppercase leading-tight">{BUNDLE_COMPLEMENTS[1].title}</h4>
                  <span className="font-headline-md text-sm text-milano-red">{formatPrice(BUNDLE_COMPLEMENTS[1].price, currency)}</span>
                </div>
              </div>
            </div>

            {/* Bundle Checkout Box */}
            <div className="lg:col-span-4 border-2 border-on-surface bg-lemon-chiffon p-5 space-y-3 text-center sm:text-left">
              <div>
                <span className="font-label-bold text-[10px] uppercase opacity-60 block">BUNDLE COMBINED TOTAL:</span>
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                  <span className="font-display-xl text-3xl text-milano-red">{formatPrice(bundleDiscounted, currency)}</span>
                  {totalBundleOriginal > 0 && (
                    <span className="font-label-bold text-xs uppercase line-through opacity-40">
                      {formatPrice(totalBundleOriginal, currency)}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddBundleToBag}
                className="w-full py-3.5 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors cursor-pointer"
              >
                ADD BUNDLE TO BAG (SAVE 15%)
              </button>
            </div>
          </div>
        </section>

        {/* YOU MIGHT ALSO LIKE (RECOMMENDED ARCHIVE PIECES WITH 4 ITEMS & HORIZONTAL SCROLL) */}
        <section className="max-w-container-max mx-auto mt-20 space-y-6">
          <div className="flex justify-between items-end border-b-2 border-on-surface pb-4">
            <div>
              <span className="font-label-bold text-xs uppercase text-milano-red tracking-widest font-bold block">CURATED ARCHIVE SELECTION (4 PIECES)</span>
              <h2 className="font-display-xl text-3xl sm:text-4xl uppercase leading-none">YOU MIGHT ALSO LIKE</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("related-products-carousel");
                    if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  className="w-9 h-9 border-2 border-on-surface bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon flex items-center justify-center transition-colors cursor-pointer"
                  title="Scroll Left"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("related-products-carousel");
                    if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  className="w-9 h-9 border-2 border-on-surface bg-lemon-chiffon text-on-surface hover:bg-milano-red hover:text-lemon-chiffon flex items-center justify-center transition-colors cursor-pointer"
                  title="Scroll Right"
                >
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
              <Link href="/products" className="font-label-bold text-xs uppercase underline hover:text-milano-red tracking-wider">
                VIEW ENTIRE CATALOG →
              </Link>
            </div>
          </div>

          <div
            id="related-products-carousel"
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-milano-red scrollbar-track-lemon-chiffon"
          >
            {RELATED_PRODUCTS.map((rel) => (
              <div
                key={rel.id}
                className="group border-2 border-on-surface bg-surface flex flex-col justify-between p-3 relative min-w-[55vw] sm:min-w-[200px] lg:min-w-[220px] shrink-0 snap-center shadow-[3px_3px_0px_0px_#a90e02]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-2 border border-on-surface">
                  <Link href={`/product-detail?id=${rel.id}`}>
                    <img src={rel.image1} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <span className="absolute top-1.5 left-1.5 bg-on-surface text-lemon-chiffon font-label-bold text-[8px] sm:text-[9px] px-1.5 py-0.5 uppercase tracking-wider">
                    {rel.category}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-label-bold text-xs sm:text-sm uppercase leading-tight truncate">{rel.title}</h3>
                  <div className="flex justify-between items-center border-t border-on-surface/20 pt-1.5">
                    <span className="font-headline-md text-xs sm:text-sm text-milano-red">{formatPrice(rel.price, currency)}</span>
                    <Link
                      href={`/product-detail?id=${rel.id}`}
                      className="px-2.5 py-1 bg-lemon-chiffon border border-on-surface font-label-bold text-[9px] sm:text-[10px] uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors font-bold"
                    >
                      VIEW →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENTLY VIEWED ARCHIVE (LAST VIEW) */}
        {recentlyViewed.length > 0 && (
          <section className="max-w-container-max mx-auto mt-20 mb-16 space-y-6">
            <div className="border-b-2 border-on-surface pb-3 flex justify-between items-center">
              <h3 className="font-headline-md text-2xl uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-milano-red">history</span>
                RECENTLY VIEWED ARCHIVE (LAST VIEW)
              </h3>
              <span className="font-label-bold text-xs uppercase opacity-60">YOUR BROWSING HISTORY</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  href={`/product-detail?id=${encodeURIComponent(item.id)}`}
                  className="border-2 border-on-surface bg-lemon-chiffon p-2.5 flex flex-col justify-between hover:bg-on-surface hover:text-lemon-chiffon transition-colors group cursor-pointer"
                >
                  <div className="aspect-square bg-white border border-on-surface overflow-hidden mb-2 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-label-bold text-[11px] uppercase leading-tight truncate">{item.title}</h4>
                    <span className="font-headline-md text-xs text-milano-red group-hover:text-amber-300 block mt-0.5">
                      {formatPrice(item.price, currency)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOMER REVIEWS & OVERALL SUMMARY DASHBOARD SECTION */}
        <section className="max-w-container-max mx-auto mt-20 mb-16 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-on-surface pb-6">
            <div>
              <span className="font-label-bold text-xs uppercase text-milano-red tracking-widest font-bold block">VERIFIED CUSTOMER FEEDBACK</span>
              <h2 className="font-display-xl text-3xl sm:text-4xl uppercase leading-none">CUSTOMER REVIEWS & PHOTOS</h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-milano-red text-lemon-chiffon font-headline-md text-sm uppercase tracking-widest hover:bg-on-surface transition-colors border-2 border-on-surface cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">rate_review</span>
              WRITE A REVIEW
            </button>
          </div>

          {/* Submitted Banner */}
          {reviewSubmitted && (
            <div className="bg-milano-red text-lemon-chiffon p-4 border-2 border-on-surface font-label-bold text-xs uppercase animate-fadeIn flex items-center justify-between">
              <span>✓ Review submitted successfully and recorded in the database!</span>
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </div>
          )}

          {/* OVERALL RATING SUMMARY DASHBOARD BOX */}
          <div className="border-4 border-on-surface bg-surface p-6 sm:p-8 shadow-[8px_8px_0px_0px_#a90e02] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Overall Score */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 border-b lg:border-b-0 lg:border-r-2 border-on-surface/20 pb-6 lg:pb-0 lg:pr-6">
              <span className="font-label-bold text-[10px] uppercase tracking-widest opacity-60">OVERALL RATING</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display-xl text-5xl sm:text-6xl text-milano-red leading-none">{avgRating.toFixed(1)}</span>
                <span className="font-headline-md text-lg text-on-surface/50">/ 5.0</span>
              </div>
              <StarRating rating={Math.round(avgRating)} size="lg" />
              <p className="font-label-bold text-xs uppercase tracking-wider text-on-surface/80">
                BASED ON <strong className="text-milano-red">{reviews.length} VERIFIED BUYER REVIEWS</strong>
              </p>
              <span className="bg-lemon-chiffon text-on-surface px-3 py-1 font-label-bold text-[10px] uppercase border border-on-surface font-bold">
                ✓ 96% OF CUSTOMERS RECOMMEND THIS ITEM
              </span>
            </div>

            {/* Center Column: 5-Star Breakdown Bars */}
            <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r-2 border-on-surface/20 pb-6 lg:pb-0 lg:pr-6">
              {[5, 4, 3, 2, 1].map((starNum) => {
                const count = reviews.filter((r) => r.rating === starNum).length;
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={starNum} className="flex items-center gap-3 font-label-bold text-xs">
                    <span className="w-14 uppercase shrink-0 flex items-center gap-1">
                      {starNum} <span className="material-symbols-outlined text-milano-red text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </span>
                    <div className="flex-1 h-3.5 bg-lemon-chiffon border border-on-surface overflow-hidden relative">
                      <div
                        className="h-full bg-milano-red transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right opacity-80 shrink-0">{pct}% ({count})</span>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Review Filter Tabs */}
            <div className="lg:col-span-3 space-y-3">
              <span className="font-label-bold text-[10px] uppercase tracking-widest opacity-60 block">FILTER REVIEWS</span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setReviewFilter("all")}
                  className={`py-2 px-3 border-2 border-on-surface font-label-bold text-xs uppercase transition-colors text-left flex justify-between items-center cursor-pointer ${
                    reviewFilter === "all" ? "bg-on-surface text-lemon-chiffon font-bold" : "bg-lemon-chiffon hover:bg-milano-red hover:text-lemon-chiffon"
                  }`}
                >
                  <span>ALL REVIEWS</span>
                  <span>({reviews.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilter("5star")}
                  className={`py-2 px-3 border-2 border-on-surface font-label-bold text-xs uppercase transition-colors text-left flex justify-between items-center cursor-pointer ${
                    reviewFilter === "5star" ? "bg-on-surface text-lemon-chiffon font-bold" : "bg-lemon-chiffon hover:bg-milano-red hover:text-lemon-chiffon"
                  }`}
                >
                  <span>5 STARS ONLY</span>
                  <span>({reviews.filter((r) => r.rating === 5).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilter("4star")}
                  className={`py-2 px-3 border-2 border-on-surface font-label-bold text-xs uppercase transition-colors text-left flex justify-between items-center cursor-pointer ${
                    reviewFilter === "4star" ? "bg-on-surface text-lemon-chiffon font-bold" : "bg-lemon-chiffon hover:bg-milano-red hover:text-lemon-chiffon"
                  }`}
                >
                  <span>4 STARS ONLY</span>
                  <span>({reviews.filter((r) => r.rating === 4).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilter("photo")}
                  className={`py-2 px-3 border-2 border-on-surface font-label-bold text-xs uppercase transition-colors text-left flex justify-between items-center cursor-pointer ${
                    reviewFilter === "photo" ? "bg-on-surface text-lemon-chiffon font-bold" : "bg-lemon-chiffon hover:bg-milano-red hover:text-lemon-chiffon"
                  }`}
                >
                  <span>WITH PHOTOS 📷</span>
                  <span>({reviews.filter((r) => Boolean(r.image_url)).length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtered Customer Reviews Cards Grid */}
          {(() => {
            const filteredReviews = reviews.filter((r) => {
              if (reviewFilter === "5star") return r.rating === 5;
              if (reviewFilter === "4star") return r.rating === 4;
              if (reviewFilter === "photo") return Boolean(r.image_url);
              return true;
            });

            if (filteredReviews.length === 0) {
              return (
                <div className="border-2 border-on-surface p-8 bg-surface text-center">
                  <span className="material-symbols-outlined text-4xl text-milano-red mb-2">filter_alt_off</span>
                  <p className="font-headline-md uppercase text-lg">No reviews found matching filter criteria.</p>
                  <button onClick={() => setReviewFilter("all")} className="mt-3 text-xs font-label-bold uppercase underline text-milano-red">
                    Show All Reviews
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border-2 border-on-surface p-6 bg-surface space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <StarRating rating={review.rating} />
                        <h3 className="font-headline-md text-lg uppercase mt-1">{review.title}</h3>
                      </div>
                      <span className="font-label-bold text-[10px] uppercase text-on-surface/50 border border-on-surface/30 px-2 py-0.5">
                        {review.author}
                      </span>
                    </div>

                    <p className="font-body-md text-xs text-on-surface/80 leading-relaxed">{review.body}</p>

                    {/* Display Customer Review Photo if present */}
                    {review.image_url && (
                      <div
                        onClick={() => {
                          setGalleryIndex(0);
                          setIsGalleryOpen(true);
                        }}
                        className="w-full h-44 border-2 border-on-surface bg-white overflow-hidden my-2 cursor-zoom-in group relative"
                      >
                        <img src={review.image_url} alt="Customer Review Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      </main>

      {/* FULLSCREEN PHOTO LIGHTBOX GALLERY MODAL */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[150] flex flex-col justify-between bg-black/90 backdrop-blur-md animate-fadeIn p-4 sm:p-8 select-none">
          {/* Lightbox Top Header */}
          <div className="flex justify-between items-center text-lemon-chiffon z-20">
            <div>
              <h3 className="font-headline-md text-lg sm:text-xl uppercase tracking-wider">{product.title}</h3>
              <p className="font-label-bold text-xs opacity-70 uppercase">
                PHOTO {galleryIndex + 1} OF {galleryPhotos.length} • HIGH-RES ARCHIVE GALLERY
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="px-3 py-1.5 bg-lemon-chiffon text-on-surface font-label-bold text-xs uppercase hover:bg-milano-red hover:text-lemon-chiffon transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">{isZoomed ? "zoom_out" : "zoom_in"}</span>
                <span>{isZoomed ? "RESET ZOOM" : "ZOOM 2X"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="material-symbols-outlined text-3xl text-lemon-chiffon hover:text-milano-red cursor-pointer p-1"
              >
                close
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Stage */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            {/* Previous Photo Button */}
            <button
              type="button"
              onClick={() => setGalleryIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)}
              className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-lemon-chiffon/80 text-on-surface hover:bg-milano-red hover:text-lemon-chiffon flex items-center justify-center transition-colors cursor-pointer shadow-lg"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
            </button>

            {/* Main High-Res Image Display */}
            <div className="w-full h-full flex items-center justify-center overflow-auto cursor-zoom-in" onClick={() => setIsZoomed((prev) => !prev)}>
              <img
                src={galleryPhotos[galleryIndex]}
                alt={`${product.title} High-Res View`}
                className={`max-h-[75vh] max-w-full object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"
                }`}
              />
            </div>

            {/* Next Photo Button */}
            <button
              type="button"
              onClick={() => setGalleryIndex((prev) => (prev + 1) % galleryPhotos.length)}
              className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-lemon-chiffon/80 text-on-surface hover:bg-milano-red hover:text-lemon-chiffon flex items-center justify-center transition-colors cursor-pointer shadow-lg"
            >
              <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
            </button>
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          <div className="flex justify-center items-center gap-3 z-20 overflow-x-auto py-2">
            {galleryPhotos.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setGalleryIndex(idx);
                  setIsZoomed(false);
                }}
                className={`w-16 h-20 border-2 overflow-hidden transition-all cursor-pointer ${
                  galleryIndex === idx ? "border-milano-red scale-110 ring-2 ring-milano-red" : "border-lemon-chiffon/40 opacity-50 hover:opacity-100"
                }`}
              >
                <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Write a Review Dedicated Modal Popup */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-lg p-6 sm:p-8 shadow-[12px_12px_0px_0px_#a90e02] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-3">
              <div>
                <span className="font-label-bold text-[10px] uppercase text-milano-red font-bold block">VERIFIED FEEDBACK</span>
                <h3 className="font-headline-md text-2xl uppercase">WRITE A CUSTOMER REVIEW</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="material-symbols-outlined text-2xl hover:text-milano-red cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-bold text-xs uppercase block mb-1 opacity-80">Your Name / Handle</label>
                  <input
                    type="text"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    placeholder="e.g. Vedant D."
                    className="w-full bg-surface border-2 border-on-surface p-2.5 font-label-bold text-xs uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="font-label-bold text-xs uppercase block mb-1 opacity-80">Rating (1 - 5 Stars)</label>
                  <div className="flex gap-2 items-center py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="material-symbols-outlined text-2xl text-milano-red cursor-pointer"
                        style={{ fontVariationSettings: star <= newReview.rating ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-label-bold text-xs uppercase block mb-1 opacity-80">Review Headline</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Incredible quality & heavy fabric"
                  className="w-full bg-surface border-2 border-on-surface p-2.5 font-label-bold text-xs uppercase"
                  required
                />
              </div>

              <div>
                <label className="font-label-bold text-xs uppercase block mb-1 opacity-80">Detailed Review</label>
                <textarea
                  rows={3}
                  value={newReview.body}
                  onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                  placeholder="Share details on sizing, comfort, and construction..."
                  className="w-full bg-surface border-2 border-on-surface p-2.5 font-label-bold text-xs"
                  required
                />
              </div>

              {/* Photo Attachment File Upload & URL Field */}
              <div>
                <label className="font-label-bold text-xs uppercase block mb-1 opacity-80">PHOTO ATTACHMENT (UPLOAD FILE OR URL)</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer bg-on-surface text-lemon-chiffon px-4 py-2.5 font-label-bold text-xs uppercase tracking-wider border-2 border-on-surface hover:bg-milano-red transition-colors inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">cloud_upload</span>
                      CHOOSE IMAGE FILE
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="font-label-bold text-[10px] uppercase opacity-50">OR PASTE URL BELOW</span>
                  </div>

                  {filePreview ? (
                    <div className="relative w-28 h-28 border-2 border-on-surface bg-white overflow-hidden group">
                      <img src={filePreview} alt="Uploaded review preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFilePreview(null);
                          setNewReview((prev) => ({ ...prev, image_url: "" }));
                        }}
                        className="absolute top-1 right-1 bg-milano-red text-lemon-chiffon w-6 h-6 flex items-center justify-center border border-on-surface font-bold text-xs hover:scale-110 cursor-pointer"
                        title="Remove uploaded image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={newReview.image_url}
                      onChange={(e) => setNewReview({ ...newReview, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-surface border-2 border-on-surface p-2.5 font-label-bold text-xs"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-milano-red text-lemon-chiffon font-headline-md text-base uppercase tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors cursor-pointer"
              >
                SUBMIT VERIFIED REVIEW TO STORE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Fit & Size Calculator Modal */}
      <FitCalculatorModal
        isOpen={isFitModalOpen}
        onClose={() => setIsFitModalOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
        productTitle={product.title}
      />

      {/* Back-in-Stock Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-lemon-chiffon border-4 border-on-surface w-full max-w-md p-6 sm:p-8 shadow-[10px_10px_0px_0px_#271815] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-on-surface pb-3">
              <h3 className="font-headline-md text-xl uppercase">BACK-IN-STOCK ALERT</h3>
              <button onClick={() => setIsRestockModalOpen(false)} className="material-symbols-outlined text-2xl hover:text-milano-red">close</button>
            </div>

            {restockSuccess ? (
              <div className="bg-milano-red text-lemon-chiffon p-4 border border-on-surface text-center font-label-bold text-xs uppercase">
                ✓ EMAIL REGISTERED FOR RESTOCK ALERTS!
              </div>
            ) : (
              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <p className="font-body-md text-xs opacity-80 uppercase">
                  Enter your email address to receive immediate telemetry notifications when {product.title} in Size {selectedSize} is restocked.
                </p>
                <input
                  type="email"
                  value={restockEmail}
                  onChange={(e) => setRestockEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-surface border-2 border-on-surface p-3 font-label-bold text-xs uppercase"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-milano-red text-lemon-chiffon font-headline-md text-xs uppercase tracking-widest border-2 border-on-surface hover:bg-on-surface transition-colors cursor-pointer"
                >
                  SUBSCRIBE TO RESTOCK NOTIFICATION
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-lemon-chiffon text-on-surface p-12 text-center font-headline-md uppercase">Loading Product Details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
