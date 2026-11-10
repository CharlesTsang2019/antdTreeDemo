import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Segmented,
  Table,
  Tag,
  Radio,
  Progress,
} from 'antd';
import {
  CaretUpOutlined,
  CaretDownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;

interface AnalysisViewProps {
  isDark: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ isDark }) => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [salesType, setSalesType] = useState<string>('all');

  const salesChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const radarChartRef = useRef<HTMLDivElement>(null);

  // Sales Trends ECharts instance
  useEffect(() => {
    if (!salesChartRef.current) return;
    const chart = echarts.init(salesChartRef.current, isDark ? 'dark' : undefined);

    const months = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月',
    ];

    const salesData = [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1200, 1550, 1680, 1890];
    const visitData = [420, 532, 601, 734, 890, 1030, 920, 1150, 980, 1250, 1400, 1620];

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['销售额 (万元)', '访问量 (千次)'],
        top: 0,
        textStyle: { color: isDark ? '#ddd' : '#333' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: isDark ? '#444' : '#ccc' } },
        axisLabel: { color: isDark ? '#aaa' : '#666' },
      },
      yAxis: [
        {
          type: 'value',
          name: '销售额',
          axisLabel: { formatter: '{value} 万' },
          splitLine: { lineStyle: { color: isDark ? '#262626' : '#f0f0f0' } },
        },
        {
          type: 'value',
          name: '访问量',
          axisLabel: { formatter: '{value} k' },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '销售额 (万元)',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1677ff' },
              { offset: 1, color: '#69b1ff' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          data: salesData,
        },
        {
          name: '访问量 (千次)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { width: 3, color: '#52c41a' },
          itemStyle: { color: '#52c41a' },
          data: visitData,
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [isDark, timeRange]);

  // Donut/Pie Category Chart
  useEffect(() => {
    if (!pieChartRef.current) return;
    const chart = echarts.init(pieChartRef.current, isDark ? 'dark' : undefined);

    const categoryData =
      salesType === 'online'
        ? [
            { value: 4540, name: '家用电器' },
            { value: 3350, name: '食用酒水' },
            { value: 3100, name: '个护健康' },
            { value: 2340, name: '服饰箱包' },
            { value: 1548, name: '母婴数码' },
          ]
        : salesType === 'stores'
        ? [
            { value: 2800, name: '食用酒水' },
            { value: 2400, name: '个护健康' },
            { value: 2100, name: '家用电器' },
            { value: 1800, name: '服饰箱包' },
            { value: 1100, name: '母婴数码' },
          ]
        : [
            { value: 7340, name: '家用电器' },
            { value: 6150, name: '食用酒水' },
            { value: 5500, name: '个护健康' },
            { value: 4140, name: '服饰箱包' },
            { value: 2648, name: '母婴数码' },
          ];

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: ¥{c} 万元 ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: { color: isDark ? '#ddd' : '#333' },
      },
      series: [
        {
          name: '销售品类',
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: isDark ? '#141414' : '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
          },
          labelLine: { show: false },
          data: categoryData,
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [isDark, salesType]);

  // Radar SLA Chart
  useEffect(() => {
    if (!radarChartRef.current) return;
    const chart = echarts.init(radarChartRef.current, isDark ? 'dark' : undefined);

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {},
      legend: {
        data: ['当前系统基线', '等保标准要求'],
        bottom: 0,
        textStyle: { color: isDark ? '#ddd' : '#333' },
      },
      radar: {
        indicator: [
          { name: '响应时延 (<30ms)', max: 100 },
          { name: '防御拦截', max: 100 },
          { name: '高并发承载', max: 100 },
          { name: '跨可用区容灾', max: 100 },
          { name: '自动化覆盖率', max: 100 },
          { name: '成本能效比', max: 100 },
        ],
        splitArea: {
          areaStyle: {
            color: isDark
              ? ['#1f1f1f', '#262626', '#2d2d2d', '#333333']
              : ['#fbfbfb', '#f5f5f5', '#ececec', '#e4e4e4'],
          },
        },
      },
      series: [
        {
          name: 'SLA 能力雷达',
          type: 'radar',
          data: [
            {
              value: [96, 92, 98, 95, 90, 88],
              name: '当前系统基线',
              itemStyle: { color: '#1677ff' },
              areaStyle: { opacity: 0.35, color: '#1677ff' },
            },
            {
              value: [80, 85, 80, 85, 75, 70],
              name: '等保标准要求',
              itemStyle: { color: '#ff4d4f' },
              areaStyle: { opacity: 0.15, color: '#ff4d4f' },
            },
          ],
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [isDark]);

  // Search hot keywords data
  const searchKeywordsData = [
    { key: '1', rank: 1, keyword: 'Ant Design 5.0', count: 124500, users: 38900, range: '+24.5%' },
    { key: '2', rank: 2, keyword: 'ProTable 高级表格', count: 98400, users: 29100, range: '+18.2%' },
    { key: '3', rank: 3, keyword: 'BPMN 审批工作流', count: 75200, users: 21800, range: '+15.0%' },
    { key: '4', rank: 4, keyword: '微前端 qiankun 实践', count: 62100, users: 19400, range: '-3.2%' },
    { key: '5', rank: 5, keyword: 'Excel 批量导入导出', count: 54300, users: 16200, range: '+9.8%' },
  ];

  const searchColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      render: (val: number) => (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
            val <= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      title: '搜索关键词',
      dataIndex: 'keyword',
      key: 'keyword',
      render: (text: string) => <span className="font-medium text-xs">{text}</span>,
    },
    {
      title: '周搜索量',
      dataIndex: 'count',
      key: 'count',
      render: (val: number) => (
        <span className="font-mono tabular-nums text-xs">{val.toLocaleString()}</span>
      ),
    },
    {
      title: '独立访客数',
      dataIndex: 'users',
      key: 'users',
      render: (val: number) => (
        <span className="font-mono tabular-nums text-xs">{val.toLocaleString()}</span>
      ),
    },
    {
      title: '周同比',
      dataIndex: 'range',
      key: 'range',
      render: (val: string) => {
        const isUp = val.startsWith('+');
        return (
          <span
            className={`font-semibold text-xs flex items-center gap-0.5 ${
              isUp ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {val} {isUp ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </span>
        );
      },
    },
  ];

  const rankings = [
    { rank: 1, name: '杭州西湖直营1号店', amount: '¥ 323,234' },
    { rank: 2, name: '上海陆家嘴金融广场店', amount: '¥ 298,900' },
    { rank: 3, name: '北京国贸三期旗舰店', amount: '¥ 284,520' },
    { rank: 4, name: '深圳南山科技园店', amount: '¥ 231,100' },
    { rank: 5, name: '广州天河城生活馆', amount: '¥ 198,340' },
    { rank: 6, name: '成都太古里体验中心', amount: '¥ 175,210' },
    { rank: 7, name: '南京新街口中心店', amount: '¥ 152,090' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Sales & Visits Dual Chart with Time Filter */}
      <Card
        variant="borderless"
        className="shadow-sm"
        title={<span className="font-bold text-sm">全网销售额与访问量综合分析</span>}
        extra={
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              options={[
                { label: '今日', value: 'today' },
                { label: '本周', value: 'week' },
                { label: '本月', value: 'month' },
                { label: '全年', value: 'year' },
              ]}
              value={timeRange}
              onChange={(val) => setTimeRange(val as string)}
            />
            <RangePicker className="hidden sm:inline-flex" style={{ width: 240 }} />
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="text-xs text-gray-500 mb-2 font-medium">销售与访问量动态趋势</div>
            <div ref={salesChartRef} style={{ width: '100%', height: 320 }} />
          </Col>
          <Col xs={24} lg={8}>
            <div className="text-xs text-gray-500 mb-3 font-medium">门店销售额排行榜</div>
            <div className="space-y-3">
              {rankings.map((item) => (
                <div key={item.rank} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
                        item.rank <= 3
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-gray-800 dark:text-gray-100">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Secondary Row: Category Donut & Hot Search & SLA Radar */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            variant="borderless"
            className="shadow-sm"
            title={<span className="font-bold text-sm">销售品类占比</span>}
            extra={
              <Radio.Group
                value={salesType}
                onChange={(e) => setSalesType(e.target.value)}
                size="small"
              >
                <Radio.Button value="all">全渠道</Radio.Button>
                <Radio.Button value="online">线上</Radio.Button>
                <Radio.Button value="stores">门店</Radio.Button>
              </Radio.Group>
            }
          >
            <div ref={pieChartRef} style={{ width: '100%', height: 280 }} />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            variant="borderless"
            className="shadow-sm"
            title={<span className="font-bold text-sm">核心 SLA 架构能力雷达</span>}
          >
            <div ref={radarChartRef} style={{ width: '100%', height: 280 }} />
          </Card>
        </Col>
      </Row>

      {/* Online Search Keywords Table */}
      <Card
        variant="borderless"
        className="shadow-sm"
        title={<span className="font-bold text-sm">线上热门搜索关键词指数</span>}
      >
        <Table
          dataSource={searchKeywordsData}
          columns={searchColumns}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};
