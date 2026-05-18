import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const addToCart = useCallback((product, size) => {
    setCart(prev => {
      const existing = prev.find(x => x.id === product.id && x.size === size);
      if (existing) {
        return prev.map(x =>
          x.id === product.id && x.size === size
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }
      return [...prev, { ...product, qty: 1, size: size || product.sizes[0] }];
    });
    showToast(`${product.name} added to cart!`);
  }, []);

  const changeCartQty = useCallback((id, delta) => {
    setCart(prev => {
      const updated = prev.map(x =>
        x.id === id ? { ...x, qty: x.qty + delta } : x
      );
      return updated.filter(x => x.qty > 0);
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(x => x.id !== id));
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        toast,
        cartCount,
        cartTotal,
        addToCart,
        changeCartQty,
        removeFromCart,
        toggleCart,
        setIsCartOpen,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
