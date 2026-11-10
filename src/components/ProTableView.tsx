import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Badge,
  Space,
  Modal,
  Drawer,
  Form,
  InputNumber,
  Progress,
  Tooltip,
  Dropdown,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  PlusOutlined,
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  DownloadOutlined,
  SearchOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { pinyin } from 'pinyin-pro';
import { RuleItem } from '../types';
import { INITIAL_RULES } from '../data/mockData';

interface ProTableViewProps {
  initialSearch?: string;
}

export const ProTableView: React.FC<ProTableViewProps> = ({ initialSearch = '' }) => {
  const [data, setData] = useState<RuleItem[]>(INITIAL_RULES);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Search filter states
  const [nameFilter, setNameFilter] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

  // Table display density
  const [tableSize, setTableSize] = useState<'small' | 'middle' | 'large'>('middle');

  // Modals / Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RuleItem | null>(null);
  const [detailItem, setDetailItem] = useState<RuleItem | null>(null);
  const [form] = Form.useForm();

  // Search logic supporting Chinese characters AND Pinyin initials / full pinyin!
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName =
        !nameFilter.trim() ||
        item.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        (item.pinyin && item.pinyin.toLowerCase().includes(nameFilter.toLowerCase())) ||
        pinyin(item.name, { toneType: 'none', type: 'string' })
          .replace(/\s+/g, '')
          .includes(nameFilter.toLowerCase()) ||
        item.id.toLowerCase().includes(nameFilter.toLowerCase());

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchOwner = ownerFilter === 'all' || item.owner === ownerFilter;

      return matchName && matchStatus && matchOwner;
    });
  }, [data, nameFilter, statusFilter, ownerFilter]);

  // Real Excel Export using xlsx (SheetJS)
  const handleExportExcel = () => {
    try {
      const exportRows = filteredData.map((item) => ({
        规则编号: item.id,
        规则名称: item.name,
        规则描述: item.desc,
        服务调用次数: item.callNo,
        运行状态:
          item.status === 'online'
            ? '已上线'
            : item.status === 'running'
            ? '运行中'
            : item.status === 'error'
            ? '异常阻断'
            : '已关闭',
        负责人: item.owner,
        履约进度: `${item.progress}%`,
        更新时间: item.updatedAt,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '业务规则审计明细');

      // Trigger download
      XLSX.writeFile(
        workbook,
        `Ant_Design_Pro_规则清单_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      message.success('已成功生成并导出 Excel 报表！');
    } catch (err) {
      message.error('导出 Excel 失败，请检查数据格式');
    }
  };

  // Batch actions
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条业务规则吗？`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
        setSelectedRowKeys([]);
        message.success('已成功批量删除');
      },
    });
  };

  const handleBatchOnline = () => {
    setData((prev) =>
      prev.map((item) =>
        selectedRowKeys.includes(item.id) ? { ...item, status: 'online' } : item
      )
    );
    setSelectedRowKeys([]);
    message.success('已批量置为上线生效状态');
  };

  // Reload action
  const handleReload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('规则列表已刷新');
    }, 400);
  };

  // Save or edit item
  const handleSaveModal = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  ...values,
                  pinyin: pinyin(values.name, { toneType: 'none', type: 'string' }).replace(
                    /\s+/g,
                    ''
                  ),
                  updatedAt: new Date().toLocaleString(),
                }
              : item
          )
        );
        message.success('已更新规则');
      } else {
        const newItem: RuleItem = {
          id: `RULE-${Math.floor(1000 + Math.random() * 9000)}`,
          name: values.name,
          pinyin: pinyin(values.name, { toneType: 'none', type: 'string' }).replace(/\s+/g, ''),
          desc: values.desc || '由运营人员新建自定义风控策略',
          callNo: values.callNo || 0,
          status: values.status || 'running',
          owner: values.owner || 'Serati Ma',
          progress: values.progress || 80,
          updatedAt: new Date().toLocaleString(),
        };
        setData((prev) => [newItem, ...prev]);
        message.success('已成功新建业务规则！');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
    } catch {
      // validation error
    }
  };

  const getStatusBadge = (status: RuleItem['status']) => {
    switch (status) {
      case 'online':
        return <Badge status="success" text="已上线" />;
      case 'running':
        return <Badge status="processing" text="运行中" />;
      case 'error':
        return <Badge status="error" text="异常告警" />;
      default:
        return <Badge status="default" text="已关闭" />;
    }
  };

  const columns: ColumnsType<RuleItem> = [
    {
      title: '规则编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <span className="font-mono text-xs font-semibold">{text}</span>,
    },
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <a
            onClick={() => setDetailItem(record)}
            className="font-semibold text-blue-600 hover:underline cursor-pointer text-xs"
          >
            {text}
          </a>
          <div className="text-[11px] text-gray-400 truncate max-w-xs">{record.desc}</div>
        </div>
      ),
    },
    {
      title: '服务调用数',
      dataIndex: 'callNo',
      key: 'callNo',
      align: 'right',
      sorter: (a, b) => a.callNo - b.callNo,
      render: (val: number) => (
        <span className="font-mono tabular-nums font-semibold text-xs">
          {val.toLocaleString()} 次
        </span>
      ),
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => getStatusBadge(status),
    },
    {
      title: '履约进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 140,
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          status={progress >= 90 ? 'success' : progress < 30 ? 'exception' : 'active'}
        />
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
      render: (owner) => <Tag color="geekblue">{owner}</Tag>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      render: (text) => <span className="text-gray-400 font-mono text-xs">{text}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setDetailItem(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            配置
          </Button>
          <Popconfirm
            title="删除确认"
            description="确定要彻底删除该业务规则吗？"
            okText="删除"
            cancelText="取消"
            okType="danger"
            onConfirm={() => {
              setData((prev) => prev.filter((item) => item.id !== record.id));
              message.success('已删除规则');
            }}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection: TableProps<RuleItem>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div className="space-y-4">
      {/* Search Filter Card */}
      <Card variant="borderless" className="shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">规则名称 / 拼音检索</div>
            <Input
              placeholder="输入汉字或全拼/简拼 (如: jk)"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              allowClear
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">使用状态</div>
            <Select
              className="w-full"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: '全部状态', value: 'all' },
                { label: '已上线', value: 'online' },
                { label: '运行中', value: 'running' },
                { label: '已关闭', value: 'default' },
                { label: '异常告警', value: 'error' },
              ]}
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">负责人</div>
            <Select
              className="w-full"
              value={ownerFilter}
              onChange={setOwnerFilter}
              options={[
                { label: '全部负责人', value: 'all' },
                { label: '曲丽丽', value: '曲丽丽' },
                { label: '付小小', value: '付小小' },
                { label: '林东东', value: '林东东' },
                { label: '周星星', value: '周星星' },
              ]}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => message.info(`筛选结果共 ${filteredData.length} 条记录`)}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                setNameFilter('');
                setStatusFilter('all');
                setOwnerFilter('all');
              }}
            >
              重置
            </Button>
          </div>
        </div>
      </Card>

      {/* ProTable Core Card */}
      <Card variant="borderless" className="shadow-sm">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingItem(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              新建规则
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
              导出 Excel
            </Button>

            {selectedRowKeys.length > 0 && (
              <Space className="ml-2">
                <span className="text-xs text-gray-500">
                  已选择 <b className="text-blue-600">{selectedRowKeys.length}</b> 项
                </span>
                <Button size="small" onClick={handleBatchOnline}>
                  批量上线
                </Button>
                <Button size="small" danger onClick={handleBatchDelete}>
                  批量删除
                </Button>
              </Space>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="刷新列表">
              <Button type="text" icon={<ReloadOutlined />} onClick={handleReload} />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  { key: 'large', label: '宽松', onClick: () => setTableSize('large') },
                  { key: 'middle', label: '默认', onClick: () => setTableSize('middle') },
                  { key: 'small', label: '紧凑', onClick: () => setTableSize('small') },
                ],
              }}
            >
              <Button type="text" icon={<ColumnHeightOutlined />} title="表格密度" />
            </Dropdown>
            <Tooltip title="当前显示 10 个字段">
              <Button type="text" icon={<SettingOutlined />} />
            </Tooltip>
          </div>
        </div>

        {/* Ant Design Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
          loading={loading}
          size={tableSize}
          pagination={{
            pageSize: 6,
            showTotal: (total) => `共 ${total} 条数据记录`,
            showQuickJumper: true,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal: Create or Edit Rule */}
      <Modal
        title={editingItem ? '编辑业务规则' : '新建业务配置规则'}
        open={isModalOpen}
        onOk={handleSaveModal}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        okText="保存规则"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'running', progress: 80 }}>
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="例如: 跨境大额支付拦截策略" />
          </Form.Item>

          <Form.Item
            name="desc"
            label="规则描述"
            rules={[{ required: true, message: '请输入规则场景描述' }]}
          >
            <Input.TextArea rows={3} placeholder="详细阐述风控触发逻辑与阻断级别..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="owner" label="责任人" initialValue="Serati Ma">
              <Select
                options={[
                  { label: 'Serati Ma', value: 'Serati Ma' },
                  { label: '曲丽丽', value: '曲丽丽' },
                  { label: '付小小', value: '付小小' },
                  { label: '林东东', value: '林东东' },
                  { label: '周星星', value: '周星星' },
                ]}
              />
            </Form.Item>

            <Form.Item name="status" label="初始状态">
              <Select
                options={[
                  { label: '运行中', value: 'running' },
                  { label: '已上线', value: 'online' },
                  { label: '已关闭', value: 'default' },
                  { label: '异常告警', value: 'error' },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="callNo" label="初始调用数" initialValue={5000}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="progress" label="基线履约进度 (%)" initialValue={85}>
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Drawer: Rule Details */}
      <Drawer
        title="业务规则详情"
        placement="right"
        width={480}
        onClose={() => setDetailItem(null)}
        open={!!detailItem}
      >
        {detailItem && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg">
              <div className="text-gray-400">规则编号</div>
              <div className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">
                {detailItem.id}
              </div>
              <div className="font-semibold text-base text-blue-600 mt-2">
                {detailItem.name}
              </div>
              <div className="text-gray-500 mt-1">{detailItem.desc}</div>
            </div>

            <Divider className="my-2" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">当前状态: </span>
                <span className="ml-1">{getStatusBadge(detailItem.status)}</span>
              </div>
              <div>
                <span className="text-gray-400">负责人: </span>
                <span className="font-semibold ml-1">{detailItem.owner}</span>
              </div>
              <div>
                <span className="text-gray-400">累计调用次数: </span>
                <span className="font-mono tabular-nums font-semibold ml-1">
                  {detailItem.callNo.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">最后更新: </span>
                <span className="font-mono ml-1">{detailItem.updatedAt}</span>
              </div>
            </div>

            <div>
              <div className="text-gray-400 mb-1">健康度履约进度</div>
              <Progress percent={detailItem.progress} status="active" />
            </div>

            <Divider className="my-2" />

            <div>
              <div className="font-bold text-gray-700 dark:text-gray-200 mb-2">
                最近调用诊断日志
              </div>
              <div className="p-2.5 bg-black text-green-400 font-mono text-[11px] rounded space-y-1">
                <div>[INFO] 2026-11-09 14:22:18 - 触发规则匹配引擎 (耗时 12ms)</div>
                <div>[INFO] 2026-11-09 14:22:19 - IP画像与风险指纹评分 0.02 (安全通过)</div>
                <div>[SUCCESS] 2026-11-09 14:22:20 - 交易放行并在分布式存储落盘</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
