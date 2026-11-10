import React, { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Badge,
  Modal,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Timeline,
  Alert,
  Tooltip,
  message,
} from 'antd';
import {
  PlayCircleOutlined,
  PlusOutlined,
  DragOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BranchesOutlined,
  SendOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WorkflowNode } from '../types';
import { INITIAL_WORKFLOW_NODES } from '../data/mockData';

// Sortable Item Component
const SortableNodeItem: React.FC<{
  node: WorkflowNode;
  index: number;
  isSimulating: boolean;
  activeSimStep: number;
  onEdit: (node: WorkflowNode) => void;
  onDelete: (id: string) => void;
}> = ({ node, index, isSimulating, activeSimStep, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: node.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentActive = isSimulating && activeSimStep === index;
  const isSimCompleted = isSimulating && activeSimStep > index;

  const getNodeIcon = () => {
    switch (node.type) {
      case 'start':
        return <UserOutlined className="text-blue-500" />;
      case 'approver':
        return <SafetyCertificateOutlined className="text-emerald-500" />;
      case 'condition':
        return <BranchesOutlined className="text-amber-500" />;
      case 'notify':
        return <SendOutlined className="text-purple-500" />;
      case 'end':
        return <CheckCircleOutlined className="text-gray-500" />;
    }
  };

  const getNodeTypeTag = () => {
    switch (node.type) {
      case 'start':
        return <Tag color="blue">发起节点</Tag>;
      case 'approver':
        return <Tag color="green">审批人节点</Tag>;
      case 'condition':
        return <Tag color="gold">条件分支网关</Tag>;
      case 'notify':
        return <Tag color="purple">抄送节点</Tag>;
      case 'end':
        return <Tag>归档生效</Tag>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 rounded-xl border transition-all mb-3 bg-white dark:bg-neutral-900 ${
        isCurrentActive
          ? 'ring-2 ring-blue-500 border-blue-400 shadow-lg scale-[1.01]'
          : isSimCompleted
          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20'
          : 'border-gray-200 dark:border-neutral-800 hover:border-blue-300 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
            title="拖拽调整节点执行顺序"
          >
            <DragOutlined />
          </div>

          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gray-100 dark:bg-neutral-800 rounded-lg">
              {getNodeIcon()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
                  {index + 1}. {node.title}
                </span>
                {getNodeTypeTag()}
                {isCurrentActive && (
                  <Tag color="processing" className="animate-pulse">
                    仿真执行中...
                  </Tag>
                )}
                {isSimCompleted && (
                  <Tag color="success">
                    <CheckCircleOutlined /> 仿真校验通过
                  </Tag>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{node.desc}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {node.assignee}
            </div>
            <div className="text-[11px] text-gray-400">SLA 时效: 24h</div>
          </div>

          <Space size="small">
            <Button size="small" onClick={() => onEdit(node)}>
              配置
            </Button>
            {node.type !== 'start' && node.type !== 'end' && (
              <Button size="small" danger onClick={() => onDelete(node.id)}>
                <DeleteOutlined />
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export const WorkflowDesigner: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_WORKFLOW_NODES);
  const [editingNode, setEditingNode] = useState<WorkflowNode | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimStep, setActiveSimStep] = useState(-1);
  const [form] = Form.useForm();

  // Dnd-kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setNodes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      message.success('已动态更新流程执行链顺序');
    }
  };

  // Run Simulation
  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimStep(0);
    message.loading({ content: '流程引擎已启动，正在仿真流转...', key: 'sim' });

    let current = 0;
    const timer = setInterval(() => {
      current++;
      if (current < nodes.length) {
        setActiveSimStep(current);
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setIsSimulating(false);
          setActiveSimStep(-1);
          message.success({ content: '🎉 全链路 BPMN 流程仿真验证成功！通过所有网关判定', key: 'sim' });
        }, 600);
      }
    }, 1200);
  };

  const handleSaveNodeConfig = async () => {
    try {
      const values = await form.validateFields();
      if (editingNode) {
        setNodes((prev) =>
          prev.map((item) =>
            item.id === editingNode.id ? { ...item, ...values } : item
          )
        );
        message.success('已更新节点配置');
      }
      setEditingNode(null);
    } catch {
      // validation error
    }
  };

  const handleAddNode = () => {
    const newNode: WorkflowNode = {
      id: `node-custom-${Date.now()}`,
      title: '合规与风险审核组',
      type: 'approver',
      assignee: '法务风控组',
      status: 'pending',
      desc: '核查海外数据出境及反洗钱尽职调查要求',
    };
    // Insert before end node
    setNodes((prev) => {
      const endIdx = prev.findIndex((n) => n.type === 'end');
      if (endIdx > 0) {
        const copy = [...prev];
        copy.splice(endIdx, 0, newNode);
        return copy;
      }
      return [...prev, newNode];
    });
    message.success('已新增审批协同节点');
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <Card variant="borderless" className="shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0">
              BPMN 2.0 业务审批流程编排器 (基于 @dnd-kit 拖拽引擎)
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-0">
              支持可视化拖拽调序、动态分支网关条件设定、多级会签与全链路流程自动化仿真。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button icon={<PlusOutlined />} onClick={handleAddNode}>
              添加节点
            </Button>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartSimulation}
              loading={isSimulating}
            >
              {isSimulating ? '仿真推演中...' : '运行流程仿真'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Orchestration Canvas */}
      <Card variant="borderless" className="shadow-sm">
        <div className="mb-4">
          <Alert
            message="交互提示: 拖拽左侧抓手图标可实时调整审批节点的先后依赖逻辑；点击“运行流程仿真”可体验节点动态流转与判定。"
            type="info"
            showIcon
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
            <div>
              {nodes.map((node, index) => (
                <SortableNodeItem
                  key={node.id}
                  node={node}
                  index={index}
                  isSimulating={isSimulating}
                  activeSimStep={activeSimStep}
                  onEdit={(item) => {
                    setEditingNode(item);
                    form.setFieldsValue(item);
                  }}
                  onDelete={(id) => {
                    setNodes((prev) => prev.filter((item) => item.id !== id));
                    message.info('已移除节点');
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Card>

      {/* Node Config Drawer */}
      <Drawer
        title="配置流程节点属性"
        placement="right"
        width={420}
        onClose={() => setEditingNode(null)}
        open={!!editingNode}
        extra={
          <Button type="primary" onClick={handleSaveNodeConfig}>
            保存
          </Button>
        }
      >
        {editingNode && (
          <Form form={form} layout="vertical" initialValues={editingNode}>
            <Form.Item name="title" label="节点名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="type" label="节点类型">
              <Select
                options={[
                  { label: '发起节点 (Start)', value: 'start' },
                  { label: '人工审批节点 (Approver)', value: 'approver' },
                  { label: '条件分支网关 (Condition)', value: 'condition' },
                  { label: '抄送通知节点 (Notify)', value: 'notify' },
                  { label: '归档生效 (End)', value: 'end' },
                ]}
              />
            </Form.Item>

            <Form.Item name="assignee" label="审批人 / 负责系统">
              <Input placeholder="输入处理人员或规则引擎名称" />
            </Form.Item>

            <Form.Item name="desc" label="业务执行逻辑 / 准入条件">
              <Input.TextArea rows={3} />
            </Form.Item>

            <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded text-xs space-y-1.5 text-gray-500">
              <div className="font-semibold text-gray-700 dark:text-gray-300">
                高级 SLA 与超时策略
              </div>
              <div>• 超时自动流转: 超过 48 小时自动转派给第二顺位负责人</div>
              <div>• 会签通过方式: 100% 全员同意即生效</div>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
};
