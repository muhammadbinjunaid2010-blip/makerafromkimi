import { Link, useNavigate } from "react-router";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { useCartContext } from "../App";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } =
    useCartContext();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-16 bg-white min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-slate-500 mb-6">
            Browse our products and add items to your cart.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const generateWhatsAppMessage = () => {
    let message = "Hello Makera! I'd like to order:\n\n";
    items.forEach((item) => {
      message += `- ${item.productName} x${item.quantity} - Rs. ${(parseFloat(item.productPrice) * item.quantity).toLocaleString()}\n`;
    });
    message += `\nTotal: Rs. ${totalPrice.toLocaleString()}`;
    return encodeURIComponent(message);
  };

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">
            Shopping Cart ({totalItems})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 object-contain bg-white rounded-lg p-2"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm truncate">
                  {item.productName}
                </h3>
                <p className="text-blue-600 font-bold text-sm">
                  Rs. {parseFloat(item.productPrice).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <p className="font-bold text-slate-800 text-sm w-24 text-right hidden sm:block">
                Rs. {(parseFloat(item.productPrice) * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-bold text-slate-800">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600">Shipping</span>
            <span className="font-medium text-green-600">
              {totalPrice >= 5000 ? "Free" : "Calculated at checkout"}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between mb-6">
            <span className="text-lg font-bold text-slate-800">Total</span>
            <span className="text-2xl font-extrabold text-blue-600">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/94771234567?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
