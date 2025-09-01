import { NextResponse } from "next/server";

export async function GET() {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a motivational quote generator. Generate inspiring, uplifting quotes that are original and meaningful. Always provide both the quote text and the author name. Keep quotes concise but impactful."
          },
          {
            role: "user",
            content: "Generate a motivational quote with the format: 'Quote text' - Author Name"
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const quoteText = data.choices[0]?.message?.content?.trim();

    if (!quoteText) {
      throw new Error("No quote generated");
    }

    // Parse the quote to extract text and author
    const quoteMatch = quoteText.match(/^["""]([^"""]+)["""]\s*[-—]\s*(.+)$/);
    
    if (quoteMatch) {
      const [, text, author] = quoteMatch;
      return NextResponse.json({
        text: text.trim(),
        author: author.trim(),
      });
    } else {
      // Fallback parsing
      const parts = quoteText.split(/[-—]/);
      if (parts.length >= 2) {
        const text = parts[0].replace(/^["""]|["""]$/g, '').trim();
        const author = parts[1].trim();
        return NextResponse.json({
          text,
          author,
        });
      } else {
        // If parsing fails, return the whole text as quote
        return NextResponse.json({
          text: quoteText.replace(/^["""]|["""]$/g, '').trim(),
          author: "AI Inspiration",
        });
      }
    }
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    
    // Return a fallback quote
    return NextResponse.json({
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    });
  }
}
