"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animated Checkmark Component (Google Pay Style)
const GooglePayTick = () => {
  return (
    <motion.div
      className="relative w-24 h-24 mx-auto mb-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 12
      }}
    >
      {/* Outer Circle with Gradient */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.4,
          duration: 0.6,
          ease: "easeOut"
        }}
      />
      
      {/* White Inner Circle */}
      <motion.div
        className="absolute inset-1 rounded-full bg-white flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.6,
          duration: 0.4,
          ease: "easeOut"
        }}
      >
        {/* Animated SVG Checkmark */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-green-600"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 0.6,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-green-300"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{
          delay: 1.2,
          duration: 0.8,
          ease: "easeOut"
        }}
      />
      
      {/* Second Ripple */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-green-200"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{
          delay: 1.4,
          duration: 1,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

 const [verified, setVerified] = useState<boolean | null>(null);

  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(true);
  interface Product {
  id: string;
  title: string;
}

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch("/data/products.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const product = data.products.find((p: Product) => p.id === code);


        if (product) {
          setVerified(true);
          setProductName(product.title);
        } else {
          setVerified(false);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    if (code) loadProducts();
  }, [code]);

  // Loading animation with Google Pay style
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Google Pay Style Loading */}
          <motion.div className="relative w-20 h-20 mb-6">
            <motion.div
              className="absolute inset-0 border-4 border-blue-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 border-4 border-transparent border-t-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <motion.p
            className="text-lg text-gray-600 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Authenticating...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <AnimatePresence mode="wait">
        {verified ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-md mx-auto"
          >
            {/* Google Pay Style Success Tick */}
            <GooglePayTick />

            {/* Success Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-green-600 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              ✓ Verified Successfully
            </motion.h1>

            {/* Product Card */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 backdrop-blur-sm"
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 1.8, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.div
                className="text-sm text-gray-500 mb-2 uppercase tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.4 }}
              >
                Authenticated Product
              </motion.div>
              
              <motion.h2
                className="text-xl md:text-2xl font-bold text-gray-800 mb-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 2.2, 
                  duration: 0.5,
                  type: "spring"
                }}
              >
                {productName}
              </motion.h2>

              {/* Status Badge */}
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 2.4,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Genuine Product
              </motion.div>
            </motion.div>

            {/* Celebration Particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 2 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [0, 10, -10, 0],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: 1.5 + i * 0.1,
                    repeat: 1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="failure"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-md mx-auto"
          >
            {/* Error Animation */}
            <motion.div
              className="w-24 h-24 mx-auto mb-6 relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg" />
              <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                <motion.span
                  className="text-3xl text-red-600"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  ✕
                </motion.span>
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-bold text-red-600 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Authentication Failed
            </motion.h1>

            <motion.p
              className="text-gray-600 bg-white rounded-lg p-4 shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Unable to verify this product. Please check the code and try again.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
