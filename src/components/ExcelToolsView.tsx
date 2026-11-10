import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Tag,
  Space,
  Upload,
  Alert,
  Tabs,
  Row,
  Col,
  message,
} from 'antd';
import {
  FileExcelOutlined,
  DownloadOutlined,
  UploadOutlined,
  PlusOutlined,
  FontSizeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { pinyin } from 'pinyin-pro';

interface SheetRow {
  key: string;
  dept: string;
  quarter: string;
  revenue: number;
  cost: number;
  profit: number;
  roi: string;
  status: string;
}

const INITIAL_SHEET_DATA: SheetRow[] = [
  {
    key: '1',
    dept: '金融科技中台研发部',
    quarter: '2026 Q1',
    revenue: 12500000,
    cost: 4200000,
    profit: 8300000,
    roi: '197.6%',
    status: '已决算',
  },
  {
    key: '2',
    dept: '数字化供应链业务线',
    quarter: '2026 Q1',
    revenue: 9800000,
    cost: 3900000,
    profit: 5900000,
    roi: '151.2%',
    status: '已决算',
  },
  {
    key: '3',
    dept: '跨境支付合规与风控中心',
    quarter: '2026 Q1',
    revenue: 14200000,
    cost: 5100000,
    profit: 9100000,
    roi: '178.4%',
    status: '核算中',
  },
  {
    key: '4',
    dept: '多模态 AI 与智能客服组',
    quarter: '2026 Q1',
    revenue: 8400000,
    cost: 4600000,
    profit: 3800000,
    roi: '82.6%',
    status: '已决算',
  },
  {
    key: '5',
    dept: '云基础设施高可用保障组',
    quarter: '2026 Q1',
    revenue: 6900000,
    cost: 2900000,
    profit: 4000000,
    roi: '137.9%',
    status: '已决算',
  },
];

export const ExcelToolsView: React.FC = () => {
  const [sheetData, setSheetData] = useState<SheetRow[]>(INITIAL_SHEET_DATA);
  const [chineseText, setChineseText] = useState(
    '重阳节银行行长重申重庆重点重大工程采购计划'
  );

  // Export current table into real .xlsx file
  const handleExport = () => {
    try {
      const exportJson = sheetData.map((item) => ({
        部门名称: item.dept,
        决算季度: item.quarter,
        营业收入: item.revenue,
        研发支出: item.cost,
        净利润: item.profit,
        投入产出比: item.roi,
        审计状态: item.status,
      }));

      const ws = XLSX.utils.json_to_sheet(exportJson);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '部门财务决算报表');

      XLSX.writeFile(wb, `AntDesignPro_财务决算_${new Date().toISOString().slice(0, 10)}.xlsx`);
      message.success('已成功生成并下载 .xlsx 电子表格！');
    } catch {
      message.error('导出 Excel 发生错误');
    }
  };

  // Import from an actual user-selected .xlsx file
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet);

        if (rawJson && rawJson.length > 0) {
          const parsed: SheetRow[] = rawJson.map((row, idx) => ({
            key: `imported-${idx}`,
            dept: row['部门名称'] || row['部门'] || row['name'] || `导入部门 ${idx + 1}`,
            quarter: row['决算季度'] || row['季度'] || '2026 Q1',
            revenue: Number(row['营业收入'] || row['收入'] || 5000000),
            cost: Number(row['研发支出'] || row['支出'] || 2000000),
            profit: Number(row['净利润'] || row['利润'] || 3000000),
            roi: row['投入产出比'] || '150%',
            status: row['审计状态'] || '已导入',
          }));
          setSheetData(parsed);
          message.success(`成功导入 ${parsed.length} 条表格数据！`);
        } else {
          message.warning('上传的工作表中未解析到有效数据行');
        }
      } catch {
        message.error('解析 Excel 文件失败，请确认为有效 .xlsx 格式');
      }
    };
    reader.readAsBinaryString(file);
    return false; // prevent default upload
  };

  const handleAddRow = () => {
    const newRow: SheetRow = {
      key: `custom-${Date.now()}`,
      dept: '创新孵化实验室',
      quarter: '2026 Q2',
      revenue: 7500000,
      cost: 3200000,
      profit: 4300000,
      roi: '134.3%',
      status: '预算编制中',
    };
    setSheetData((prev) => [...prev, newRow]);
    message.success('已添加新财务核算行');
  };

  const columns = [
    {
      title: '业务部门',
      dataIndex: 'dept',
      key: 'dept',
      render: (text: string) => <span className="font-semibold text-xs">{text}</span>,
    },
    {
      title: '季度周期',
      dataIndex: 'quarter',
      key: 'quarter',
      width: 100,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '营业收入 (元)',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (val: number) => (
        <span className="font-mono tabular-nums text-xs">¥ {val.toLocaleString()}</span>
      ),
    },
    {
      title: '成本支出 (元)',
      dataIndex: 'cost',
      key: 'cost',
      align: 'right' as const,
      render: (val: number) => (
        <span className="font-mono tabular-nums text-xs text-gray-500">
          ¥ {val.toLocaleString()}
        </span>
      ),
    },
    {
      title: '净利润 (元)',
      dataIndex: 'profit',
      key: 'profit',
      align: 'right' as const,
      render: (val: number) => (
        <span className="font-mono tabular-nums text-xs font-bold text-emerald-600">
          ¥ {val.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'ROI 产出比',
      dataIndex: 'roi',
      key: 'roi',
      width: 110,
      render: (text: string) => (
        <span className="font-mono tabular-nums font-semibold text-blue-600 text-xs">
          {text}
        </span>
      ),
    },
    {
      title: '核算状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => (
        <Tag color={text === '已决算' ? 'success' : 'processing'}>{text}</Tag>
      ),
    },
  ];

  // Pinyin conversions
  const pinyinWithTone = pinyin(chineseText);
  const pinyinToneFree = pinyin(chineseText, { toneType: 'none' });
  const pinyinInitials = pinyin(chineseText, { pattern: 'first', toneType: 'none' }).replace(
    /\s+/g,
    ''
  );

  return (
    <div className="space-y-4">
      {/* Intro Card */}
      <Card variant="borderless" className="shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 m-0">
          数据报表与拼音搜索中台工具 (xlsx & pinyin-pro)
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-0">
          演示 package.json 中的核心扩展库应用：纯前端真实 Excel 报表读写、多音字汉语拼音音标转换及拼音智能检索。
        </p>
      </Card>

      <Tabs
        type="card"
        items={[
          {
            key: 'xlsx',
            label: (
              <span>
                <FileExcelOutlined /> Excel 报表导入导出 (xlsx)
              </span>
            ),
            children: (
              <Card variant="borderless" className="shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
                      导出当前数据为 .xlsx
                    </Button>
                    <Upload
                      beforeUpload={handleImport}
                      showUploadList={false}
                      accept=".xlsx, .xls"
                    >
                      <Button icon={<UploadOutlined />}>导入外部 Excel 文件</Button>
                    </Upload>
                    <Button icon={<PlusOutlined />} onClick={handleAddRow}>
                      添加模拟行
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400">
                    当前展示: <b>{sheetData.length}</b> 个业务核算单元
                  </div>
                </div>

                <Table
                  dataSource={sheetData}
                  columns={columns}
                  pagination={false}
                  size="middle"
                  scroll={{ x: 800 }}
                />
              </Card>
            ),
          },
          {
            key: 'pinyin',
            label: (
              <span>
                <FontSizeOutlined /> 拼音分词与检索增强 (pinyin-pro)
              </span>
            ),
            children: (
              <Card variant="borderless" className="shadow-sm space-y-4">
                <Alert
                  message="pinyin-pro 是 Ant Design Pro 生态中常用的拼音转换与模糊搜索利器，准确处理多音字（如：银行/行走，重庆/重要）。"
                  type="info"
                  showIcon
                />

                <div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    输入中文文本（可测试多音字与特殊词汇）：
                  </div>
                  <Input.TextArea
                    rows={2}
                    value={chineseText}
                    onChange={(e) => setChineseText(e.target.value)}
                  />
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-neutral-800">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        声调全拼 (With Tone):
                      </div>
                      <div className="font-mono text-sm text-blue-600 dark:text-blue-400 break-words">
                        {pinyinWithTone}
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-neutral-800">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        无声调拼音 (Tone Free):
                      </div>
                      <div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 break-words">
                        {pinyinToneFree}
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <div className="p-3 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-100 dark:border-neutral-800">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        首字母简拼 (Initials):
                      </div>
                      <div className="font-mono text-sm text-amber-600 dark:text-amber-400 break-words">
                        {pinyinInitials}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};
