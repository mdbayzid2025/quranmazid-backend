import express from 'express';
import { SurahController } from './surah.controllers';

const router = express.Router();

router.get('/all-chapters', SurahController.getAllChapters);
router.get('/search', SurahController.searchFromChapter);
router.get('/:id', SurahController.getSingleChapter);
export const SurahRoutes = router;
