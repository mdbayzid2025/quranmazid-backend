import { Request, Response } from "express";
import catchAsync from "../share/catchAsync";
import sendResponse from "../share/sendResponse";
import httpStatus from 'http-status';
import path from "path";
import fs from "fs";

import { ChapterListItem, Verse } from "../types/quran.types";
import { getAudioUrl } from "../utils/quranAyahMap";
const DATA_DIR = path.join(process.cwd(), "src", "data");

const getFullChapters = async (id: number) => {

    const filePath = path.join(DATA_DIR, "chapters", `${id}.json`);

    const fileData = await fs.promises.readFile(filePath, "utf-8");

    return JSON.parse(fileData);
};


const getAllChapters = catchAsync(async (req: Request, res: Response) => {
    const filePath = path.join(DATA_DIR, 'chapters-list.json');
    const readFile = await fs.readFileSync(filePath, 'utf-8');
    const parsedData: ChapterListItem[] = JSON.parse(readFile);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chapter created successfully',
        data: parsedData,
    });
});

const attachAudioToVerses = (
    surahId: number,
    verses: Verse[]
): (Verse & { audio: string })[] => {
    return verses.map((verse: any) => ({
        ...verse,
        audio: getAudioUrl(surahId, verse.id), // ✅ No API call, instant!
    }));
};

const getSingleChapter = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const chapterData = await getFullChapters(Number(id));

    // ✅ Sync, fast, no external dependency
    const versesWithAudio = attachAudioToVerses(Number(id), chapterData.verses);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chapter fetched successfully",
        data: {
            ...chapterData,
            verses: versesWithAudio,
        },
    });
});

const searchFromChapter = catchAsync(async (req: Request, res: Response) => {
    const query = req?.query?.q?.toString().toLowerCase() || "";

    if (!query || query.length < 2) {
        return res.status(400).json({ success: false, message: "Search query must be at least 2 characters" });
    }

    const results = [];

    for (let i = 1; i <= 114; i++) {
        const chapterData = await getFullChapters(i);

        const matchedVerses = chapterData.verses.filter((verse: Verse) =>
            verse?.translation?.toLowerCase()?.includes(query)
        );

        if (matchedVerses.length > 0) {
            results.push({
                surahEngName: chapterData?.transliteration,
                totalVerses: chapterData?.total_verses,
                SurahNameArabic: chapterData?.name,
                verses: attachAudioToVerses(i, matchedVerses), // ✅ i = surahId
            });
        }
    }

    return res.json(results);
});
export const SurahController = {
    getAllChapters,
    getSingleChapter,
    searchFromChapter
};
