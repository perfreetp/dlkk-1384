import { Router, type Request, type Response } from 'express';
import { feedbacks } from '../data/mockData.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status, type } = req.query;
  let filtered = [...feedbacks];

  if (status) {
    filtered = filtered.filter(f => f.status === status);
  }

  if (type) {
    filtered = filtered.filter(f => f.type === type);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, data: filtered });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const newFeedback = {
    id: `fb-${Date.now()}`,
    type: body.type || 'other',
    toolId: body.toolId,
    toolName: body.toolName,
    title: body.title,
    description: body.description,
    submitter: body.submitter || '当前用户',
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
  };
  feedbacks.unshift(newFeedback);
  res.status(201).json({ success: true, data: newFeedback });
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = feedbacks.findIndex(f => f.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: '反馈不存在' });
  }
  feedbacks[index] = {
    ...feedbacks[index],
    ...req.body,
  };
  res.json({ success: true, data: feedbacks[index] });
});

export default router;
