// import PaymentButton from '@/components/PaymentButton';

import PaymentButton from "@/components/common/payment-button/PaymentButton";

export default function TestPaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800">Payment Test</h1>

        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Product:</span> Test Headphones
          </p>
          <p>
            <span className="font-medium">Price:</span> $9.99
          </p>
          <p>
            <span className="font-medium">Quantity:</span> 1
          </p>
        </div>

        <PaymentButton
          price={9.99}
          productId="test-product-001"
          quantity={1}
          productName="Test Headphones"
          userEmail="testbuyer@gmail.com"
          sellerName="Test Seller"
          sellerEmail="testseller@gmail.com"
          className="w-full"
        />
      </div>
    </div>
  );
}
