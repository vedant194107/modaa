import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface border-t-2 border-on-surface">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
        <div className="md:col-span-1">
          <h2 className="font-headline-md text-headline-md text-primary-fixed mb-6">
            THE DROP
          </h2>
          <p className="text-on-primary-fixed opacity-70 font-body-md">
            Redefining streetwear through exclusive releases and editorial storytelling.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-label-bold text-label-bold text-primary-fixed uppercase mb-2">
            QUICK LINKS
          </h3>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/products"
          >
            SHOP ALL
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/summer-sale"
          >
            NEW ARRIVALS
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/collection"
          >
            ARCHIVE
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/our-story"
          >
            EDITORIAL
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-label-bold text-label-bold text-primary-fixed uppercase mb-2">
            SUPPORT
          </h3>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/checkout"
          >
            SHIPPING & RETURNS
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/our-story"
          >
            CONTACT US
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/products"
          >
            STORE LOCATOR
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="/our-story"
          >
            FAQ
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-label-bold text-label-bold text-primary-fixed uppercase mb-2">
            LEGAL
          </h3>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="#"
          >
            PRIVACY POLICY
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="#"
          >
            TERMS OF SERVICE
          </Link>
          <Link
            className="font-label-bold text-label-bold text-on-primary-fixed opacity-80 hover:opacity-100 hover:text-primary-fixed-dim transition-opacity duration-0"
            href="#"
          >
            ACCESSIBILITY
          </Link>
        </div>
      </div>
      <div className="border-t border-on-primary-fixed/20 py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-on-primary-fixed opacity-60 font-label-bold text-label-sm">
          © 2024 THE DROP. ALL RIGHTS RESERVED.
        </span>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-primary-fixed cursor-pointer hover:opacity-80">
            share
          </span>
          <span className="material-symbols-outlined text-primary-fixed cursor-pointer hover:opacity-80">
            public
          </span>
          <span className="material-symbols-outlined text-primary-fixed cursor-pointer hover:opacity-80">
            mail
          </span>
        </div>
      </div>
    </footer>
  );
}
