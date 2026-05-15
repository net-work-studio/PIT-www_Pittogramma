import { NextResponse } from "next/server";
import {
  assertSanityProjectUser,
  OutboundFetchError,
  readJsonStringField,
} from "@/app/api/_utils/outbound-fetch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const YEAR_REGEX = /^(\d{4})/;
const ISBN_REGEX = /^(\d{10}|\d{13})$/;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

interface GoogleBooksVolumeInfo {
  authors?: string[];
  categories?: string[];
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  language?: string;
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
  title?: string;
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: GoogleBooksVolumeInfo;
}

interface GoogleBooksResponse {
  items?: GoogleBooksItem[];
  totalItems: number;
}

export interface BookData {
  authors: string | null;
  categories: string[] | null;
  description: string | null;
  googleBooksId: string | null;
  language: string | null;
  pageCount: number | null;
  publisher: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  year: number | null;
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

export async function POST(request: Request) {
  const authError = await assertSanityProjectUser(request);
  if (authError) {
    return authError;
  }

  let isbn: string;
  try {
    isbn = await readJsonStringField(request, "isbn", {
      maxLength: 32,
      message: "ISBN is required",
    });
  } catch (error) {
    if (error instanceof OutboundFetchError) {
      return NextResponse.json(
        { error: error.message },
        { headers: NO_STORE_HEADERS, status: error.status }
      );
    }
    return NextResponse.json(
      { error: "ISBN is required" },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  // Clean the ISBN (remove hyphens and spaces)
  const cleanIsbn = isbn.replace(/[-\s]/g, "");

  // Validate ISBN format (10 or 13 digits)
  if (!ISBN_REGEX.test(cleanIsbn)) {
    return NextResponse.json(
      { error: "Invalid ISBN format. Must be 10 or 13 digits." },
      { headers: NO_STORE_HEADERS, status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Books API key not configured" },
      { headers: NO_STORE_HEADERS, status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}&key=${apiKey}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; PittogrammaBot/1.0)",
        },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No book found for this ISBN" },
        { headers: NO_STORE_HEADERS, status: 404 }
      );
    }

    return NextResponse.json(parseBookData(data.items[0]), {
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Google Books request timed out" },
        { headers: NO_STORE_HEADERS, status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch book data" },
      { headers: NO_STORE_HEADERS, status: 502 }
    );
  }
}
