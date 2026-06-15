import { Router, type Request, type Response } from 'express';
import { tools, categories } from '../data/mockData.js';
import type { Tool } from '../../shared/types.js';

const router = Router();

router.get('/categories', (req: Request, res: Response) => {
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: tools.filter(t => t.category === cat.id).length,
  }));
  res.json({ success: true, data: categoriesWithCount });
});

router.get('/popular', (req: Request, res: Response) => {
  const { limit = 10 } = req.query;
  const popular = [...tools]
    .sort((a, b) => b.accessCount - a.accessCount)
    .slice(0, Number(limit));
  res.json({ success: true, data: popular });
});

router.get('/favorites', (req: Request, res: Response) => {
  const favorites = tools.filter(t => t.isFavorite);
  res.json({ success: true, data: favorites });
});

router.post('/:id/toggle-favorite', (req: Request, res: Response) => {
  const { id } = req.params;
  const tool = tools.find(t => t.id === id);
  if (!tool) {
    return res.status(404).json({ success: false, error: '工具不存在' });
  }
  tool.isFavorite = !tool.isFavorite;
  res.json({ success: true, data: { isFavorite: tool.isFavorite } });
});

router.get('/compare', (req: Request, res: Response) => {
  const { ids } = req.query;
  if (!ids) {
    return res.status(400).json({ success: false, error: '请选择要对比的工具' });
  }
  const idList = String(ids).split(',');
  const compareTools = tools.filter(t => idList.includes(t.id));
  res.json({ success: true, data: compareTools });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const tool = tools.find(t => t.id === id);
  if (!tool) {
    return res.status(404).json({ success: false, error: '工具不存在' });
  }
  tool.accessCount += 1;
  res.json({ success: true, data: tool });
});

router.get('/', (req: Request, res: Response) => {
  const { 
    search = '', 
    category, 
    department, 
    position, 
    tag,
    page = 1, 
    pageSize = 20,
    sort = 'popular',
  } = req.query;

  let filtered = [...tools];

  if (search) {
    const searchLower = String(search).toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  if (department && department !== 'all') {
    filtered = filtered.filter(t => t.department === department || t.department === 'all');
  }

  if (position) {
    filtered = filtered.filter(t => t.positions.includes(String(position)));
  }

  if (tag) {
    filtered = filtered.filter(t => t.tags.includes(String(tag)));
  }

  if (sort === 'popular') {
    filtered.sort((a, b) => b.accessCount - a.accessCount);
  } else if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'recent') {
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

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
  const body = req.body as Partial<Tool>;
  const newTool: Tool = {
    id: `tool-${Date.now()}`,
    name: body.name || '新工具',
    description: body.description || '',
    url: body.url || '',
    icon: body.icon || 'Globe',
    category: body.category || 'other',
    department: body.department || 'all',
    positions: body.positions || [],
    owner: body.owner || '',
    ownerEmail: body.ownerEmail || '',
    notes: body.notes || '',
    accessCount: 0,
    isFavorite: false,
    requiresPermission: body.requiresPermission || false,
    hasPermission: body.hasPermission || true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: body.tags || [],
  };
  tools.push(newTool);
  res.status(201).json({ success: true, data: newTool });
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tools.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: '工具不存在' });
  }
  tools[index] = {
    ...tools[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, data: tools[index] });
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tools.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: '工具不存在' });
  }
  tools.splice(index, 1);
  res.json({ success: true, message: '删除成功' });
});

export default router;
