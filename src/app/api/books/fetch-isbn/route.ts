import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute in ms
const YEAR_REGEX = /^(\d{4})/;
const ISBN_REGEX = /^(\d{10}|\d{13})$/;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }
  record.count++;
  return false;
}

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

function parseBookData(book: GoogleBooksItem): BookData {
  const volumeInfo = book.volumeInfo;

  const yearMatch = volumeInfo.publishedDate?.match(YEAR_REGEX);
  const year = yearMatch ? Number.parseInt(yearMatch[1], 10) : null;

  let thumbnailUrl = volumeInfo.imageLinks?.thumbnail ?? null;
  if (thumbnailUrl) {
    thumbnailUrl = thumbnailUrl
      .replace("zoom=1", "zoom=2")
      .replace("http://", "https://");
  }

  return {
    title: volumeInfo.title ?? null,
    authors: volumeInfo.authors?.join(", ") ?? null,
    publisher: volumeInfo.publisher ?? null,
    year,
    description: volumeInfo.description ?? null,
    pageCount: volumeInfo.pageCount ?? null,
    categories: volumeInfo.categories ?? null,
    language: volumeInfo.language ?? null,
    thumbnailUrl,
    googleBooksId: book.id,
  };
}

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get("isbn");

  if (!isbn) {
    return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
  }

  // Clean the ISBN (remove hyphens and spaces)
  const cleanIsbn = isbn.replace(/[-\s]/g, "");

  // Validate ISBN format (10 or 13 digits)
  if (!ISBN_REGEX.test(cleanIsbn)) {
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

    return NextResponse.json(parseBookData(data.items[0]));
  } catch (error) {
    console.error("Error fetching from Google Books:", error);
    return NextResponse.json(
      { error: "Failed to fetch book data" },
      { status: 500 }
    );
  }
}
