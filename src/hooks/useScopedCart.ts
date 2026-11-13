'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types';

export function useScopedCart(
  scope: 'kopken' | 'tomoro' | 'premium',
  defaultOutlet: string = ''
) {
  const cartKey = `saoirse_cart_${scope}`;
  const outletKey = `saoirse_cabang_${scope}`;

  const [items, setItems] = useState<CartItem[]>([]);
  const [outlet, setOutletState] = useState<string>(defaultOutlet);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(cartKey);
      if (rawCart) {
        setItems(JSON.parse(rawCart));
      }
      const rawOutlet = localStorage.getItem(outletKey);
      if (rawOutlet) {
        setOutletState(rawOutlet);
      } else if (defaultOutlet) {
        setOutletState(defaultOutlet);
      }
    } catch (e) {
      // silent
    } finally {
      setIsLoaded(true);
    }
  }, [cartKey, outletKey, defaultOutlet]);

  // Save items whenever changed
  const saveItems = useCallback(
    (newItems: CartItem[]) => {
      setItems(newItems);
      try {
        localStorage.setItem(cartKey, JSON.stringify(newItems));
      } catch (e) {}
    },
    [cartKey]
  );

  // Save outlet whenever changed
  const setOutlet = useCallback(
    (newOutlet: string) => {
      setOutletState(newOutlet);
      try {
        localStorage.setItem(outletKey, newOutlet);
      } catch (e) {}
    },
    [outletKey]
  );

  // Add item WITHOUT forcing cart drawer to open
  const addItem = useCallback(
    (item: Omit<CartItem, 'cartItemId'>) => {
      const existingIdx = items.findIndex(
        (it) => it.itemId === item.itemId && it.details === item.details
      );

      if (existingIdx >= 0) {
        const next = [...items];
        next[existingIdx].quantity += item.quantity || 1;
        saveItems(next);
      } else {
        const cartItemId = `${scope}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        saveItems([...items, { ...item, cartItemId }]);
      }

      // Show temporary cute notification toast instead of auto-opening payment
      setAddedToast(`Berhasil menambahkan ${item.name} ke keranjang!`);
      setTimeout(() => {
        setAddedToast(null);
      }, 2500);
    },
    [items, saveItems, scope]
  );

  // Update quantity (+1 or -1)
  const updateQty = useCallback(
    (cartItemId: string, delta: number) => {
      const next = items
        .map((it) => {
          if (it.cartItemId === cartItemId) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[];

      saveItems(next);
    },
    [items, saveItems]
  );

  // Remove item
  const removeItem = useCallback(
    (cartItemId: string) => {
      const next = items.filter((it) => it.cartItemId !== cartItemId);
      saveItems(next);
    },
    [items, saveItems]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  return {
    items,
    outlet,
    setOutlet,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    addedToast,
    isLoaded,
  };
}
