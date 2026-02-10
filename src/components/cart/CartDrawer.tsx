import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateCartLine, loading } = useCart();

  const handleQuantityChange = async (lineId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      await removeFromCart([lineId]);
    } else {
      await updateCartLine(lineId, newQuantity);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    await removeFromCart([lineId]);
  };

  const subtotal = (cart?.lines?.edges || []).reduce((total, { node }) => {
    const price = parseFloat(node.merchandise?.priceV2?.amount || '0');
    return total + (price * node.quantity);
  }, 0);

  const itemCount = (cart?.lines?.edges || []).reduce(
    (total, { node }) => total + node.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-2xl font-semibold">
            Shopping Cart {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
        </SheetHeader>

        {!cart || !cart.lines || itemCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-500 mb-6">Add items to get started!</p>
            <Button onClick={onClose} className="bg-black hover:bg-gray-800 text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {(cart?.lines?.edges || []).map(({ node }) => {
                  const price = parseFloat(node.merchandise?.priceV2?.amount || '0');
                  const lineTotal = price * node.quantity;

                  return (
                    <div key={node.id} className="flex gap-4 pb-4 border-b">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {node.merchandise?.product?.images?.edges?.[0]?.node?.url && (
                          <img
                            src={node.merchandise.product.images.edges[0].node.url}
                            alt={node.merchandise?.product?.title || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                              {node.merchandise?.product?.title || 'Product'}
                            </h3>
                            {node.merchandise?.title && node.merchandise.title !== 'Default Title' && (
                              <p className="text-xs text-gray-500 mt-1">
                                {node.merchandise.title}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(node.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(node.id, node.quantity, -1)}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                              disabled={loading}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {node.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(node.id, node.quantity, 1)}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                              disabled={loading}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-sm text-gray-900">
                              ${lineTotal.toFixed(2)}
                            </p>
                            {node.quantity > 1 && (
                              <p className="text-xs text-gray-500">
                                ${price.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="border-t px-6 py-4 bg-gray-50">
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-gray-900">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Taxes and shipping calculated at checkout
                </p>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white py-6 text-base font-medium"
                  onClick={() => {
                    if (cart?.checkoutUrl) {
                      console.log('Original checkout URL:', cart.checkoutUrl);
                      console.log('Cart ID:', cart.id);
                      
                      // Use the original checkoutUrl provided by Shopify
                      // Shopify handles the redirect correctly from their API
                      let checkoutUrl = cart.checkoutUrl;
                      
                      // If it's a shop.app URL (Shop Pay), try to convert to web checkout
                      if (checkoutUrl.includes('shop.app')) {
                        // Extract the token from shop.app URL if possible
                        const urlMatch = checkoutUrl.match(/checkout\/([^?]+)/);
                        if (urlMatch && urlMatch[1]) {
                          const token = urlMatch[1];
                          const shopDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
                          // Try using the web checkout URL with the token
                          checkoutUrl = `https://${shopDomain}/checkouts/${token}`;
                          console.log('Converted Shop Pay URL to web checkout:', checkoutUrl);
                        }
                      }
                      
                      console.log('Final checkout URL:', checkoutUrl);
                      window.location.href = checkoutUrl;
                    } else {
                      console.error('No checkout URL available');
                    }
                  }}
                  disabled={loading || !cart?.checkoutUrl}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

