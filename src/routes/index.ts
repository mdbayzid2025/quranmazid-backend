import express from 'express';
import { SurahRoutes } from '../modules/surah.route';


const router = express.Router();

const apiRoutes = [
  {
    path: '/surahs',
    route: SurahRoutes,
  },

];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;

