export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  isNew?: boolean;
  images: {
    primary: string;
    secondary: string;
  };
  colors: { name: string; hex: string }[];
  sizes: string[];
  details: string[];
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  slug: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  {
    id: "women",
    name: "WOMEN",
    subtitle: "The Modern Silhouette",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLApCOW5Eg8zCgaK45qoQwxJqVsYA3JSF_FglQo-HqEcwBMAqbr5aWwnRYZosCQyONt6L3_uz61oPLFnidwPLfElnFcIVMscuKy2dfz2H8vbwSdamkbKATEcpZHXpuz0tocswO_vEhzpmo-zO0gxbhHjDJyutntbzaOOGll3gnIZ92TRRRXHt1BApp5oMkwHKjizWBSB1ExnRGNsKgPm7kjviAh8KmSQqSRMWtAEYGXn_bcGHw6Xap_K2Ogd5z0m1_n3VtdpkPYPg",
    slug: "women",
    count: 24,
  },
  {
    id: "outerwear",
    name: "OUTERWEAR",
    subtitle: "Sculptural Form & Wool",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0jCFFDPLQFoZItChNPJPXDKs7uQNQUdUpaqsDuj6zx9nxm6RJnbhZpD5VrBieaOoboGQ5yguQvyX7fc8mJPTr0sAu1nP7l2rlozN6QEhM_9gbEFFWrSqK79cHxx4dHysN0-BAerwaSK8HG0VIXAeY_rTf1FLjEC30aKEKzfuASGRVxPtLqSNt0tFFTzLQyCRTqOCuflXOIpJmA9VvgWAbc5q5NgYHwpefnOsB8v7VrgjZpSmdbTYTz38fzG4hUBPjKlFBI3lh9-s",
    slug: "outerwear",
    count: 18,
  },
  {
    id: "runway",
    name: "RUNWAY",
    subtitle: "Avant-Garde Tailoring",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4LBUJ15miOH1zTX-GKhFfTjcf6Ih6UipuHRj3QM1NrsS8DK8LiH7SCJ_MjZPoDXSkV20W0mHRhoIE_D34GapYGD4i3xD-pCVGHyxsv4I9lWI-NmmcT17L-qxxsGCZ5X7bYlsO62Lm223OdSax39nlbYIySsx4g8R1zbHcErUkLpGfaUkICjn4YcJ9eRS7nInmS83FCQBZnc43iB1J2NawnzD8yFEWwiY30h7Gqnzz2yunIaifzUQC-OoVI6rLXsYOPpB-zVBfwxI",
    slug: "runway",
    count: 12,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "sculptural-wool-coat",
    name: "Sculptural Wool Coat",
    slug: "sculptural-wool-coat",
    price: 1890,
    category: "Outerwear",
    isNew: true,
    description: "An architectural masterpiece crafted from heavy-grade Italian virgin wool. Features sharp padded shoulders, structured lapels, and an asymmetrical button closure.",
    images: {
      primary: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYj6QIF5u9YWTrb5YFQ8tx7z7h2By443s9iwytlW5XgVP9PTN4O1pxH1fRnSO5IniiMbw0ziY1k4PgvlwS7jJwBHjg8vH4kJ6oTRtBBI5FHy40LuI6r45gNXy0nc6zVVCd74sBi1buzBQbqnROWJAces3PjSaz0FYGyEIxNiZ7dkzdiIJxadhKgkB1lZhJfeVHzx0z9P_EU7WXgpy0IWczKUh8i5SHL4W6OivAbAVNtrNishK29pX6Q7n8jIRJD0X7fMFkbmyOADM",
      secondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhAprZOorUtV1ehGXRDQjLOsucm4e3OWtm5SX9Ailq7k1pyg_5mRWvucl9xyEhoWoJbLc4y8TRO__7YQ6yFrCWyU-zUSSBPCDuVExsXeA82NEGecNwiaqLozN21AYNBWGKhwKLK1f6vEe_O8OLLi8bXD-bEQIAfkBpCBwlPNzs7CO1gaWQg9wdjcW7Ngi4esSDpD9zcYpw_Q8gaWvQ0DTJW-d7t2lfO36LVapTcPFnSB7_qymc61d_VN_L-4kwoI9HBfMiTvBGwL0",
    },
    colors: [
      { name: "Milano Red", hex: "#7E0500" },
      { name: "Dark Charcoal", hex: "#1A1A1A" },
      { name: "Off White", hex: "#F5F5F5" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [
      "100% Virgin Italian Wool",
      "Internal Cupro Silk Lining",
      "Architectural Shoulder Structure",
      "Dry Clean Only",
      "Made in Milan, Italy",
    ],
  },
  {
    id: "structured-wool-blazer",
    name: "Structured Wool Blazer",
    slug: "structured-wool-blazer",
    price: 1240,
    category: "Suits",
    isNew: true,
    description: "Minimalist black structured blazer with oversized lapels and clean studio tailoring. High-fashion aesthetic designed for powerful silhouettes.",
    images: {
      primary: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOo62xvi6wvC8B3AdFrAyePdU8aBnfnoMOVqnhdJe9GEoiSv_h9VL94VprzmdK3hCGInXQx8AhCXGqRViYybVrVaYAgH7cp7noyYU67_537-Vx-B__RhxEqxQEQluoEBhgpavYiZvGXWrKOioTLxH51NZssPvB07coeokOUawolfIEyc4sZhJYXynascNvEL0qQts3F2uO-KqrkrQikMP7w6B6i9fuX-xa2uFmyFFnpoMYfUYrdhfK_mHYY3lzvEV9502GKYiqLIM",
      secondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtxFAmg440wSvSx4XSortZNXbEAYDF-_C34GifN4t0xxBZxmadmX5j745ZAKo36OrQA2lf5h2IXTD6cCM3s67zwXNrYOjF0vp-fox-dPfZWIHMVXLuuf3TMjak7cfuElvGmVpbwqBtt3XsHf57JSwafrrk5uuK7YkB0p1L0JCS9ZDpf_OhnaMWFvznmfJI0GGzCDoXknteEs46Wd-bZzhOTGiFj-ogTqJbkdbCzNR0JWxYzl5Fk-VmQhgKnomk-Wf7QQeOywA1rv4",
    },
    colors: [
      { name: "Dark Charcoal", hex: "#1A1A1A" },
      { name: "Milano Red", hex: "#7E0500" },
    ],
    sizes: ["S", "M", "L"],
    details: [
      "95% Wool, 5% Elastane",
      "Horn Buttons",
      "Double Vent Rear",
      "Dry Clean Only",
    ],
  },
  {
    id: "milan-silk-slip-dress",
    name: "Milan Silk Slip Dress",
    slug: "milan-silk-slip-dress",
    price: 890,
    category: "Dresses",
    description: "Deep Milano Red silk slip dress with delicate thin straps and high-luster sheen. Elegant fluid drape for evening engagements.",
    images: {
      primary: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPpkn04zy3-SAHO0BbvyJQ-nuKK5NF12LT9--Nao_m4Umw01gxf9d0AxvGLFQt1GOKmks5lac8L64d8zGFDTVKLdqSwaUP13iU_WqCwr6nA4xqb12Oq1kvG_d_6UrqL8EV-AvYiEz9q89M3BPe2mr4S3XW4HDhWrhTzgEdr-vn2IV585euNz1rGlQD7w8SLOc26GMS5aXAzmGmtEMP1bDE4zqK2cD6g06GS0GbmEXsOxfU-m1JQyLegKxnV-X6Xz8ZZa3FB9aumtY",
      secondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKckb3OZHLRrASh4lsosXMQ4zdJcN80hgG9mwZw3UrdDx9xvj8DlcGWYw_krGC7l1mSFJXxqooSl-HZ02qZ8FkI-7mxhYpHT_5riT-9DE4bvxoOoUbVAYRNqR2UYUpiKAxNUVOesuuixIygvAzArABQTlngjNLoBSjSAEdfTrsiOwSAl-Y-eFH6bA25rmhyzRTnZ8R4QW-C1pld5GOTnJg7c8iqtRsXtK80JMSOdmksZwt0d_q-HdvodEiErr5kxb21Cku7P1Mfwg",
    },
    colors: [
      { name: "Milano Red", hex: "#7E0500" },
      { name: "Obsidian", hex: "#1A1A1A" },
    ],
    sizes: ["XS", "S", "M", "L"],
    details: ["100% Mulberry Silk", "Adjustable Straps", "Bias Cut"],
  },
];
