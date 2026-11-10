export type MenuKey =
  | 'workplace'
  | 'materialTree'
  | 'analysis'
  | 'proTable'
  | 'stepsForm'
  | 'workflow'
  | 'excelTools';

export interface MaterialCategoryNode {
  key: string;
  code: string;
  name: string;
  count: number;
  isSpecial?: boolean;
  children?: MaterialCategoryNode[];
}

export interface MaterialItem {
  id: string;
  code: string;
  name: string;
  categoryKey: string;
  categoryName: string;
  spec: string;
  unit: string;
  stock: number;
  safetyStock: number;
  price: number;
  status: 'active' | 'warning' | 'shortage';
  updatedAt: string;
}

export interface RuleItem {
  id: string;
  name: string;
  pinyin?: string;
  desc: string;
  callNo: number;
  status: 'default' | 'running' | 'online' | 'error';
  updatedAt: string;
  owner: string;
  progress: number;
}

export interface WorkflowNode {
  id: string;
  title: string;
  type: 'start' | 'approver' | 'condition' | 'notify' | 'end';
  assignee: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  desc: string;
  actionCount?: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  datetime: string;
  type: 'notification' | 'message' | 'todo';
  read: boolean;
  avatar?: string;
  status?: 'urgent' | 'normal' | 'processing';
}
