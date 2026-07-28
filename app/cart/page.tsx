"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addItemToCart, getActiveCartItems, saveActiveCartItems } from "@/lib/cartHelper";
import { getAuthUser } from "@/lib/authHelper";

const defaultInitialCart = [
  {
    id: "archive-hoodie-blk",
    title: "ARCHIVE HOODIE / BLK",
    price: 185,
    size: "L",
    color: "Black",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMnaLnndF_wvRegzRbqWvrUQZ470GWCkFs_iCTTyXU-zATGX5IOJl2yKSgAa8Q6s78IrzlaPcNWYJW37ImRj8wONeKwjOPKaiGXCyx9yJsrq4qhhXAD_P-VUV-XFcIF1cTCLyNQ88sKtK0vCXe4RQScs2AByo2wUa2tmhlX_CnQcpeRZDUGVIQkW6X7e1iXkCrv69P4cQg5HQUaA671PeJLB7OyRda-E2-Cdi7lF6QGGraPhIqluhCD3PKGeU0mQH_whyw3HOD7ro",
    quantity: 1,
  },
  {
    id: "raven-distressed-denim",
    title: "RAVEN DISTRESSED DENIM",
    price: 245,
    size: "M",
    color: "Milano Red Stitch",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArnnoDag-q0ElalEK4sqtvt6w91FtYcY9aGxycQpCOKInmR7cffSVuI_FVMLsBbFD4H4-poBZB7jOnp-_oOwFoavvZXTbPCJ8JAOxItFfA6KjQzry7IpE5ZJKWX7MZBpYzTNY1hHV3OvSkntY8nnBiYCWHXgKpw7c-b39YBevNkM2Ria2q6i_QhJuOwGjUBMfeBYwxjK7tKQ0eeqmCXMzo9IhrpkEzceLaj2VigECxB6AHYemp9n_QuiHvuQp2FkYWXH9IdB2za4M",
    quantity: 1,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = getAuthUser();
    if (!user) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  useEffect(() => {
    const syncCart = () => {
      const items = getActiveCartItems();
      setCartItems(items);
    };

    syncCart();

    const handleCartUpdated = (e: any) => {
      if (e.detail) {
        setCartItems(e.detail);
      } else {
        syncCart();
      }
    };

    const handleAuthUpdated = () => {
      syncCart();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("auth-updated", handleAuthUpdated);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("auth-updated", handleAuthUpdated);
    };
  }, []);

  const updateQuantity = (id: string | number, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (String(item.id) === String(id)) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCartItems(updated);
    saveActiveCartItems(updated);
  };

  const removeItem = (id: string | number) => {
    const updated = cartItems.filter((item) => String(item.id) !== String(id));
    setCartItems(updated);
    saveActiveCartItems(updated);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="w-full min-h-screen bg-lemon-chiffon text-on-surface">
      {/* TopNavBar */}
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-section-gap">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Cart Items */}
          <div className="w-full lg:w-2/3">
            <h1 className="font-display-xl text-3xl md:text-headline-lg uppercase mb-8 md:mb-12">
              Your Bag ({totalItems} {totalItems === 1 ? "Item" : "Items"})
            </h1>

            {cartItems.length === 0 ? (
              <div className="py-16 text-center border-2 border-on-surface bg-surface p-8 my-4 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-on-surface/30 mb-4 block">shopping_bag</span>
                <h3 className="font-headline-lg text-2xl sm:text-3xl uppercase mb-2">YOUR CART IS EMPTY</h3>
                <p className="font-body-md text-sm opacity-70 mb-8 max-w-md mx-auto">
                  You haven't added any pieces to your cart yet. Explore our latest drop and curate your archive.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-milano-red text-lemon-chiffon font-headline-md py-3.5 px-8 uppercase hover:bg-on-surface transition-colors cursor-pointer border-2 border-on-surface"
                >
                  EXPLORE ARCHIVE / SHOP NOW
                </Link>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-grid pb-8 md:pb-12 border-b-2 border-on-surface/20 relative overflow-hidden group">
                    <div className="aspect-[3/4] bg-surface-container overflow-hidden border-2 border-on-surface">
                      <Link className="block cursor-pointer w-full h-full" href="/product-detail">
                        <img className="w-full h-full object-cover" alt={item.title} src={item.image} />
                      </Link>
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-headline-md text-lg sm:text-2xl uppercase leading-tight">{item.title}</h3>
                          <span className="font-headline-md text-lg sm:text-2xl text-milano-red shrink-0">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-label-bold text-on-surface/60 text-xs sm:text-sm uppercase">
                            COLOR: {item.color || "BLACK"}
                          </p>
                          <p className="font-label-bold text-on-surface/60 text-xs sm:text-sm uppercase">
                            SIZE: {item.size || "M"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-on-surface/10">
                        {/* Quantity Stepper Buttons */}
                        <div className="flex items-center border-2 border-on-surface bg-lemon-chiffon">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1 text-sm font-bold hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer border-r border-on-surface"
                            title="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="w-10 text-center font-label-bold text-sm sm:text-base">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-1 text-sm font-bold hover:bg-milano-red hover:text-lemon-chiffon transition-colors cursor-pointer border-l border-on-surface"
                            title="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>

                        {/* Working Remove Button */}
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="font-label-bold text-xs sm:text-sm uppercase underline text-milano-red hover:text-on-surface transition-colors cursor-pointer tracking-wider"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Code */}
            <div className="mt-12 max-w-md">
              <label className="font-label-bold uppercase text-xs mb-2 block">Promo Code</label>
              <div className="flex">
                <input className="w-full bg-transparent border-b-2 border-on-surface py-3 px-0 focus:outline-none focus:border-milano-red font-body-md placeholder:text-on-surface/30 uppercase text-sm" placeholder="ENTER CODE" type="text"/>
                <button className="font-headline-md px-8 py-3 bg-on-surface text-lemon-chiffon hover:bg-milano-red transition-colors active:scale-95 cursor-pointer">APPLY</button>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="border-4 border-on-surface p-6 sm:p-8 sticky top-28 bg-surface shadow-md">
              <h2 className="font-headline-md text-2xl sm:text-3xl mb-8 border-b-2 border-on-surface pb-4 uppercase">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-label-bold uppercase">
                  <span>Subtotal</span>
                  <span className="text-milano-red font-headline-md text-xl">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-label-bold uppercase">
                  <span>Shipping</span>
                  <span className="text-on-surface/60 text-xs font-bold">
                    {subtotal >= 500 ? "FREE EXPRESS" : subtotal > 0 ? "$15.00" : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between font-label-bold uppercase">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-6 border-t-2 border-on-surface mb-8">
                <span className="font-headline-md text-2xl sm:text-3xl">Total</span>
                <span className="font-headline-md text-3xl sm:text-4xl text-milano-red">
                  ${(subtotal > 0 ? (subtotal >= 500 ? subtotal : subtotal + 15) : 0).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={cartItems.length === 0}
                className={`block w-full text-center bg-milano-red text-lemon-chiffon py-5 sm:py-6 font-headline-md text-2xl sm:text-3xl hover:bg-on-surface transition-colors active:scale-[0.98] cursor-pointer border-2 border-on-surface ${
                  cartItems.length === 0 ? "pointer-events-none opacity-50" : ""
                }`}
              >
                PROCEED TO CHECKOUT
              </button>
              <div className="mt-6 flex flex-col gap-4 text-center">
                <p className="text-xs uppercase font-label-bold opacity-60">Secure Checkout Guaranteed</p>
                <div className="flex justify-center gap-4 opacity-40">
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="material-symbols-outlined">payments</span>
                  <span className="material-symbols-outlined">lock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  Add-ons Section  */}
        <section className="mt-section-gap">
          <h2 className="font-display-xl text-2xl md:text-headline-lg uppercase mb-8 md:mb-12">Don't Miss Out</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-gutter">
            {/*  Add-on 1  */}
            <div className="group relative flex flex-col">
              <div className="relative aspect-square bg-surface-container overflow-hidden mb-3 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Logo Crew Socks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEqC52vRQgvY6jUpYGoAWxfvtCnBMyXAtUJWK-DeD63h8xLnDDsHL4wjl6YJPdZJSIjiAeNOSWnHZ6d52yn-3AQ3kgzrNN45ZsISB7pHz_zjVz__63gyqmJn2TC4Xg1r83sqap9ilExYUVt5YWygNtcC2TbPTk2bIAs3ieDE-6eyZ2oHmJYWlN5Dgu3ymMyMKjLOI17bnaq37c1liGRWl5Mof6Hb_OoT1a3NAsuIHYGpQEzcTIiI-TsMJDFfwHMVXReA6DZjiPmD8"/>
                </Link>
                {/* Slide-Up Hover Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-on-surface/90 backdrop-blur-sm z-20 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
                  <button 
                    onClick={() => addItemToCart({
                      id: "logo-crew-socks",
                      title: "LOGO CREW SOCKS",
                      price: 22,
                      size: "OS",
                      color: "White",
                      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEqC52vRQgvY6jUpYGoAWxfvtCnBMyXAtUJWK-DeD63h8xLnDDsHL4wjl6YJPdZJSIjiAeNOSWnHZ6d52yn-3AQ3kgzrNN45ZsISB7pHz_zjVz__63gyqmJn2TC4Xg1r83sqap9ilExYUVt5YWygNtcC2TbPTk2bIAs3ieDE-6eyZ2oHmJYWlN5Dgu3ymMyMKjLOI17bnaq37c1liGRWl5Mof6Hb_OoT1a3NAsuIHYGpQEzcTIiI-TsMJDFfwHMVXReA6DZjiPmD8",
                    })}
                    className="w-full bg-milano-red text-lemon-chiffon font-headline-md py-2.5 px-4 text-xs sm:text-base uppercase tracking-wider hover:bg-white hover:text-milano-red active:scale-95 transition-all duration-200 border-2 border-on-surface shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm sm:text-base">add_shopping_cart</span>
                    <span>+ ADD TO BAG</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start pt-2 border-t-2 border-on-surface/20">
                <div>
                  <h4 className="font-label-bold text-sm sm:text-base uppercase leading-tight">Logo Crew Socks</h4>
                  <p className="font-headline-md text-milano-red text-sm sm:text-base mt-0.5">$22.00</p>
                </div>
              </div>
            </div>

            {/*  Add-on 2  */}
            <div className="group relative flex flex-col">
              <div className="relative aspect-square bg-surface-container overflow-hidden mb-3 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Tactical Keychain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT912Xl_-kulsOG26Nky-cRiPVDj69InD_vfqIQHzo2cNd2JwC9aNL4u1GM2TU0Cfcaz7ymJKo5q3fzRf2Q0dCIubFvwarEiLUKmNlSHHLEqZQE9LPtyaDfnhrGT9pg0CawZN2TNlPk7Zwcm6ZN7jUxd33WbFgED1rYGLF0DbxcWtfNwAGMy2HhiSQvTstRTCbvEB0Sop8RzXxsumpoIwCH8uvsD8b67sjrPtizI9H8hwylo2SOsuTY6Mhf_vIezwFZvr61DK89tM"/>
                </Link>
                {/* Slide-Up Hover Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-on-surface/90 backdrop-blur-sm z-20 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
                  <button 
                    onClick={() => addItemToCart({
                      id: "tactical-keychain",
                      title: "TACTICAL KEYCHAIN",
                      price: 35,
                      size: "OS",
                      color: "Matte Black",
                      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT912Xl_-kulsOG26Nky-cRiPVDj69InD_vfqIQHzo2cNd2JwC9aNL4u1GM2TU0Cfcaz7ymJKo5q3fzRf2Q0dCIubFvwarEiLUKmNlSHHLEqZQE9LPtyaDfnhrGT9pg0CawZN2TNlPk7Zwcm6ZN7jUxd33WbFgED1rYGLF0DbxcWtfNwAGMy2HhiSQvTstRTCbvEB0Sop8RzXxsumpoIwCH8uvsD8b67sjrPtizI9H8hwylo2SOsuTY6Mhf_vIezwFZvr61DK89tM",
                    })}
                    className="w-full bg-milano-red text-lemon-chiffon font-headline-md py-2.5 px-4 text-xs sm:text-base uppercase tracking-wider hover:bg-white hover:text-milano-red active:scale-95 transition-all duration-200 border-2 border-on-surface shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm sm:text-base">add_shopping_cart</span>
                    <span>+ ADD TO BAG</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start pt-2 border-t-2 border-on-surface/20">
                <div>
                  <h4 className="font-label-bold text-sm sm:text-base uppercase leading-tight">Tactical Keychain</h4>
                  <p className="font-headline-md text-milano-red text-sm sm:text-base mt-0.5">$35.00</p>
                </div>
              </div>
            </div>

            {/*  Add-on 3  */}
            <div className="group relative flex flex-col">
              <div className="relative aspect-square bg-surface-container overflow-hidden mb-3 border-2 border-on-surface">
                <Link className="block cursor-pointer w-full h-full" href="/product-detail">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Ribbed Wool Beanie" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwvp3i3OD_z05eXxT8ljJyYlP1oR6vmq3lANGPZi-OWzIG5keTbDuU9FfvbDP0XFdiNDF7Jyel-7-GazZr0yLcsEsQttTH6ytTwko58B3fk1y1kS-yqXkjFeXYXitCP-KjXE_ijZtO_VVuF1gEwOT00aDfio1IX-5IYPAtGUzv2KqREM0YptdIt_AWJ5b3TTq2ZzaAPR49QtdDoMZFARFHYNNmrbstBWsvuw87GcYTVa4RrzLWWscNalLzniJwGLVEbgpkwym8iOQ"/>
                </Link>
                {/* Slide-Up Hover Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-on-surface/90 backdrop-blur-sm z-20 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
                  <button 
                    onClick={() => addItemToCart({
                      id: "ribbed-wool-beanie",
                      title: "RIBBED WOOL BEANIE",
                      price: 45,
                      size: "OS",
                      color: "Charcoal",
                      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwvp3i3OD_z05eXxT8ljJyYlP1oR6vmq3lANGPZi-OWzIG5keTbDuU9FfvbDP0XFdiNDF7Jyel-7-GazZr0yLcsEsQttTH6ytTwko58B3fk1y1kS-yqXkjFeXYXitCP-KjXE_ijZtO_VVuF1gEwOT00aDfio1IX-5IYPAtGUzv2KqREM0YptdIt_AWJ5b3TTq2ZzaAPR49QtdDoMZFARFHYNNmrbstBWsvuw87GcYTVa4RrzLWWscNalLzniJwGLVEbgpkwym8iOQ",
                    })}
                    className="w-full bg-milano-red text-lemon-chiffon font-headline-md py-2.5 px-4 text-xs sm:text-base uppercase tracking-wider hover:bg-white hover:text-milano-red active:scale-95 transition-all duration-200 border-2 border-on-surface shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm sm:text-base">add_shopping_cart</span>
                    <span>+ ADD TO BAG</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start pt-2 border-t-2 border-on-surface/20">
                <div>
                  <h4 className="font-label-bold text-sm sm:text-base uppercase leading-tight">Ribbed Wool Beanie</h4>
                  <p className="font-headline-md text-milano-red text-sm sm:text-base mt-0.5">$45.00</p>
                </div>
              </div>
            </div>
          </div>
        </section>
</main>
{/*  Footer  */}
<footer className="bg-on-surface text-surface w-full">
<div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto gap-12">
<div className="flex flex-col gap-8 md:w-1/3">
<Link className="font-display-xl text-headline-lg text-surface tracking-tighter" href="/">THE DROP</Link>
<p className="font-body-md text-surface/70">Redefining streetwear through scarcity and intentionality. Join the drop.</p>
<div className="flex gap-4">
<Link className="w-10 h-10 border border-surface/30 flex items-center justify-center hover:bg-primary transition-colors duration-200" href="#">IG</Link>
<Link className="w-10 h-10 border border-surface/30 flex items-center justify-center hover:bg-primary transition-colors duration-200" href="#">TW</Link>
<Link className="w-10 h-10 border border-surface/30 flex items-center justify-center hover:bg-primary transition-colors duration-200" href="#">TK</Link>
</div>
</div>
<div className="grid grid-cols-2 gap-16 md:w-1/2">
<div className="flex flex-col gap-4">
<h5 className="font-label-bold uppercase tracking-widest text-primary">Explore</h5>
<nav className="flex flex-col gap-2">
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="/products">Shop All</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="/summer-sale">New Arrivals</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="/summer-sale">Limited Editions</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Archives</Link>
</nav>
</div>
<div className="flex flex-col gap-4">
<h5 className="font-label-bold uppercase tracking-widest text-primary">Support</h5>
<nav className="flex flex-col gap-2">
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Terms</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Privacy</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Shipping</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Returns</Link>
<Link className="font-body-md text-surface/80 hover:text-primary-container transition-colors duration-100" href="#">Contact</Link>
</nav>
</div>
</div>
</div>
<div className="w-full px-margin-mobile md:px-margin-desktop py-8 border-t border-surface/10 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<span className="font-label-bold text-xs text-surface/40 uppercase tracking-widest">© 2024 THE DROP EDITORIAL. ALL RIGHTS RESERVED.</span>
<div className="flex gap-6 items-center">
<span className="font-label-bold text-[10px] uppercase opacity-50 tracking-widest">Mastercard</span>
<span className="font-label-bold text-[10px] uppercase opacity-50 tracking-widest">Visa</span>
<span className="font-label-bold text-[10px] uppercase opacity-50 tracking-widest">Apple Pay</span>
<span className="font-label-bold text-[10px] uppercase opacity-50 tracking-widest">Amex</span>
</div>
</div>
</footer>


    </div>
  );
}
