"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAuthUser, UserSession } from "@/lib/authHelper";
import { getActiveCartItems, saveActiveCartItems, updateCartQuantity, removeFromCart } from "@/lib/cartHelper";
import { formatPrice, getActiveCurrency, CurrencyCode } from "@/lib/currencyHelper";

export default function CheckoutPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<UserSession | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  const [shippingForm, setShippingForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

  const handleAddressSelect = (addrId: string, addressesToSearch = savedAddresses) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setShippingForm(prev => ({
        ...prev,
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        phone: "",
      }));
    } else {
      const addr = addressesToSearch.find(a => a.id === addrId);
      if (addr) {
        const nameParts = addr.name ? addr.name.split(" ") : [""];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        setShippingForm(prev => ({
          ...prev,
          firstName,
          lastName,
          address: addr.line1 || "",
          apartment: addr.line2 || "",
          city: addr.city || "",
          state: addr.state || "",
          zip: addr.zip || "",
          country: addr.country || "India",
          phone: addr.phone || "",
        }));
      }
    }
  };

  useEffect(() => {
    setCurrency(getActiveCurrency());
    const handleCurr = (e: any) => setCurrency(e.detail || getActiveCurrency());
    window.addEventListener("currency-updated", handleCurr);
    return () => window.removeEventListener("currency-updated", handleCurr);
  }, []);

  useEffect(() => {
    const handleCartUpdate = (e: any) => setCartItems(e.detail || getActiveCartItems());
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setAuthUser(user);
    setShippingForm(prev => ({ ...prev, email: user.email }));
    setCartItems(getActiveCartItems());
    
    fetch(`/api/admin/addresses?userId=${user.id}&t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.addresses && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: any) => a.isDefault);
          if (defaultAddr) {
            handleAddressSelect(defaultAddr.id, data.addresses);
          }
        }
      })
      .catch(err => console.error("Error fetching addresses:", err));
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFee = subtotal >= 500 ? 0 : subtotal > 0 ? 15 : 0;
  const taxes = subtotal * 0.05; // Dummy 5% tax
  const grandTotal = Math.max(0, subtotal + shippingFee + taxes);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || !authUser || isPlacingOrder) return;
    
    // Basic Validation
    const errors: Record<string, string> = {};
    const required = ["email", "firstName", "lastName", "address", "city", "state", "zip", "phone"];
    let hasError = false;
    
    required.forEach(field => {
      if (!shippingForm[field as keyof typeof shippingForm].trim()) {
        errors[field] = "Required";
        hasError = true;
      }
    });

    if (hasError) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsPlacingOrder(true);
    
    setTimeout(() => {
      saveActiveCartItems([]);
      router.push("/thank-you");
    }, 2000);
  };

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-lemon-chiffon text-on-surface font-body-md flex flex-col">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row w-full max-w-container-max mx-auto">
        
        {/* LEFT COLUMN: FORMS (Light/Brand Colored) */}
        <div className="w-full lg:w-[55%] xl:w-3/5 bg-lemon-chiffon order-2 lg:order-1 flex justify-end">
          <div className="w-full max-w-2xl px-4 py-8 lg:px-12 lg:py-16">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center text-xs font-label-bold uppercase tracking-widest text-on-surface/60 mb-10 space-x-3">
              <Link href="/cart" className="text-milano-red hover:underline">Cart</Link>
              <span>›</span>
              <span className="font-bold text-on-surface">Information</span>
              <span>›</span>
              <span>Shipping</span>
              <span>›</span>
              <span>Payment</span>
            </nav>

            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              {/* Contact Section */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline-md text-2xl uppercase">Contact</h2>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email"
                    className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.email ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                  />
                  <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Email</label>
                  {formErrors.email && <p className="text-milano-red text-xs mt-1 font-label-bold uppercase">{formErrors.email}</p>}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input type="checkbox" id="news" className="w-5 h-5 rounded-none border-2 border-on-surface text-milano-red focus:ring-milano-red" defaultChecked />
                  <label htmlFor="news" className="text-xs font-label-bold uppercase tracking-widest text-on-surface/80">Email me with news and offers</label>
                </div>
              </section>

              {/* Shipping Section */}
              <section>
                <h2 className="font-headline-md text-2xl uppercase mb-6">Shipping address</h2>
                
                {savedAddresses.length > 0 && (
                  <div className="mb-6 relative">
                    <select 
                      value={selectedAddressId}
                      onChange={(e) => handleAddressSelect(e.target.value)}
                      className="w-full bg-surface border-2 border-on-surface/30 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red"
                    >
                      <option value="new">Use a new address</option>
                      {savedAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label} ({addr.line1}, {addr.city})
                        </option>
                      ))}
                    </select>
                    <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Saved Addresses</label>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="relative">
                    <select 
                      value={shippingForm.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full bg-surface border-2 border-on-surface/30 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                    <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Country/Region</label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={shippingForm.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="First name"
                        className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.firstName ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                      />
                      <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">First name</label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={shippingForm.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Last name"
                        className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.lastName ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                      />
                      <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Last name</label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={shippingForm.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Address"
                      className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.address ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                    />
                    <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Address</label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={shippingForm.apartment}
                      onChange={(e) => handleInputChange("apartment", e.target.value)}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full bg-surface border-2 border-on-surface/30 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all"
                    />
                    <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Apartment, suite, etc. (optional)</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={shippingForm.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                        className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.city ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                      />
                      <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">City</label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={shippingForm.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="State"
                        className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.state ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                      />
                      <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">State</label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={shippingForm.zip}
                        onChange={(e) => handleInputChange("zip", e.target.value)}
                        placeholder="PIN code"
                        className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.zip ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                      />
                      <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">PIN code</label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={shippingForm.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Phone"
                      className={`w-full bg-surface border-2 px-4 pt-6 pb-2 font-headline-md text-base focus:outline-none focus:border-milano-red transition-all ${formErrors.phone ? 'border-milano-red bg-red-50' : 'border-on-surface/30'}`}
                    />
                    <label className="absolute left-4 top-2 text-[10px] font-label-bold uppercase tracking-widest text-on-surface/50 pointer-events-none">Phone</label>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-8">
                <Link href="/cart" className="text-milano-red text-sm font-label-bold uppercase tracking-widest hover:underline mb-6 sm:mb-0">
                  &lt; Return to cart
                </Link>
                <button 
                  type="submit"
                  disabled={isPlacingOrder || cartItems.length === 0}
                  className="w-full sm:w-auto bg-milano-red hover:bg-on-surface text-lemon-chiffon border-2 border-on-surface font-headline-md uppercase tracking-widest px-8 py-4 transition-colors flex items-center justify-center min-w-[250px]"
                >
                  {isPlacingOrder ? (
                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                  ) : (
                    "Continue to shipping"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY (Surface Darker) */}
        <div className="w-full lg:w-[45%] xl:w-2/5 bg-on-surface text-lemon-chiffon border-t-8 lg:border-t-0 lg:border-l-8 border-milano-red order-1 lg:order-2 flex justify-start">
          <div className="w-full max-w-lg px-4 py-8 lg:px-12 lg:py-16 lg:sticky lg:top-0 h-fit">
            
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center group">
                  <div className="relative">
                    <div className="w-20 h-24 border-2 border-lemon-chiffon/20 bg-white overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base font-headline-md uppercase">{item.title}</h3>
                    <p className="text-xs font-label-bold uppercase tracking-widest text-lemon-chiffon/50 mt-1 mb-2">{item.size} / {item.color}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-lemon-chiffon/30 rounded-none w-fit">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size)} 
                          className="px-2 py-1 text-lemon-chiffon hover:text-milano-red transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-label-bold text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size)} 
                          className="px-2 py-1 text-lemon-chiffon hover:text-milano-red transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)} 
                        className="text-[10px] font-label-bold uppercase tracking-widest text-lemon-chiffon/50 hover:text-milano-red transition-colors underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-headline-md">
                    {formatPrice(item.price * item.quantity, currency)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-2 border-lemon-chiffon/20">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Discount code" 
                  className="flex-grow bg-transparent border-2 border-lemon-chiffon/30 px-4 py-3 font-headline-md text-base focus:outline-none focus:border-milano-red placeholder:text-lemon-chiffon/50 uppercase"
                />
                <button className="bg-lemon-chiffon text-on-surface px-6 py-3 font-headline-md uppercase hover:bg-milano-red hover:text-lemon-chiffon hover:border-milano-red border-2 border-transparent transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-lemon-chiffon/20 space-y-4">
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-widest text-lemon-chiffon/60">
                <span>Subtotal</span>
                <span className="text-lemon-chiffon">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-widest text-lemon-chiffon/60">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-label-bold uppercase tracking-widest text-lemon-chiffon/60">
                <span>Estimated taxes</span>
                <span>{formatPrice(taxes, currency)}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-lemon-chiffon/20 flex justify-between items-end">
              <span className="text-xl font-headline-md uppercase">Total</span>
              <div className="flex items-end gap-2">
                <span className="text-xs font-label-bold text-lemon-chiffon/50 mb-1">{currency}</span>
                <span className="text-4xl font-headline-md text-milano-red">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>

          </div>
        </div>
        
      </div>

      <Footer />
    </div>
  );
}
