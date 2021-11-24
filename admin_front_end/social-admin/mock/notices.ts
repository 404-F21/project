import { Request, Response } from 'express';

const getNotices = (req: Request, res: Response) => {
  res.json({
    data: [

    ],
  });
};

export default {
  'GET /api/notices': getNotices,
};
