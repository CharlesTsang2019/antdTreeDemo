import React, { useState, useMemo } from 'react';
import {
  Card,
  Input,
  Button,
  Tree,
  Table,
  Tag,
  Modal,
  Form,
  Space,
  Badge,
  Tooltip,
  Popconfirm,
  Statistic,
  Row,
  Col,
  message,
} from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  HolderOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  InboxOutlined,
  DownloadOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { INITIAL_MATERIAL_TREE, MOCK_MATERIALS } from '../data/mockData';
import { MaterialCategoryNode, MaterialItem } from '../types';

export const MaterialCategoryView: React.FC = () => {
  const [treeData, setTreeData] = useState<MaterialCategoryNode[]>(INITIAL_MATERIAL_TREE);
  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([
    'cat-C',
    'cat-D',
    'cat-E',
    'cat-F',
  ]);
  const [searchVal, setSearchVal] = useState<string>('');
  const [materials, setMaterials] = useState<MaterialItem[]>(MOCK_MATERIALS);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'addRoot' | 'addChild' | 'addSibling' | 'edit'>(
    'addRoot'
  );
  const [targetNode, setTargetNode] = useState<MaterialCategoryNode | null>(null);
  const [form] = Form.useForm();

  // Material item modal
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [matForm] = Form.useForm();

  // Total count calculation
  const totalCount = useMemo(() => {
    const calc = (nodes: MaterialCategoryNode[]): number => {
      return nodes.reduce((sum, n) => {
        const childrenSum = n.children && n.children.length > 0 ? calc(n.children) : n.count;
        return sum + childrenSum;
      }, 0);
    };
    return calc(treeData);
  }, [treeData]);

  // Recursively find a node
  const findNode = (
    nodes: MaterialCategoryNode[],
    key: string
  ): MaterialCategoryNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // Recursively delete a node
  const deleteNode = (
    nodes: MaterialCategoryNode[],
    key: string
  ): MaterialCategoryNode[] => {
    return nodes
      .filter((n) => n.key !== key)
      .map((n) => ({
        ...n,
        children: n.children ? deleteNode(n.children, key) : [],
      }));
  };

  // Convert MaterialCategoryNode tree to Ant Design Tree DataNode
  const convertToTreeNodes = (
    nodes: MaterialCategoryNode[]
  ): DataNode[] => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isMatch =
        searchVal &&
        (node.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          node.code.toLowerCase().includes(searchVal.toLowerCase()));

      return {
        key: node.key,
        title: (
          <div
            className={`group flex items-center justify-between py-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all ${
              selectedKey === node.key
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-800 dark:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="cursor-grab text-gray-300 group-hover:text-gray-500 transition-colors">
                <HolderOutlined style={{ fontSize: 13 }} />
              </span>
              <span className="truncate text-xs">
                【{node.code}】{node.name}
              </span>
              <span className="text-[11px] text-gray-400 font-normal tabular-nums shrink-0">
                ({node.count})
              </span>
              {isMatch && (
                <Tag color="orange" className="text-[10px] m-0 py-0 px-1">
                  匹配
                </Tag>
              )}
            </div>

            {/* Hover Action Buttons matching user screenshot */}
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="添加子分类">
                <button
                  type="button"
                  className="p-1 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded transition-colors text-gray-400"
                  onClick={() => {
                    setTargetNode(node);
                    setModalMode('addChild');
                    form.resetFields();
                    form.setFieldsValue({
                      parentName: `【${node.code}】${node.name}`,
                      code: `${node.code}0${(node.children?.length || 0) + 1}`,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  <PlusOutlined style={{ fontSize: 11 }} />
                </button>
              </Tooltip>

              <Tooltip title="添加同级分类">
                <button
                  type="button"
                  className="p-1 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded transition-colors text-gray-400"
                  onClick={() => {
                    setTargetNode(node);
                    setModalMode('addSibling');
                    form.resetFields();
                    setIsModalOpen(true);
                  }}
                >
                  <SwapOutlined style={{ fontSize: 11 }} />
                </button>
              </Tooltip>

              <Tooltip title="编辑分类">
                <button
                  type="button"
                  className="p-1 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-700 rounded transition-colors text-gray-400"
                  onClick={() => {
                    setTargetNode(node);
                    setModalMode('edit');
                    form.setFieldsValue({
                      code: node.code,
                      name: node.name,
                      count: node.count,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  <EditOutlined style={{ fontSize: 11 }} />
                </button>
              </Tooltip>

              <Popconfirm
                title="删除分类确认"
                description={`确定要删除分类【${node.code}】${node.name}吗？`}
                okText="删除"
                cancelText="取消"
                okType="danger"
                onConfirm={() => {
                  setTreeData((prev) => deleteNode(prev, node.key));
                  message.success(`已删除分类【${node.code}】${node.name}`);
                  if (selectedKey === node.key) {
                    setSelectedKey('all');
                  }
                }}
              >
                <button
                  type="button"
                  className="p-1 hover:text-red-600 hover:bg-red-50 dark:hover:bg-neutral-700 rounded transition-colors text-red-400"
                >
                  <DeleteOutlined style={{ fontSize: 11 }} />
                </button>
              </Popconfirm>
            </div>
          </div>
        ),
        children: hasChildren ? convertToTreeNodes(node.children!) : undefined,
      };
    });
  };

  // Handle Drag & Drop inside Tree
  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data = JSON.parse(JSON.stringify(treeData)) as MaterialCategoryNode[];

    // Find and remove dragNode
    let dragObj: any = null;
    const loopRemove = (
      nodes: MaterialCategoryNode[],
      key: string,
      callback: (item: MaterialCategoryNode, index: number, arr: MaterialCategoryNode[]) => void
    ) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].key === key) {
          callback(nodes[i], i, nodes);
          return;
        }
        if (nodes[i].children) {
          loopRemove(nodes[i].children!, key, callback);
        }
      }
    };

    loopRemove(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!dragObj) return;
    const targetItem: MaterialCategoryNode = dragObj;

    if (!info.dropToGap) {
      // Drop inside target as child
      const loopInsertChild = (nodes: MaterialCategoryNode[], key: string) => {
        for (const node of nodes) {
          if (node.key === key) {
            node.children = node.children || [];
            node.children.push(targetItem);
            return;
          }
          if (node.children) {
            loopInsertChild(node.children, key);
          }
        }
      };
      loopInsertChild(data, dropKey);
      message.success(`已将【${targetItem.code} ${targetItem.name}】拖拽移动至目标分类子节点`);
    } else {
      // Drop before or after sibling
      let ar: MaterialCategoryNode[] = [];
      let i = 0;
      const loopInsertSibling = (nodes: MaterialCategoryNode[], key: string) => {
        for (let idx = 0; idx < nodes.length; idx++) {
          if (nodes[idx].key === key) {
            ar = nodes;
            i = idx;
            return;
          }
          if (nodes[idx].children) {
            loopInsertSibling(nodes[idx].children!, key);
          }
        }
      };
      loopInsertSibling(data, dropKey);

      if (dropPosition === -1) {
        ar.splice(i, 0, targetItem);
      } else {
        ar.splice(i + 1, 0, targetItem);
      }
      message.success(`已拖拽调整【${targetItem.code} ${targetItem.name}】的同级排序`);
    }

    setTreeData(data);
  };

  // Save Modal Action
  const handleSaveModal = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'addRoot') {
        const newRoot: MaterialCategoryNode = {
          key: `cat-${Date.now()}`,
          code: values.code.toUpperCase(),
          name: values.name,
          count: 0,
          children: [],
        };
        setTreeData((prev) => [...prev, newRoot]);
        message.success(`已新增根分类【${newRoot.code}】${newRoot.name}`);
      } else if (modalMode === 'addChild' && targetNode) {
        const newChild: MaterialCategoryNode = {
          key: `cat-${Date.now()}`,
          code: values.code.toUpperCase(),
          name: values.name,
          count: 0,
        };
        const insertChild = (nodes: MaterialCategoryNode[]): MaterialCategoryNode[] => {
          return nodes.map((n) => {
            if (n.key === targetNode.key) {
              return {
                ...n,
                children: [...(n.children || []), newChild],
              };
            }
            return {
              ...n,
              children: n.children ? insertChild(n.children) : [],
            };
          });
        };
        setTreeData((prev) => insertChild(prev));
        if (!expandedKeys.includes(targetNode.key)) {
          setExpandedKeys((prev) => [...prev, targetNode.key]);
        }
        message.success(`已在【${targetNode.name}】下新增子分类【${newChild.code}】${newChild.name}`);
      } else if (modalMode === 'addSibling' && targetNode) {
        const newSibling: MaterialCategoryNode = {
          key: `cat-${Date.now()}`,
          code: values.code.toUpperCase(),
          name: values.name,
          count: 0,
        };
        const insertSibling = (nodes: MaterialCategoryNode[]): MaterialCategoryNode[] => {
          const idx = nodes.findIndex((n) => n.key === targetNode.key);
          if (idx !== -1) {
            const next = [...nodes];
            next.splice(idx + 1, 0, newSibling);
            return next;
          }
          return nodes.map((n) => ({
            ...n,
            children: n.children ? insertSibling(n.children) : [],
          }));
        };
        setTreeData((prev) => insertSibling(prev));
        message.success(`已添加同级分类【${newSibling.code}】${newSibling.name}`);
      } else if (modalMode === 'edit' && targetNode) {
        const editNode = (nodes: MaterialCategoryNode[]): MaterialCategoryNode[] => {
          return nodes.map((n) => {
            if (n.key === targetNode.key) {
              return {
                ...n,
                code: values.code.toUpperCase(),
                name: values.name,
                count: Number(values.count ?? n.count),
              };
            }
            return {
              ...n,
              children: n.children ? editNode(n.children) : [],
            };
          });
        };
        setTreeData((prev) => editNode(prev));
        message.success(`已更新分类【${values.code}】${values.name}`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // validation error
    }
  };

  // Selected Category Information
  const currentCategory = useMemo(() => {
    if (selectedKey === 'all') {
      return { code: 'ALL', name: '全部物料', count: totalCount };
    }
    if (selectedKey === 'unclassified') {
      return { code: 'UN', name: '未归类', count: 0 };
    }
    const found = findNode(treeData, selectedKey);
    return found ? { code: found.code, name: found.name, count: found.count } : null;
  }, [selectedKey, treeData, totalCount]);

  // Filter materials based on category
  const filteredMaterials = useMemo(() => {
    if (selectedKey === 'all') return materials;
    if (selectedKey === 'unclassified') return [];
    return materials.filter(
      (m) => m.categoryKey === selectedKey || m.categoryKey.startsWith(selectedKey)
    );
  }, [materials, selectedKey]);

  // Real Excel Export
  const handleExportMaterials = () => {
    try {
      const rows = filteredMaterials.map((m) => ({
        物料编码: m.code,
        物料名称: m.name,
        所属分类: m.categoryName,
        规格型号: m.spec,
        单位: m.unit,
        当前库存: m.stock,
        安全库存: m.safetyStock,
        参考单价: m.price,
        库存状态: m.status === 'active' ? '正常' : m.status === 'warning' ? '库存预警' : '缺料',
        更新时间: m.updatedAt,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '物料分类清单');
      XLSX.writeFile(
        wb,
        `物料清单_${currentCategory?.name || '全部'}_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      message.success('已导出当前物料分类清单 Excel');
    } catch {
      message.error('导出失败');
    }
  };

  // Table columns for Material Items
  const materialColumns = [
    {
      title: '物料编码',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (text: string) => (
        <span className="font-mono text-xs font-semibold text-blue-600">{text}</span>
      ),
    },
    {
      title: '物料名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: MaterialItem) => (
        <div>
          <span className="font-medium text-xs text-gray-800 dark:text-gray-200">{text}</span>
          <div className="text-[11px] text-gray-400">{record.spec}</div>
        </div>
      ),
    },
    {
      title: '所属分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
      render: (text: string) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: '当前在库',
      dataIndex: 'stock',
      key: 'stock',
      align: 'right' as const,
      width: 110,
      sorter: (a: MaterialItem, b: MaterialItem) => a.stock - b.stock,
      render: (val: number, record: MaterialItem) => (
        <span
          className={`font-mono tabular-nums font-bold text-xs ${
            val <= record.safetyStock ? 'text-amber-600' : 'text-gray-800 dark:text-gray-200'
          }`}
        >
          {val.toLocaleString()} {record.unit}
        </span>
      ),
    },
    {
      title: '安全库存',
      dataIndex: 'safetyStock',
      key: 'safetyStock',
      align: 'right' as const,
      width: 100,
      render: (val: number, record: MaterialItem) => (
        <span className="font-mono tabular-nums text-xs text-gray-400">
          {val.toLocaleString()} {record.unit}
        </span>
      ),
    },
    {
      title: '参考单价',
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      width: 110,
      render: (val: number) => (
        <span className="font-mono tabular-nums text-xs">¥ {val.toFixed(2)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'warning'}
          text={status === 'active' ? '正常' : '预警'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => message.info('入库调拨记录已调出')}>
            调拨
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner Overview */}
      <Card variant="borderless" className="shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0 flex items-center gap-2">
              <FolderOpenOutlined className="text-blue-500" />
              企业级物料分类树与主数据管理 (ERP/MES)
            </h1>
            <p className="text-xs text-gray-500 mt-1 mb-0">
              精准复刻业务截图设计，支持多层级分类可视化拖拽重排与跨节点归集、快捷增删改及物料明细联动。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModalMode('addRoot');
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              新增根分类
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportMaterials}>
              导出清单
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Split Layout: Left is exact match to Screenshot, Right is Material Inventory */}
      <Row gutter={[16, 16]}>
        {/* LEFT COLUMN: Exactly matching user image */}
        <Col xs={24} md={10} lg={8}>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm p-3 select-none flex flex-col h-[740px]">
            {/* Header: 物料分类 + 新增根分类 */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
              <span className="font-bold text-base text-gray-800 dark:text-gray-100">
                物料分类
              </span>
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  setModalMode('addRoot');
                  form.resetFields();
                  setIsModalOpen(true);
                }}
              >
                <PlusOutlined style={{ fontSize: 11 }} /> 新增根分类
              </button>
            </div>

            {/* Search Input: 搜索分类名称/编码 */}
            <div className="py-2.5">
              <Input
                placeholder="搜索分类名称/编码"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                suffix={<SearchOutlined className="text-gray-400" />}
                className="rounded-md text-xs h-8"
                allowClear
              />
            </div>

            {/* Special Top Category: 全部物料 (6208) */}
            <div className="space-y-1 pb-1">
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedKey === 'all'
                    ? 'bg-[#e6f4ff] dark:bg-blue-950/70 text-[#1677ff] font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200'
                }`}
                onClick={() => setSelectedKey('all')}
              >
                <span className="text-gray-300">
                  <HolderOutlined style={{ fontSize: 13 }} />
                </span>
                <span className="text-xs">全部物料</span>
                <span className="text-xs text-gray-400 tabular-nums font-normal">
                  ({totalCount})
                </span>
              </div>

              {/* Special Top Category: 未归类 (0) */}
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedKey === 'unclassified'
                    ? 'bg-[#e6f4ff] dark:bg-blue-950/70 text-[#1677ff] font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200'
                }`}
                onClick={() => setSelectedKey('unclassified')}
              >
                <span className="text-gray-300">
                  <HolderOutlined style={{ fontSize: 13 }} />
                </span>
                <span className="text-xs">未归类</span>
                <span className="text-xs text-gray-400 tabular-nums font-normal">(0)</span>
              </div>
            </div>

            {/* Core Draggable Tree Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-1 pr-1">
              <Tree
                draggable={{ icon: false }}
                blockNode
                showLine={{ showLeafIcon: false }}
                expandedKeys={expandedKeys}
                onExpand={(keys) => setExpandedKeys(keys)}
                selectedKeys={[selectedKey]}
                onSelect={(keys) => {
                  if (keys.length > 0) {
                    setSelectedKey(keys[0] as string);
                  }
                }}
                onDrop={onDrop}
                treeData={convertToTreeNodes(treeData)}
                switcherIcon={({ expanded }) =>
                  expanded ? (
                    <CaretDownOutlined className="text-[10px] text-gray-600 dark:text-gray-400" />
                  ) : (
                    <CaretRightOutlined className="text-[10px] text-gray-600 dark:text-gray-400" />
                  )
                }
              />
            </div>

            {/* Tree Footer Drag & Drop Tip */}
            <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 text-[11px] text-gray-400 text-center">
              💡 提示：按住左侧 <b>⋮⋮</b> 抓手可上下拖拽调序或拖入节点中改变层级
            </div>
          </div>
        </Col>

        {/* RIGHT COLUMN: Material Details in Selected Category */}
        <Col xs={24} md={14} lg={16}>
          <div className="space-y-4">
            {/* Category KPI summary strip */}
            <Row gutter={[12, 12]}>
              <Col xs={12} sm={6}>
                <Card variant="borderless" className="shadow-sm">
                  <Statistic
                    title={<span className="text-xs text-gray-400">当前选中分类</span>}
                    value={currentCategory?.name || '全部物料'}
                    styles={{
                      content: { fontSize: 16, fontWeight: 700, color: '#1677ff' },
                    }}
                  />
                  <div className="text-[11px] text-gray-400 mt-1">
                    编码: 【{currentCategory?.code || 'ALL'}】
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card variant="borderless" className="shadow-sm">
                  <Statistic
                    title={<span className="text-xs text-gray-400">物料规格款数</span>}
                    value={filteredMaterials.length}
                    styles={{
                      content: { fontSize: 20, fontWeight: 700, fontFamily: 'monospace' },
                    }}
                    suffix="款"
                  />
                  <div className="text-[11px] text-gray-400 mt-1">
                    分类标定: {currentCategory?.count || 0}
                  </div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card variant="borderless" className="shadow-sm">
                  <Statistic
                    title={<span className="text-xs text-gray-400">当前在库总库存</span>}
                    value={filteredMaterials.reduce((acc, m) => acc + m.stock, 0)}
                    styles={{
                      content: { fontSize: 20, fontWeight: 700, fontFamily: 'monospace' },
                    }}
                  />
                  <div className="text-[11px] text-emerald-600 mt-1">盘点正常率 98.5%</div>
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card variant="borderless" className="shadow-sm">
                  <Statistic
                    title={<span className="text-xs text-gray-400">库存预警款数</span>}
                    value={filteredMaterials.filter((m) => m.status === 'warning').length}
                    styles={{
                      content: {
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: '#faad14',
                      },
                    }}
                    suffix="款"
                  />
                  <div className="text-[11px] text-amber-600 mt-1">需安排采购补货</div>
                </Card>
              </Col>
            </Row>

            {/* Materials ProTable Grid */}
            <Card variant="borderless" className="shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
                    物料主数据列表
                  </span>
                  <Tag color="blue">
                    {currentCategory ? `【${currentCategory.code}】${currentCategory.name}` : '全部'}
                  </Tag>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      matForm.resetFields();
                      matForm.setFieldsValue({
                        categoryName: currentCategory?.name || '金属板材',
                        unit: '件',
                        safetyStock: 50,
                      });
                      setIsMatModalOpen(true);
                    }}
                  >
                    添加物料
                  </Button>
                </div>
              </div>

              <Table
                rowKey="id"
                dataSource={filteredMaterials}
                columns={materialColumns}
                pagination={{ pageSize: 6, showTotal: (t) => `共 ${t} 款物料规格` }}
                size="small"
                scroll={{ x: 800 }}
              />
            </Card>
          </div>
        </Col>
      </Row>

      {/* Modal: Category Add / Edit */}
      <Modal
        title={
          modalMode === 'addRoot'
            ? '新增物料根分类'
            : modalMode === 'addChild'
            ? `在【${targetNode?.name}】下新增子分类`
            : modalMode === 'addSibling'
            ? `新增与【${targetNode?.name}】同级的分类`
            : `编辑物料分类属性`
        }
        open={isModalOpen}
        onOk={handleSaveModal}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText="保存分类"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {modalMode === 'addChild' && (
            <Form.Item name="parentName" label="所属上级分类">
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item
            name="code"
            label="分类编码"
            rules={[
              { required: true, message: '请输入分类编码，如 C05 或 G' },
              { max: 10, message: '编码长度不超过10位' },
            ]}
          >
            <Input placeholder="例如: C05 / D06 / G" />
          </Form.Item>

          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称，如: 特种复合材料' }]}
          >
            <Input placeholder="例如: 特种复合材料 / 密封胶件" />
          </Form.Item>

          {modalMode === 'edit' && (
            <Form.Item name="count" label="物料统计基数">
              <Input type="number" min={0} />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Modal: Add Material Item */}
      <Modal
        title="录入新物料主数据"
        open={isMatModalOpen}
        onOk={async () => {
          try {
            const vals = await matForm.validateFields();
            const newMat: MaterialItem = {
              id: `M-${Date.now()}`,
              code: vals.code,
              name: vals.name,
              categoryKey: selectedKey === 'all' ? 'cat-C01' : selectedKey,
              categoryName: currentCategory?.name || '【C01】金属板材',
              spec: vals.spec || '标准规格',
              unit: vals.unit || '件',
              stock: Number(vals.stock || 0),
              safetyStock: Number(vals.safetyStock || 20),
              price: Number(vals.price || 100),
              status: Number(vals.stock) <= Number(vals.safetyStock) ? 'warning' : 'active',
              updatedAt: new Date().toLocaleString().slice(0, 16),
            };
            setMaterials((prev) => [newMat, ...prev]);
            message.success(`已添加物料【${newMat.code}】${newMat.name}`);
            setIsMatModalOpen(false);
            matForm.resetFields();
          } catch {
            // validation
          }
        }}
        onCancel={() => setIsMatModalOpen(false)}
        okText="保存物料"
        cancelText="取消"
      >
        <Form form={matForm} layout="vertical" initialValues={{ stock: 100, safetyStock: 30, price: 280 }}>
          <Form.Item
            name="code"
            label="物料编码"
            rules={[{ required: true, message: '请输入物料编码' }]}
          >
            <Input placeholder="如: MAT-C01-0990" />
          </Form.Item>
          <Form.Item
            name="name"
            label="物料名称"
            rules={[{ required: true, message: '请输入物料名称' }]}
          >
            <Input placeholder="如: 304特种耐酸不锈钢板" />
          </Form.Item>
          <Form.Item name="spec" label="规格型号">
            <Input placeholder="如: 1.5mm × 1220mm × 2440mm" />
          </Form.Item>
          <div className="grid grid-cols-3 gap-3">
            <Form.Item name="unit" label="单位">
              <Input placeholder="张 / 件 / 盒" />
            </Form.Item>
            <Form.Item name="stock" label="入库库存">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="price" label="单价 (元)">
              <Input type="number" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
