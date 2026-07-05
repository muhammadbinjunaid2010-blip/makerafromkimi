import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Check, MessageCircle, CreditCard, Truck } from "lucide-react";
import { useCartContext } from "../App";

type CheckoutStep = "info" | "payment" | "success";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("info");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  if (items.length === 0 && step !== "success") {
    return (
      <div className="pt-28 pb-16 text-center">
        <p className="text-slate-500 text-lg">Your cart is empty</p>
        <Link
          to="/shop"
          className="mt-4 inline-block text-blue-600 font-medium hover:underline"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePlaceOrder = () => {
    setStep("success");
    clearCart();
  };

  const generateWhatsAppOrder = () => {
    let message = "*New Order from Makera*\n\n";
    message += `*Customer:* ${formData.fullName}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    message += `*Email:* ${formData.email}\n`;
    message += `*Address:* ${formData.address}, ${formData.city}\n\n`;
    message += "*Items:*\n";
    items.forEach((item) => {
      message += `- ${item.productName} x${item.quantity} = Rs. ${(parseFloat(item.productPrice) * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total: Rs. ${totalPrice.toLocaleString()}*`;
    if (formData.notes) {
      message += `\n\n*Notes:* ${formData.notes}`;
    }
    return encodeURIComponent(message);
  };

  if (step === "success") {
    return (
      <div className="pt-28 pb-16 bg-white min-h-screen">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-3">
            Order Placed!
          </h1>
          <p className="text-slate-500 mb-8">
            Thank you for your order. We'll contact you via WhatsApp to confirm
            your order and arrange delivery.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-6 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              step === "info" ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "info"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              1
            </div>
            Details
          </div>
          <div className="flex-1 h-px bg-slate-200" />
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              step === "payment" ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === "payment"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </div>
            Payment
          </div>
        </div>

        {step === "info" && (
          <form onSubmit={handleSubmitInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="077 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                placeholder="123 Main Street, Colombo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Colombo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Order Notes (optional)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                placeholder="Any special instructions..."
              />
            </div>

            {/* Order Summary */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3">
                Order Summary
              </h3>
              <div className="space-y-2 mb-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-medium text-slate-800">
                      Rs.{" "}
                      {(parseFloat(item.productPrice) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-xl font-extrabold text-blue-600">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            {/* Payment Options */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">
                Choose Payment Method
              </h3>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/94771234567?text=${generateWhatsAppOrder()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handlePlaceOrder}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      WhatsApp Order
                    </p>
                    <p className="text-sm text-slate-500">
                      Send order details via WhatsApp for quick confirmation
                    </p>
                  </div>
                </a>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-800">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-slate-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-800">
                      Bank Transfer
                    </p>
                    <p className="text-sm text-slate-500">
                      Pay via bank transfer (details sent via email)
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep("info")}
              className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
            >
              Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
