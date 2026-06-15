import { Router, type Request, type Response } from 'express';
import { guides } from '../data/mockData.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { toolId, category } = req.query;
  let filtered = [...guides];

  if (toolId) {
    filtered = filtered.filter(g => g.toolId === toolId);
  }

  if (category) {
    filtered = filtered.filter(g => g.category === category);
  }

  filtered.sort((a, b) => a.order - b.order);

  res.json({ success: true, data: filtered });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const guide = guides.find(g => g.id === id);
  if (!guide) {
    return res.status(404).json({ success: false, error: '指南不存在' });
  }
  res.json({ success: true, data: guide });
});

export default router;
