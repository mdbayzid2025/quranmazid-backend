
export interface Verse {
    number: number;
    text: string;
    translation: string;
}


export interface Chapter {
    number: number;
    name: string;
    transliteration: string;
    translation: string;
    total_verses: number;
    revelation_type: "Meccan" | "Medinan";
    verses: Verse[];
}


export type ChapterListItem = Omit<Chapter, "verses">;


export interface SearchResult {
    surahNumber: number;
    surahName: string;
    surahNameArabic: string;
    verseNumber: number;
    text: string;
    translation_en: string;
}


export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: { message: string }[];
}
