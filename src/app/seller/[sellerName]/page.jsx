import { Suspense } from "react";
import SellerStoreClient from "@/components/product/SellerStoreClient";

export const metadata = {
  title: "Seller Store | UnityShop",
  description: "View seller profile and their products on UnityShop.",
};

export default async function SellerPage({ params }) {
  const resolvedParams = await params;
  console.log("SELLER PAGE PARAMS:", resolvedParams);
  const rawParam = resolvedParams.sellerName ?? resolvedParams.email;
  let sellerNameValue = rawParam
    ? decodeURIComponent(rawParam)
    : "UnityShop Seller";
  if (sellerNameValue === "undefined") sellerNameValue = "UnityShop Seller";

  // Also verify valid param
  if (
    typeof sellerNameValue === "string" &&
    sellerNameValue.toLowerCase() === "undefined"
  ) {
    sellerNameValue = "UnityShop Seller";
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full" />
        </div>
      }
    >
      <SellerStoreClient sellerName={sellerNameValue} />
    </Suspense>
  );
}
