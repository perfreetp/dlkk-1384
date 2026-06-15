import { Router, type Request, type Response } from 'express';
import { changeLogs } from '../data/mockData.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { type, page = 1, pageSize = 20 } = req.query;
  let filtered = [...changeLogs];

  if (type) {
    filtered = filtered.filter(c => c.type === type);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const paginated = filtered.slice(start, start + Number(pageSize));

  res.json({
    success: true,
    data: paginated,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const newLog = {
    id: `cl-${Date.now()}`,
    type: body.type || 'update',
    title: body.title,
    description: body.description,
    toolId: body.toolId,
    toolName: body.toolName,
    version: body.version || 'v1.0.0',
    createdAt: new Date().toISOString(),
  };
  changeLogs.unshift(newLog);
  res.status(201).json({ success: true, data: newLog });
});

export default router;
