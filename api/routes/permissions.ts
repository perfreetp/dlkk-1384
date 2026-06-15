import { Router, type Request, type Response } from 'express';
import { permissionRequests } from '../data/mockData.js';
import type { PermissionRequest } from '../../shared/types.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status, sort = 'recent' } = req.query;
  let filtered = [...permissionRequests];

  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }

  if (sort === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ success: true, data: filtered });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const newRequest: PermissionRequest = {
    id: `pr-${Date.now()}`,
    toolId: body.toolId,
    toolName: body.toolName,
    reason: body.reason,
    urgency: body.urgency || 'medium',
    status: 'pending',
    applicant: body.applicant || '当前用户',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  permissionRequests.unshift(newRequest);
  res.status(201).json({ success: true, data: newRequest });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const request = permissionRequests.find(p => p.id === id);
  if (!request) {
    return res.status(404).json({ success: false, error: '申请不存在' });
  }
  res.json({ success: true, data: request });
});

router.put('/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const { approveNote, approver } = req.body;
  const request = permissionRequests.find(p => p.id === id);
  if (!request) {
    return res.status(404).json({ success: false, error: '申请不存在' });
  }
  request.status = 'approved';
  request.approver = approver || '管理员';
  request.approveNote = approveNote;
  request.updatedAt = new Date().toISOString();
  res.json({ success: true, data: request });
});

router.put('/:id/reject', (req: Request, res: Response) => {
  const { id } = req.params;
  const { approveNote, approver } = req.body;
  const request = permissionRequests.find(p => p.id === id);
  if (!request) {
    return res.status(404).json({ success: false, error: '申请不存在' });
  }
  request.status = 'rejected';
  request.approver = approver || '管理员';
  request.approveNote = approveNote;
  request.updatedAt = new Date().toISOString();
  res.json({ success: true, data: request });
});

export default router;
