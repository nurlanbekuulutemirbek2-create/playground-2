"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Download, RefreshCw, Sparkles, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ImageService } from "../../lib/firebase-utils";

interface GeneratedImage {
  url: string;
  originalUrl?: string;
  prompt: string;
  size: string;
  quality: string;
  style: string;
  timestamp: string;
}

export default function ImageGenerator() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    size: "1024x1024",
    quality: "standard",
    style: "vivid"
  });

  const sizeOptions = [
    { value: "1024x1024", label: "Square (1024x1024)" },
    { value: "1792x1024", label: "Landscape (1792x1024)" },
    { value: "1024x1792", label: "Portrait (1024x1792)" }
  ];

  const qualityOptions = [
    { value: "standard", label: "Standard" },
    { value: "hd", label: "HD" }
  ];

  const styleOptions = [
    { value: "vivid", label: "Vivid" },
    { value: "natural", label: "Natural" }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          ...settings
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to generate image");
      }

      if (data.success) {
        console.log('Image generated successfully:', data);
        const imageData = {
          url: data.imageUrl,
          prompt: data.prompt,
          size: data.size,
          quality: data.quality,
          style: data.style,
          timestamp: new Date().toISOString()
        };
        
        console.log('Setting generated image:', imageData);
        
        // Create a proxied URL to avoid CORS issues
        const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(data.imageUrl)}`;
        const imageDataWithProxy = {
          ...imageData,
          url: proxiedUrl,
          originalUrl: data.imageUrl // Keep original URL for debugging
        };
        
        setGeneratedImage(imageDataWithProxy);
        setImageLoading(true);
        
                  // Test if the image URL is accessible
          try {
            const testResponse = await fetch("/api/test-image-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                imageUrl: data.imageUrl
              }),
            });
            
            const testData = await testResponse.json();
            console.log('Image URL test result:', testData);
            
            if (!testData.success) {
              console.error('Image URL not accessible:', testData.error);
              setError(`Image URL not accessible: ${testData.error}`);
            } else {
              console.log('Image URL is accessible and valid:', testData);
            }
          } catch (testError) {
            console.error('Error testing image URL:', testError);
          }
        
        // Save to Firebase if user is signed in
        if (user) {
          try {
            await ImageService.saveGeneratedImage(user.id, imageData);
            console.log('Image saved to Firebase successfully');
          } catch (error) {
            console.error('Error saving image to Firebase:', error);
            // Don't show error to user as image generation was successful
          }
        }
      } else {
        console.error('Image generation failed:', data);
        throw new Error(data.error || data.details || "Failed to generate image");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      console.log('Downloading image from:', generatedImage.originalUrl || generatedImage.url);
      
      // Create a proxy API route to handle CORS
      const response = await fetch("/api/download-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: generatedImage.originalUrl || generatedImage.url,
          filename: `generated-image-${Date.now()}.png`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to download image: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Image downloaded successfully');
    } catch (error) {
      console.error("Error downloading image:", error);
      setError(error instanceof Error ? error.message : "Failed to download image");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Image Generator</h2>
            <p className="text-gray-600">Transform your ideas into stunning visuals with DALL-E 3</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: showSettings ? "auto" : 0 }}
        className="mb-6 overflow-hidden"
      >
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Size
              </label>
              <select
                value={settings.size}
                onChange={(e) => setSettings({ ...settings, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality
              </label>
              <select
                value={settings.quality}
                onChange={(e) => setSettings({ ...settings, quality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {qualityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                value={settings.style}
                onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {styleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prompt Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the image you want to generate
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the sky..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                disabled={loading}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                Press Enter to generate
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
              </>
            )}
          </motion.button>

          {generatedImage && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadImage}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = generatedImage.originalUrl || generatedImage.url;
                  a.download = `generated-image-${Date.now()}.png`;
                  a.target = "_blank";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Direct Download</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Generated Image */}
      {generatedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* Debug Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Debug Info</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Proxied URL:</strong> {generatedImage.url}</p>
              <p><strong>Original URL:</strong> {generatedImage.originalUrl?.substring(0, 100)}...</p>
              <p><strong>Image Loading:</strong> {imageLoading ? 'Yes' : 'No'}</p>
              <p><strong>Timestamp:</strong> {generatedImage.timestamp}</p>
            </div>
                          <div className="mt-3 space-y-2">
                <button
                  onClick={() => {
                    const testImg = new window.Image();
                    testImg.onload = () => console.log('Test image loaded successfully');
                    testImg.onerror = () => console.error('Test image failed to load');
                    testImg.src = generatedImage.url;
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Test Proxied Image
                </button>
                <button
                  onClick={() => {
                    setImageLoading(true);
                    // Force a refresh of the image by adding a timestamp
                    const imgElement = document.querySelector('img[src*="proxy-image"]') as HTMLImageElement;
                    if (imgElement) {
                      const newUrl = `${generatedImage.url}&t=${Date.now()}`;
                      imgElement.src = newUrl;
                    }
                  }}
                  className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                >
                  Force Refresh Image
                </button>
                <div>
                  <button
                    onClick={() => window.open(generatedImage.url, '_blank')}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Open Proxied Image
                  </button>
                  <button
                    onClick={() => window.open(generatedImage.originalUrl, '_blank')}
                    className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 ml-2"
                  >
                    Open Original
                  </button>
                </div>
              </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generated Image</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Prompt:</strong> {generatedImage.prompt}</p>
              <div className="flex space-x-4">
                <span><strong>Size:</strong> {generatedImage.size}</span>
                <span><strong>Quality:</strong> {generatedImage.quality}</span>
                <span><strong>Style:</strong> {generatedImage.style}</span>
              </div>
              <p><strong>Generated:</strong> {new Date(generatedImage.timestamp).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="relative group">
            {imageLoading && (
              <div className="flex justify-center">
                <div className="max-w-md w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading image...</p>
                    <p className="text-sm text-gray-500">This may take a few seconds</p>
                  </div>
                </div>
              </div>
            )}
                        <div className="flex justify-center">
              <div className="relative">
                {imageError ? (
                  <div className="max-w-md w-full h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-red-500 text-lg mb-2">⚠️</div>
                      <p className="text-red-600 font-medium">Image failed to load</p>
                      <p className="text-red-500 text-sm mt-1">{imageError}</p>
                      <button
                        onClick={() => {
                          setImageError(null);
                          setImageLoading(true);
                          const imgElement = document.querySelector('img[src*="proxy-image"]') as HTMLImageElement;
                          if (imgElement) {
                            imgElement.src = `${generatedImage.url}&retry=${Date.now()}`;
                          }
                        }}
                        className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={generatedImage.url}
                    alt={generatedImage.prompt}
                    className={`max-w-md w-full rounded-lg shadow-lg ${imageLoading ? 'hidden' : 'block'}`}
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      console.error('Image URL that failed:', generatedImage.url);
                      setImageError('Failed to load generated image');
                      setImageLoading(false);
                    }}
                                    onLoad={(e) => {
                  console.log('Generated image loaded successfully');
                  const target = e.target as HTMLImageElement;
                  console.log('Image dimensions:', target.naturalWidth, 'x', target.naturalHeight);
                  setImageLoading(false);
                  setImageError(null);
                  // Show success message briefly
                  setTimeout(() => {
                    console.log('Image display successful!');
                  }, 100);
                }}
                  />
                )}
                {!imageLoading && !imageError && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    ✓ Displayed
                  </div>
                )}
              </div>
            </div>
            
            {/* Fallback test image */}
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">Test Image Display</h4>
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo="
                alt="Test image"
                className="w-full rounded-lg shadow-lg"
                onError={() => console.error('Test image failed to load')}
                onLoad={() => console.log('Test image loaded successfully')}
              />
              <p className="text-xs text-yellow-700 mt-2">
                This is a test image to verify image loading is working. 
                If you can see this, the image display functionality is working correctly.
              </p>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={downloadImage}
                className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your masterpiece...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </motion.div>
      )}
    </div>
  );
}
