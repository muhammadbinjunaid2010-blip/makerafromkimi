import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: string;
  productImage: string;
  quantity: number;
}

const CART_STORAGE_KEY = "makera_cart";

function getSessionId(): string {
  let sessionId = localStorage.getItem("makera_session");
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("makera_session", sessionId);
  }
  return sessionId;
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const sessionId = getSessionId();

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback(
    (product: {
      id: number;
      name: string;
      price: string;
      image: string;
    }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [
          ...prev,
          {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            quantity: 1,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalPrice = items.reduce((sum, i) => {
    return sum + parseFloat(i.productPrice) * i.quantity;
  }, 0);

  return {
    items,
    sessionId,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
