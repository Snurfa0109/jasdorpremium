export interface CoffeeItem {
  id: string;
  brand: 'kopken' | 'tomoro';
  name: string;
  category: 'signature' | 'coffee' | 'non-coffee' | 'tea' | 'food';
  categoryLabel: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  image: string;
  badge?: string;
  sizeOptions: string[]; // e.g. ['Regular', 'Large (+4.000)']
  sugarOptions: string[]; // e.g. ['Normal Sugar (100%)', 'Less Sugar (50%)', 'No Sugar (0%)']
  iceOptions: string[]; // e.g. ['Normal Ice', 'Less Ice', 'No Ice']
  toppingOptions: { name: string; price: number }[];
}

export interface CoffeeBrand {
  id: 'kopken' | 'tomoro';
  name: string;
  slug: string;
  badge: string;
  tagline: string;
  description: string;
  discountHighlight: string;
  outletCount: string;
  items: CoffeeItem[];
}

export const COFFEE_BRANDS: CoffeeBrand[] = [
  {
    id: 'kopken',
    name: 'Kopi Kenangan',
    slug: 'kopi-kenangan',
    badge: 'DISKON 50%',
    tagline: 'Jasa Order Kopi Kenangan Seluruh Indonesia',
    description: 'Pesan menu Kopi Kenangan resmi dengan voucher diskon hingga 50%. Admin pesankan langsung ke outlet pilihanmu, kamu tinggal ambil atas namamu di kasir / pick-up bar.',
    discountHighlight: 'Hemat s.d. 50%',
    outletCount: '1.300+ Outlet Resmi',
    items: [
      {
              "id": "kk-9645",
              "brand": "kopken",
              "name": "Kopi Kenangan Mantan",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Kopi Kenangan Mantan resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "badge": "PALING LARIS",
              "image": "https://cdn.kopikenangan.com/public/da484154-47b1-a756-54a4-8b3490fb0eae",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9831",
              "brand": "kopken",
              "name": "Avocado Coffee",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Avocado Coffee resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 34000,
              "discountPrice": 17000,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/24081765-c705-34a8-eccb-ebccf7f7ae5a",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9852",
              "brand": "kopken",
              "name": "Butterscotch Aren Latte",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Butterscotch Aren Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/a1cb7272-f6e2-bb69-950d-59bc87515fd2",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10019",
              "brand": "kopken",
              "name": "Butterscotch Kenangan Frappe",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Butterscotch Kenangan Frappe resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 33000,
              "discountPrice": 16500,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/36ac278e-5212-00b3-ce73-e347a88b0372",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9853",
              "brand": "kopken",
              "name": "Butterscotch Sea Salt Latte",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Butterscotch Sea Salt Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 27000,
              "discountPrice": 13500,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/e72f731f-d24e-7fed-372b-86eb398a0d22",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10015",
              "brand": "kopken",
              "name": "Kopi Kenangan Mantan Frappe",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Kopi Kenangan Mantan Frappe resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 31000,
              "discountPrice": 15500,
              "discountPercent": 50,
              "badge": "PALING LARIS",
              "image": "https://cdn.kopikenangan.com/public/18899b9c-b242-468f-1839-c096e27b0225",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9882",
              "brand": "kopken",
              "name": "Oatside Kopi Kenangan Mantan",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Oatside Kopi Kenangan Mantan resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 25000,
              "discountPrice": 12500,
              "discountPercent": 50,
              "badge": "PALING LARIS",
              "image": "https://cdn.kopikenangan.com/public/c651acb8-3df7-7b75-45e2-f207926d863a",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-5332",
              "brand": "kopken",
              "name": "Seliter Kenangan - Kopi Kenangan Mantan",
              "category": "signature",
              "categoryLabel": "Kenangan Mantan & Signature",
              "description": "Seliter Kenangan - Kopi Kenangan Mantan resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 100000,
              "discountPrice": 50000,
              "discountPercent": 50,
              "badge": "PALING LARIS",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/b3a1cd95-0c97-4ca9-aa81-24dff220a1c0",
              "sizeOptions": [
                      "1 Liter (Kemasan Botol)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-9823",
              "brand": "kopken",
              "name": "Kopi Susu Black Aren",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Kopi Susu Black Aren resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 23000,
              "discountPrice": 11500,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/2ba99b9b-7912-397a-9fea-a21d4073a197",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-6559",
              "brand": "kopken",
              "name": "Seliter Kenangan - Kopi Susu Black Aren",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Seliter Kenangan - Kopi Susu Black Aren resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 105000,
              "discountPrice": 52500,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/23e79400-9a1c-79a9-27ba-4120fa5a02ae",
              "sizeOptions": [
                      "1 Liter (Kemasan Botol)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-10014",
              "brand": "kopken",
              "name": "Americano",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Americano resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 20000,
              "discountPrice": 10000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/36155ddd-784d-a7d9-4d02-13d596417078",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9880",
              "brand": "kopken",
              "name": "Cafe Malt Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Cafe Malt Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 26000,
              "discountPrice": 13000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/4c582a52-fbc8-2d9e-0007-f6a1c0b5fed6",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10017",
              "brand": "kopken",
              "name": "Cappuccino",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Cappuccino resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 24000,
              "discountPrice": 12000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/8a0d42d0-4801-ca84-48e9-7b434b22aee4",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9818",
              "brand": "kopken",
              "name": "Caramel Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Caramel Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 28000,
              "discountPrice": 14000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/630c892e-17a7-0d8c-301f-9e2d33bf1de8",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9820",
              "brand": "kopken",
              "name": "Caramel Macchiato",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Caramel Macchiato resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 30000,
              "discountPrice": 15000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/821509a2-815f-3349-896c-9d15f787ab37",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9849",
              "brand": "kopken",
              "name": "Creamy Aren Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Creamy Aren Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 24000,
              "discountPrice": 12000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/34ac251c-14e6-44b7-d2b9-b4c63f6e2136",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-11578",
              "brand": "kopken",
              "name": "Drip Bag Coffee (Box)",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Drip Bag Coffee (Box) resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 65000,
              "discountPrice": 32500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/33c1c122-d885-434a-b3d1-288982adbad4",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-11580",
              "brand": "kopken",
              "name": "Drip Bag Coffee (Brewed)",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Drip Bag Coffee (Brewed) resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 20000,
              "discountPrice": 10000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/cd57a1d3-d2c0-42be-b2d5-5140607004b9",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-11579",
              "brand": "kopken",
              "name": "Drip Bag Coffee (Sachet)",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Drip Bag Coffee (Sachet) resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 15000,
              "discountPrice": 7500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/b215748c-4c4a-4bdb-8057-c77673d1237e",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9821",
              "brand": "kopken",
              "name": "Dua Shot Iced Shaken",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Dua Shot Iced Shaken resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 28000,
              "discountPrice": 14000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/82e14825-c028-65d6-0c70-c352639bcf23",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-11411",
              "brand": "kopken",
              "name": "Dua Shot OG Aren",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Dua Shot OG Aren resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 28000,
              "discountPrice": 14000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/7c81b141-162c-4d41-8285-674283926e56",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9822",
              "brand": "kopken",
              "name": "Hazelnut Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Hazelnut Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 28000,
              "discountPrice": 14000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/5ac8e750-455e-dcf6-a4e4-5fb398bb25bb",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10018",
              "brand": "kopken",
              "name": "Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 24000,
              "discountPrice": 12000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/7b33aac1-3e8a-f15d-bb58-158692adf173",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9829",
              "brand": "kopken",
              "name": "Mocha Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Mocha Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 31000,
              "discountPrice": 15500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/92fe7698-7b99-9b4b-39db-8b01557fecb3",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9883",
              "brand": "kopken",
              "name": "Oatside Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Oatside Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 27000,
              "discountPrice": 13500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/4890326b-b307-b2f8-a6f1-1a6ae4b15804",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10603",
              "brand": "kopken",
              "name": "Pistachio Aren Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Pistachio Aren Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/392219eb-08e1-daf9-69d6-a12a8242e5be",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-5338",
              "brand": "kopken",
              "name": "Seliter Kenangan - Americano",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Seliter Kenangan - Americano resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 80000,
              "discountPrice": 40000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/0f32feaa-a842-48bd-8602-7d5776c6741f",
              "sizeOptions": [
                      "1 Liter (Kemasan Botol)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-9071",
              "brand": "kopken",
              "name": "Seliter Kenangan - Caramel Macchiato",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Seliter Kenangan - Caramel Macchiato resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 110000,
              "discountPrice": 55000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/5d630716-4183-1dc2-a85b-8d454ad1fc59",
              "sizeOptions": [
                      "1 Liter (Kemasan Botol)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-5333",
              "brand": "kopken",
              "name": "Seliter Kenangan - Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Seliter Kenangan - Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 100000,
              "discountPrice": 50000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/f2baf847-7fb5-44f6-be5a-ba8235aaf1bb",
              "sizeOptions": [
                      "1 Liter (Kemasan Botol)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-9851",
              "brand": "kopken",
              "name": "Spanish Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Spanish Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 21000,
              "discountPrice": 10500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/e3aa23b8-278d-54a0-0769-0de6e82b4d60",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9830",
              "brand": "kopken",
              "name": "Vanilla Latte",
              "category": "coffee",
              "categoryLabel": "Kopi Kenangan",
              "description": "Vanilla Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 28000,
              "discountPrice": 14000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/6831574a-3d7f-d543-9a0c-bd68e7dcb54a",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9835",
              "brand": "kopken",
              "name": "Avocado Caramel",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Avocado Caramel resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 30000,
              "discountPrice": 15000,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/b5179af7-1dd7-aa4e-09f6-e1a1c8295602",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9836",
              "brand": "kopken",
              "name": "Avocado Milk",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Avocado Milk resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 26000,
              "discountPrice": 13000,
              "discountPercent": 50,
              "badge": "FAVORIT",
              "image": "https://cdn.kopikenangan.com/public/9f2e7aa5-3c8a-24cf-5944-84a5cc8d4cc8",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-12382",
              "brand": "kopken",
              "name": "Taro Cloud Latte",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Taro Cloud Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 25000,
              "discountPrice": 12500,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/73af63fc-8f5c-48c0-aece-da0307e77af8",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-12383",
              "brand": "kopken",
              "name": "Taro Cloud Matcha",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Taro Cloud Matcha resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 25000,
              "discountPrice": 12500,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/ace3b7e3-7320-4adb-b9cb-61752ff91dea",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-12381",
              "brand": "kopken",
              "name": "Taro Milk",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Taro Milk resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/d388cac3-16df-4519-9e80-f8ef633048b9",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9870",
              "brand": "kopken",
              "name": "Air Mineral",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Air Mineral resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 9000,
              "discountPrice": 4500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/a05ec204-65cd-2025-adcf-c7f141ce21c3",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-9837",
              "brand": "kopken",
              "name": "Babyccino",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Babyccino resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/afd5cdf3-964b-a63a-6db2-fb8c08410c61",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9838",
              "brand": "kopken",
              "name": "Caramel Dutch Choco",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Caramel Dutch Choco resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 31000,
              "discountPrice": 15500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/c241a3f5-7e20-25be-a067-76170345d684",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9892",
              "brand": "kopken",
              "name": "Dutch Choco Kenangan Frappe",
              "category": "non-coffee",
              "categoryLabel": "Kenangan Frappe",
              "description": "Dutch Choco Kenangan Frappe resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 33000,
              "discountPrice": 16500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/0bf0ec79-18a9-414f-4b7e-e50b940495bf",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9839",
              "brand": "kopken",
              "name": "Dutch Chocolate",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Dutch Chocolate resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 26000,
              "discountPrice": 13000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/e7dfc639-f112-28b7-4cff-8e1cda6f82b5",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9841",
              "brand": "kopken",
              "name": "Hazelnut Dutch Choco",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Hazelnut Dutch Choco resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 31000,
              "discountPrice": 15500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/d1e575af-ee5a-bbf7-0e41-915c0e5f93d6",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9827",
              "brand": "kopken",
              "name": "Matcha Espresso",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Matcha Espresso resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 28000,
              "discountPrice": 14000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/20738f57-23ed-ea72-85f3-cdd8bc468352",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10020",
              "brand": "kopken",
              "name": "Matcha Kenangan Frappe",
              "category": "non-coffee",
              "categoryLabel": "Kenangan Frappe",
              "description": "Matcha Kenangan Frappe resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 35000,
              "discountPrice": 17500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/f3c9aacf-fbae-370a-082d-9e719e4909e7",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9861",
              "brand": "kopken",
              "name": "Matcha Latte",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Matcha Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 27000,
              "discountPrice": 13500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/97f5cfe8-ad68-1598-9430-1b5f732deedc",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10219",
              "brand": "kopken",
              "name": "Milk Oreo Crumble",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Milk Oreo Crumble resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 29000,
              "discountPrice": 14500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/d27c63d0-4931-60fd-5eec-0963bdf095fc",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9846",
              "brand": "kopken",
              "name": "Milo Dinosaurus",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Milo Dinosaurus resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 23000,
              "discountPrice": 11500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/658f1737-546d-133b-ac36-aea2f524920c",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9864",
              "brand": "kopken",
              "name": "Oatside Matcha Latte",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Oatside Matcha Latte resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 27000,
              "discountPrice": 13500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/d048cf0f-ed3f-8b76-26b0-75f651fe5dc7",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9854",
              "brand": "kopken",
              "name": "Oreo Shake",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Oreo Shake resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 26000,
              "discountPrice": 13000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/8c0d86d6-3c45-8c5e-4679-ae4f6d935583",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9857",
              "brand": "kopken",
              "name": "Susu Grass Jelly",
              "category": "non-coffee",
              "categoryLabel": "Non Coffee & Cokelat",
              "description": "Susu Grass Jelly resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 24000,
              "discountPrice": 12000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/9717e724-83d5-7c5f-55b9-efbb1b2a7864",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-10016",
              "brand": "kopken",
              "name": "Vanilla Kenangan Frappe",
              "category": "non-coffee",
              "categoryLabel": "Kenangan Frappe",
              "description": "Vanilla Kenangan Frappe resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 29000,
              "discountPrice": 14500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/839fa121-427c-110e-6550-479d604d1f2d",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-12380",
              "brand": "kopken",
              "name": "Taro Cloud Milk Tea",
              "category": "tea",
              "categoryLabel": "Kenangan Tea",
              "description": "Taro Cloud Milk Tea resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/72c9b4d3-a487-457d-8e94-060d3aee9b1e",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9871",
              "brand": "kopken",
              "name": "Hazelnut Choco Milk Tea",
              "category": "tea",
              "categoryLabel": "Kenangan Tea",
              "description": "Hazelnut Choco Milk Tea resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 23000,
              "discountPrice": 11500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/9766bcc9-55b8-aa14-2a02-6c94e24ddaf4",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9844",
              "brand": "kopken",
              "name": "Kenangan Milk Tea",
              "category": "tea",
              "categoryLabel": "Kenangan Tea",
              "description": "Kenangan Milk Tea resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 21000,
              "discountPrice": 10500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/5a15d4ef-582c-1391-5e58-e523d6b87398",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9842",
              "brand": "kopken",
              "name": "Lemon Black Tea",
              "category": "tea",
              "categoryLabel": "Kenangan Tea",
              "description": "Lemon Black Tea resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 19000,
              "discountPrice": 9500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/3be29e5b-7a9d-8cb5-1d97-9667d92378f9",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-9855",
              "brand": "kopken",
              "name": "Raspberry Hibiscus",
              "category": "tea",
              "categoryLabel": "Kenangan Tea",
              "description": "Raspberry Hibiscus resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/615287c4-c7a7-272c-c38e-df0c89886391",
              "sizeOptions": [
                      "Regular",
                      "Large (+4.000)"
              ],
              "sugarOptions": [
                      "Normal Sugar (100%)",
                      "Less Sugar (50%)",
                      "No Sugar (0%)"
              ],
              "iceOptions": [
                      "Normal Ice",
                      "Less Ice",
                      "No Ice"
              ],
              "toppingOptions": [
                      {
                              "name": "Grass Jelly (Cincau)",
                              "price": 4000
                      },
                      {
                              "name": "Boba Kenangan",
                              "price": 4000
                      },
                      {
                              "name": "Coffee Jelly",
                              "price": 4000
                      }
              ]
      },
      {
              "id": "kk-5335",
              "brand": "kopken",
              "name": "Seliter Kenangan - Thai Tea",
              "category": "tea",
              "categoryLabel": "Kenangan Tea",
              "description": "Seliter Kenangan - Thai Tea resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 90000,
              "discountPrice": 45000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/5dc25a45-9e23-4f3a-8f76-52771e109ad6",
              "sizeOptions": [
                      "1 Liter (Kemasan Botol)"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12372",
              "brand": "kopken",
              "name": "Beef & Cheese Jalapeño Bagel",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Beef & Cheese Jalapeño Bagel resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 24000,
              "discountPrice": 12000,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/f5239e58-8fa7-4eac-84d9-3c66b8cd059e",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12436",
              "brand": "kopken",
              "name": "Choco Peanut Butter Panini",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Choco Peanut Butter Panini resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 23000,
              "discountPrice": 11500,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/ebb8c338-239c-4fa8-ab74-0ce949897828",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12435",
              "brand": "kopken",
              "name": "Classic Peanut Butter Panini",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Classic Peanut Butter Panini resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 21000,
              "discountPrice": 10500,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/897b3ee2-0ee9-4a10-84b7-6ad64ccc3fcb",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12370",
              "brand": "kopken",
              "name": "Double Choco Bagel",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Double Choco Bagel resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/63681082-b5b6-4943-b58b-96c6b8c64734",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12437",
              "brand": "kopken",
              "name": "Strawberry Peanut Butter Panini",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Strawberry Peanut Butter Panini resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 23000,
              "discountPrice": 11500,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/1818734e-23b9-4404-99b1-2667d706981b",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12371",
              "brand": "kopken",
              "name": "Triple Cheese Bagel",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Triple Cheese Bagel resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "badge": "BARU",
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/186b5436-c2a5-4b4e-bef4-319943616c12",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-5918",
              "brand": "kopken",
              "name": "Adam Ayam Toast",
              "category": "food",
              "categoryLabel": "Kenangan Toast",
              "description": "Adam Ayam Toast resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 25000,
              "discountPrice": 12500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/79146711-94ca-c5cf-8b18-11205acac4b7",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-5915",
              "brand": "kopken",
              "name": "Bambang Choco Cheese Toast",
              "category": "food",
              "categoryLabel": "Kenangan Toast",
              "description": "Bambang Choco Cheese Toast resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/bccc5e24-0e25-1a67-1361-5b22783c1833",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12059",
              "brand": "kopken",
              "name": "Bananachoco Soft Baked Cookie",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Bananachoco Soft Baked Cookie resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/05eb553f-d71c-4fef-aa17-d21c58d62ff1",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-5965",
              "brand": "kopken",
              "name": "Choco Chip Cookies",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Choco Chip Cookies resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 14000,
              "discountPrice": 7000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/4974032d-c48d-eac4-93a9-a5d47eaf5f60",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-11206",
              "brand": "kopken",
              "name": "Chocolate Choux Puff",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Chocolate Choux Puff resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 16000,
              "discountPrice": 8000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/207e4c8e-2d59-4bdd-8c15-a5c4176dce1a",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-3050",
              "brand": "kopken",
              "name": "Chocolate Croissant",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Chocolate Croissant resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 19000,
              "discountPrice": 9500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/c1f26135-eacc-4eca-0444-8356c507e0db",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-9010",
              "brand": "kopken",
              "name": "Chocolate Donut",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Chocolate Donut resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 13000,
              "discountPrice": 6500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/6eb95cd8-4dc2-2f07-c77b-78a5789f1c89",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-10585",
              "brand": "kopken",
              "name": "Donut Almond",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Donut Almond resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 17000,
              "discountPrice": 8500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/ee829769-9e58-4125-b31f-7aa1e8dbfad2",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-1261",
              "brand": "kopken",
              "name": "Friend Chip Cookie",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Friend Chip Cookie resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 17000,
              "discountPrice": 8500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/bf62a77f-41cf-babb-97e1-4dfc6a889487",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12060",
              "brand": "kopken",
              "name": "Oatmeal Raisin Soft Baked Cookie",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Oatmeal Raisin Soft Baked Cookie resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 22000,
              "discountPrice": 11000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/bf2761e1-0e2f-4e6d-9fd6-3c573c1648c9",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-3469",
              "brand": "kopken",
              "name": "Roti Coklat Klasik",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Roti Coklat Klasik resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 9000,
              "discountPrice": 4500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/b10ffd87-6f6e-fb75-8a37-2b1e993bdc8a",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-3466",
              "brand": "kopken",
              "name": "Roti Keju Manis",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Roti Keju Manis resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 13000,
              "discountPrice": 6500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/682e9719-e692-1872-c174-d634a34ff67d",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-4299",
              "brand": "kopken",
              "name": "Roti Srikaya",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Roti Srikaya resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 15000,
              "discountPrice": 7500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/a5bbc92a-9abe-d2f3-daf9-b00dca1ac336",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-3473",
              "brand": "kopken",
              "name": "Roti Susu Manis",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Roti Susu Manis resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 10000,
              "discountPrice": 5000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/c84c79bb-893d-c83d-3562-c48b40c66aa8",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-11827",
              "brand": "kopken",
              "name": "Salt Bread Choco Butter",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Salt Bread Choco Butter resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 15000,
              "discountPrice": 7500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/091b6b3e-dd10-45fc-9d49-a905dc713228",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-11003",
              "brand": "kopken",
              "name": "Salt Bread Original",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Salt Bread Original resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 15000,
              "discountPrice": 7500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/13fe0b4c-b159-4b60-91ae-b3a6f6552746",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-11207",
              "brand": "kopken",
              "name": "Strawberry Choux Puff",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Strawberry Choux Puff resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 16000,
              "discountPrice": 8000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/573912ec-701c-4e99-802e-affd7eef6e9b",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-12058",
              "brand": "kopken",
              "name": "Sweet Honey Soft Baked Cookie",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Sweet Honey Soft Baked Cookie resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 21000,
              "discountPrice": 10500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/690b5282-8bfe-4066-b34e-8091c54e7914",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-11205",
              "brand": "kopken",
              "name": "Vanilla Choux Puff",
              "category": "food",
              "categoryLabel": "Roti & Bakery",
              "description": "Vanilla Choux Puff resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 16000,
              "discountPrice": 8000,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/ID/release/pub/kk-api-management/product/856c89ab-af73-4fd8-a990-58013c896c6c",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
      {
              "id": "kk-5917",
              "brand": "kopken",
              "name": "Wahyu Sapi Toast",
              "category": "food",
              "categoryLabel": "Kenangan Toast",
              "description": "Wahyu Sapi Toast resmi Kopi Kenangan rasa autentik segar.",
              "originalPrice": 25000,
              "discountPrice": 12500,
              "discountPercent": 50,
              "image": "https://cdn.kopikenangan.com/public/9844851e-1ef8-dc73-309f-24bad50dffab",
              "sizeOptions": [
                      "Single Serving"
              ],
              "sugarOptions": [],
              "iceOptions": [],
              "toppingOptions": []
      },
    ],
  },
];
