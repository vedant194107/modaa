const WISHLIST_KEY = "the_drop_wishlist_items";

export interface WishlistItem {
  id: string | number;
  title: string;
  price: string | number;
  image: string;
  category?: string;
  href?: string;
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(id: string | number): boolean {
  return getWishlist().some((item) => String(item.id) === String(id));
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  const list = getWishlist();
  const exists = list.some((i) => String(i.id) === String(item.id));
  let updated: WishlistItem[];

  if (exists) {
    updated = list.filter((i) => String(i.id) !== String(item.id));
  } else {
    updated = [item, ...list];
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: updated }));
  return !exists; // returns true if added, false if removed
}
