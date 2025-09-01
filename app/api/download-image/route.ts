import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, filename } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Handle relative URLs (our proxy URLs)
    let fetchUrl = imageUrl;
    if (imageUrl.startsWith('/api/proxy-image')) {
      try {
        // Extract the original URL from the proxy URL
        const url = new URL(imageUrl, 'http://localhost:3000');
        const originalUrl = url.searchParams.get('url');
        if (originalUrl) {
          fetchUrl = decodeURIComponent(originalUrl);
          console.log('Extracted original URL for download:', fetchUrl);
        }
      } catch (error) {
        console.error('Error parsing proxy URL:', error);
        return NextResponse.json(
          { error: "Invalid proxy URL format" },
          { status: 400 }
        );
      }
    }

    console.log('Fetching image from:', fetchUrl);
    // Fetch the image from the URL
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    // Get the image as a blob
    const imageBlob = await response.blob();

    // Return the image blob with proper headers
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": imageBlob.type || "image/png",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });

  } catch (error) {
    console.error("Error downloading image:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to download image",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
