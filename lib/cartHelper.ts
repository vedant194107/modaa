import { getAuthUser, UserSession } from "./authHelper";

export interface AddCartPayload {
  id: string | number;
  title: string;
  price: number | string;
  size?: string;
  color?: string;
  image: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

const GUEST_CART_KEY = "the_drop_guest_cart";

export function getUserCartKey(): string | null {
  const user = getAuthUser();
  if (!user || !user.id) return null;
  return `the_drop_cart_items_${user.id}`;
}

export function getActiveCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  const user = getAuthUser();
  // When user is NOT logged in, return guest cart items
  if (!user) {
    const guestCart = localStorage.getItem(GUEST_CART_KEY);
    if (!guestCart) return [];
    try {
      const items: any[] = JSON.parse(guestCart);
      return items.map((i) => ({ ...i, id: String(i.id), size: i.size || "M", color: i.color || "Black", quantity: i.quantity || 1 }));
    } catch (e) {
      return [];
    }
  }

  const userKey = `the_drop_cart_items_${user.id}`;
  let savedCart = localStorage.getItem(userKey);

  if (savedCart === null) {
    const legacy = localStorage.getItem("the_drop_cart_items");
    if (legacy !== null) {
      localStorage.setItem(userKey, legacy);
      savedCart = legacy;
    } else {
      savedCart = JSON.stringify([]);
    }
  }

  try {
    const items: any[] = JSON.parse(savedCart);
    return items.map((i) => ({ ...i, id: String(i.id), size: i.size || "M", color: i.color || "Black", quantity: i.quantity || 1 }));
  } catch (e) {
    return [];
  }
}

export function getCart(): CartItem[] {
  return getActiveCartItems();
}

export function saveActiveCartItems(newItems: any[]) {
  if (typeof window === "undefined") return;

  const user = getAuthUser();
  if (user && user.id) {
    const userKey = `the_drop_cart_items_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(newItems));
    localStorage.setItem("the_drop_cart_items", JSON.stringify(newItems));
  } else {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
    localStorage.setItem("the_drop_cart_items", JSON.stringify(newItems));
  }
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: newItems }));
}

export function syncGuestCartToUser(user: UserSession) {
  if (typeof window === "undefined" || !user || !user.id) return;
  const guestCartRaw = localStorage.getItem(GUEST_CART_KEY);
  if (!guestCartRaw) return;

  try {
    const guestItems: any[] = JSON.parse(guestCartRaw);
    if (Array.isArray(guestItems) && guestItems.length > 0) {
      const userKey = `the_drop_cart_items_${user.id}`;
      const existingUserCartRaw = localStorage.getItem(userKey);
      let userItems: any[] = [];
      if (existingUserCartRaw) {
        try {
          userItems = JSON.parse(existingUserCartRaw);
        } catch (e) {}
      }

      guestItems.forEach((gItem) => {
        const gIdStr = String(gItem.id);
        const existingIdx = userItems.findIndex((uItem) => String(uItem.id) === gIdStr);
        if (existingIdx > -1) {
          userItems[existingIdx].quantity = (userItems[existingIdx].quantity || 1) + (gItem.quantity || 1);
        } else {
          userItems.push(gItem);
        }
      });

      localStorage.setItem(userKey, JSON.stringify(userItems));
      localStorage.setItem("the_drop_cart_items", JSON.stringify(userItems));
      localStorage.removeItem(GUEST_CART_KEY);

      window.dispatchEvent(new CustomEvent("cart-updated", { detail: userItems }));
    }
  } catch (e) {
    localStorage.removeItem(GUEST_CART_KEY);
  }
}

export function addItemToCart(item: AddCartPayload) {
  if (typeof window === "undefined") return;

  const numericPrice =
    typeof item.price === "string"
      ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
      : item.price;

  const currentItems = getActiveCartItems();
  const itemIdStr = String(item.id);
  const existingIdx = currentItems.findIndex((i) => String(i.id) === itemIdStr);

  if (existingIdx > -1) {
    currentItems[existingIdx].quantity = (currentItems[existingIdx].quantity || 1) + 1;
  } else {
    currentItems.push({
      id: itemIdStr,
      title: item.title,
      price: numericPrice,
      size: item.size || "M",
      color: item.color || "Black",
      image: item.image,
      quantity: 1,
    });
  }

  saveActiveCartItems(currentItems);
  window.dispatchEvent(new CustomEvent("open-mini-cart"));
}

export function updateCartQuantity(id: string | number, newQuantity: number, size?: string) {
  const current = getActiveCartItems();
  const idStr = String(id);
  const updated = current
    .map((item) => {
      if (String(item.id) === idStr && (!size || item.size === size)) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
    .filter((item) => (item.quantity || 0) > 0);

  saveActiveCartItems(updated);
}

export function removeFromCart(id: string | number, size?: string) {
  const current = getActiveCartItems();
  const idStr = String(id);
  const updated = current.filter((item) => !(String(item.id) === idStr && (!size || item.size === size)));
  saveActiveCartItems(updated);
}

export function getCartTotal(): number {
  const items = getActiveCartItems();
  return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
}
