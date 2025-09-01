import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Test if the image URL is accessible
    const response = await fetch(imageUrl, {
      method: 'HEAD', // Only fetch headers to check if URL is accessible
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Image URL not accessible: ${response.status} ${response.statusText}`,
        status: response.status
      });
    }

    // Get content type to verify it's an image
    const contentType = response.headers.get('content-type');
    const isImage = contentType && contentType.startsWith('image/');

    return NextResponse.json({
      success: true,
      accessible: true,
      contentType: contentType,
      isImage: isImage,
      contentLength: response.headers.get('content-length')
    });

  } catch (error) {
    console.error("Error testing image URL:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to test image URL",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
