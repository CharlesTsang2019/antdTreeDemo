import React from 'react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Statistic,
  Progress,
  Tag,
  Button,
  Space,
} from 'antd';
import {
  CaretUpOutlined,
  CaretDownOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CheckCircleTwoTone,
  PlusOutlined,
} from '@ant-design/icons';
import { MenuKey } from '../types';
import { MOCK_PROJECTS, MOCK_ACTIVITIES } from '../data/mockData';

interface DashboardViewProps {
  onNavigate: (key: MenuKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-4">
      {/* Page Header Banner */}
      <Card
        variant="borderless"
        className="shadow-sm"
        styles={{ body: { padding: '20px 24px' } }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
              className="border-2 border-blue-500 shadow-sm"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 m-0">
                早安，Serati Ma，祝你开心每一天！
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">
                全栈架构技术专家 · 蚂蚁中台体验中心 · 核心研发架构一组
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <div className="text-center sm:text-right">
              <div className="text-xs text-gray-400">进行中项目</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                56
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xs text-gray-400">团队内排名</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                8 <span className="text-xs text-gray-400 font-normal">/ 24</span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xs text-gray-400">项目周访问</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                2,223
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Top 4 Key Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow transition-shadow">
            <Statistic
              title={<span className="text-gray-500 text-xs">总销售额 (本月)</span>}
              value={126560}
              precision={2}
              prefix="¥"
              styles={{ content: { fontWeight: 700, fontSize: 26, fontFamily: 'monospace' } }}
            />
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-1">
                周同比 12% <CaretUpOutlined className="text-red-500" />
              </span>
              <span className="flex items-center gap-1">
                日环比 4% <CaretDownOutlined className="text-green-500" />
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1 flex justify-between">
              <span>日均销售额</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                ¥ 12,423
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow transition-shadow">
            <Statistic
              title={<span className="text-gray-500 text-xs">访问量 (PV)</span>}
              value={8846}
              styles={{ content: { fontWeight: 700, fontSize: 26, fontFamily: 'monospace' } }}
            />
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1 h-4">
                {[45, 60, 30, 75, 50, 80, 95, 65, 85, 90, 70, 85].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-400 dark:bg-blue-600 rounded-xs hover:bg-blue-600 transition-colors"
                    style={{ height: `${val}%` }}
                    title={`时间片 ${idx + 1}: ${val * 10} PV`}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>今日峰值流量</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                1,234 /h
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow transition-shadow">
            <Statistic
              title={<span className="text-gray-500 text-xs">支付笔数 (实时)</span>}
              value={6560}
              styles={{ content: { fontWeight: 700, fontSize: 26, fontFamily: 'monospace' } }}
            />
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 h-4">
                {[60, 40, 80, 35, 70, 90, 50, 75, 85, 45].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-emerald-400 dark:bg-emerald-600 rounded-xs hover:bg-emerald-600 transition-colors"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>支付转化率</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                68.4%
              </span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm hover:shadow transition-shadow">
            <Statistic
              title={<span className="text-gray-500 text-xs">运营活动达成率</span>}
              value={78.5}
              suffix="%"
              styles={{ content: { fontWeight: 700, fontSize: 26, fontFamily: 'monospace' } }}
            />
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Progress
                percent={78.5}
                showInfo={false}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={['100%', 6]}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2 flex justify-between">
              <span>周目标差距</span>
              <span className="font-medium text-amber-600 tabular-nums">
                剩余 21.5%
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content: Projects & Activity on Left, Shortcuts & Team on Right */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16} className="space-y-4">
          {/* Ongoing Projects */}
          <Card
            title={<span className="font-bold text-sm">进行中的项目</span>}
            extra={
              <Button type="link" size="small" onClick={() => onNavigate('proTable')}>
                全部项目 <ArrowRightOutlined />
              </Button>
            }
            variant="borderless"
            className="shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 border rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800"
                  onClick={() => onNavigate('proTable')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar src={project.logo} shape="square" size={32} />
                    <div className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">
                      {project.title}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 h-8 mb-3">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50 dark:border-neutral-800">
                    <span>{project.group}</span>
                    <span>{project.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Dynamic Activity Stream */}
          <Card
            title={<span className="font-bold text-sm">最新动态与审批追踪</span>}
            variant="borderless"
            className="shadow-sm"
          >
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {MOCK_ACTIVITIES.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-start">
                  <Avatar src={item.avatar} className="shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.user}
                      </span>{' '}
                      <span className="text-gray-500">{item.action}</span>{' '}
                      <a className="text-blue-600 font-medium hover:underline">
                        {item.target}
                      </a>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <div>{item.detail}</div>
                      <div className="text-gray-400 text-[11px] mt-1">{item.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Side Column */}
        <Col xs={24} lg={8} className="space-y-4">
          {/* Quick Access / Shortcuts */}
          <Card
            title={<span className="font-bold text-sm">便捷导航</span>}
            variant="borderless"
            className="shadow-sm"
          >
            <div className="grid grid-cols-2 gap-2">
              <Button
                block
                className="text-left flex items-center justify-start text-xs h-9 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 font-semibold"
                onClick={() => onNavigate('materialTree')}
              >
                🌲 物料分类树 (ERP)
              </Button>
              <Button
                block
                className="text-left flex items-center justify-start text-xs h-9"
                onClick={() => onNavigate('proTable')}
              >
                📋 查询表格
              </Button>
              <Button
                block
                className="text-left flex items-center justify-start text-xs h-9"
                onClick={() => onNavigate('analysis')}
              >
                📈 监控大屏
              </Button>
              <Button
                block
                className="text-left flex items-center justify-start text-xs h-9"
                onClick={() => onNavigate('stepsForm')}
              >
                📑 分步表单
              </Button>
              <Button
                block
                className="text-left flex items-center justify-start text-xs h-9"
                onClick={() => onNavigate('workflow')}
              >
                🔄 流程编排
              </Button>
              <Button
                block
                className="text-left flex items-center justify-start text-xs h-9 col-span-2"
                onClick={() => onNavigate('excelTools')}
              >
                📦 Excel 报表与拼音搜索工具
              </Button>
            </div>
          </Card>

          {/* System Performance & SLA Indicator */}
          <Card
            title={<span className="font-bold text-sm">中台健康度指数</span>}
            variant="borderless"
            className="shadow-sm"
          >
            <div className="flex items-center justify-around py-2">
              <Progress
                type="dashboard"
                percent={99.8}
                format={(percent) => (
                  <div className="text-center">
                    <div className="text-lg font-bold tabular-nums">{percent}%</div>
                    <div className="text-[10px] text-gray-400">可用性 SLA</div>
                  </div>
                )}
                strokeColor="#52c41a"
                size={110}
              />
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400">平均接口时延: </span>
                  <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                    28ms
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">今日告警收敛: </span>
                  <span className="font-semibold text-green-600">0 级故障</span>
                </div>
                <div>
                  <span className="text-gray-400">自动弹性实例: </span>
                  <span className="font-mono font-semibold">12 Pods</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Members */}
          <Card
            title={<span className="font-bold text-sm">项目协作组成员</span>}
            extra={
              <Button type="link" size="small" icon={<PlusOutlined />}>
                添加
              </Button>
            }
            variant="borderless"
            className="shadow-sm"
          >
            <div className="space-y-3">
              {[
                {
                  name: '曲丽丽',
                  role: '核心架构师',
                  tag: '在线',
                  color: 'success',
                  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
                },
                {
                  name: '付小小',
                  role: '安全风控负责人',
                  tag: '忙碌',
                  color: 'warning',
                  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                },
                {
                  name: '林东东',
                  role: '前端工程专家',
                  tag: '在线',
                  color: 'success',
                  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
                },
                {
                  name: '周星星',
                  role: '算法引擎科学家',
                  tag: '离线',
                  color: 'default',
                  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKflOYGeTxnuhapGxi.png',
                },
              ].map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={m.avatar} size="small" />
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {m.name}
                      </div>
                      <div className="text-gray-400 text-[11px]">{m.role}</div>
                    </div>
                  </div>
                  <Tag color={m.color} className="m-0 text-[10px]">
                    {m.tag}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
