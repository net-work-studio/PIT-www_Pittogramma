import { NextResponse } from "next/server";

interface GoogleBooksVolumeInfo {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBooksItem[];
}

export interface BookData {
  title: string | null;
  authors: string | null;
  publisher: string | null;
  year: number | null;
  description: string | null;
  pageCount: number | null;
  categories: string[] | null;
  language: string | null;
  thumbnailUrl: string | null;
  googleBooksId: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get("isbn");

  if (!isbn) {
    return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
  }

  // Clean the ISBN (remove hyphens and spaces)
  const cleanIsbn = isbn.replace(/[-\s]/g, "");

  // Validate ISBN format (10 or 13 digits)
  if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
    return NextResponse.json(
      { error: "Invalid ISBN format. Must be 10 or 13 digits." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Books API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No book found for this ISBN" },
        { status: 404 }
      );
    }

    const book = data.items[0];
    const volumeInfo = book.volumeInfo;

    // Extract year from publishedDate (can be "2020", "2020-05", or "2020-05-15")
    let year: number | null = null;
    if (volumeInfo.publishedDate) {
      const yearMatch = volumeInfo.publishedDate.match(/^(\d{4})/);
      if (yearMatch) {
        year = Number.parseInt(yearMatch[1], 10);
      }
    }

    // Get higher resolution thumbnail if available
    let thumbnailUrl = volumeInfo.imageLinks?.thumbnail || null;
    if (thumbnailUrl) {
      // Request larger image size
      thumbnailUrl = thumbnailUrl.replace("zoom=1", "zoom=2");
      // Use HTTPS
      thumbnailUrl = thumbnailUrl.replace("http://", "https://");
    }

    const bookData: BookData = {
      title: volumeInfo.title || null,
      authors: volumeInfo.authors?.join(", ") || null,
      publisher: volumeInfo.publisher || null,
      year,
      description: volumeInfo.description || null,
      pageCount: volumeInfo.pageCount || null,
      categories: volumeInfo.categories || null,
      language: volumeInfo.language || null,
      thumbnailUrl,
      googleBooksId: book.id,
    };

    return NextResponse.json(bookData);
  } catch (error) {
    console.error("Error fetching from Google Books:", error);
    return NextResponse.json(
      { error: "Failed to fetch book data" },
      { status: 500 }
    );
  }
}
