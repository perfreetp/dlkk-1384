import { Router, type Request, type Response } from 'express';
import { users, onboardingTasks } from '../data/mockData.js';

const router = Router();

router.get('/profile', (req: Request, res: Response) => {
  res.json({ success: true, data: users[0] });
});

router.put('/profile', (req: Request, res: Response) => {
  const body = req.body;
  users[0] = { ...users[0], ...body };
  res.json({ success: true, data: users[0] });
});

router.get('/onboarding', (req: Request, res: Response) => {
  const completed = onboardingTasks.filter(t => t.isCompleted).length;
  const total = onboardingTasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    success: true,
    data: {
      tasks: onboardingTasks,
      progress,
      completed,
      total,
    },
  });
});

router.post('/onboarding/:taskId/complete', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = onboardingTasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ success: false, error: '任务不存在' });
  }
  task.isCompleted = true;
  task.completedAt = new Date().toISOString();

  const completed = onboardingTasks.filter(t => t.isCompleted).length;
  const total = onboardingTasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    success: true,
    data: { task, progress, completed, total },
  });
});

router.get('/subscriptions', (req: Request, res: Response) => {
  res.json({ success: true, data: users[0].subscriptions });
});

router.put('/subscriptions', (req: Request, res: Response) => {
  const body = req.body;
  users[0].subscriptions = { ...users[0].subscriptions, ...body };
  res.json({ success: true, data: users[0].subscriptions });
});

export default router;
