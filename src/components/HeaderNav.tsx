import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  Input,
  Modal,
  Popover,
  Tabs,
  Tag,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import { MenuKey, NoticeItem } from '../types';
import { MOCK_NOTICES } from '../data/mockData';

interface HeaderNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeMenu: MenuKey;
  onSelectMenu: (key: MenuKey) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onSearchGlobal: (query: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  collapsed,
  onToggleCollapse,
  activeMenu,
  onSelectMenu,
  isDark,
  onToggleDark,
  onSearchGlobal,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notices, setNotices] = useState<NoticeItem[]>(MOCK_NOTICES);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getMenuBreadcrumbs = () => {
    switch (activeMenu) {
      case 'workplace':
        return [{ title: '首页' }, { title: '仪表盘' }, { title: '工作台' }];
      case 'materialTree':
        return [{ title: '首页' }, { title: '业务管理' }, { title: '物料分类树 (ERP)' }];
      case 'analysis':
        return [{ title: '首页' }, { title: '仪表盘' }, { title: '监控分析' }];
      case 'proTable':
        return [{ title: '首页' }, { title: '通用管理' }, { title: '高级查询表格' }];
      case 'stepsForm':
        return [{ title: '首页' }, { title: '表单页面' }, { title: '分步配置表单' }];
      case 'workflow':
        return [{ title: '首页' }, { title: '流程编排' }, { title: 'BPMN 审批设计器' }];
      case 'excelTools':
        return [{ title: '首页' }, { title: '数据工具' }, { title: '报表与拼音工具' }];
      default:
        return [{ title: '首页' }, { title: '工作台' }];
    }
  };

  const unreadCount = notices.filter((n) => !n.read).length;

  const markAllAsRead = (type: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.type === type ? { ...n, read: true } : n))
    );
    message.success('已全部标记为已读');
  };

  const clearNotices = (type: string) => {
    setNotices((prev) => prev.filter((n) => n.type !== type));
    message.info('已清空列表');
  };

  const noticeContent = (
    <div style={{ width: 340 }}>
      <Tabs
        centered
        defaultActiveKey="notification"
        items={[
          {
            key: 'notification',
            label: `通知 (${notices.filter((n) => n.type === 'notification' && !n.read).length})`,
            children: (
              <div>
                <div className="divide-y divide-gray-100 dark:divide-neutral-800 max-h-72 overflow-y-auto">
                  {notices
                    .filter((n) => n.type === 'notification')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 px-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ opacity: item.read ? 0.5 : 1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div style={{ fontSize: 13, fontWeight: item.read ? 400 : 600 }}>
                            {item.title}
                          </div>
                          {item.status === 'urgent' && (
                            <Tag color="error" style={{ marginLeft: 6, fontSize: 11 }}>
                              紧急
                            </Tag>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 2 }}>
                          {item.datetime}
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px 4px',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Button type="link" size="small" onClick={() => markAllAsRead('notification')}>
                    清空已读
                  </Button>
                  <Button type="link" size="small" onClick={() => clearNotices('notification')}>
                    清空通知
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: 'message',
            label: `消息 (${notices.filter((n) => n.type === 'message' && !n.read).length})`,
            children: (
              <div>
                <div className="divide-y divide-gray-100 dark:divide-neutral-800 max-h-72 overflow-y-auto">
                  {notices
                    .filter((n) => n.type === 'message')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 px-3 flex gap-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ opacity: item.read ? 0.5 : 1 }}
                      >
                        <Avatar src={item.avatar} size="small" className="shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div style={{ fontSize: 13, fontWeight: item.read ? 400 : 600 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                            {item.description}
                          </div>
                          <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 2 }}>
                            {item.datetime}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px 4px',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Button type="link" size="small" onClick={() => markAllAsRead('message')}>
                    标记已读
                  </Button>
                  <Button type="link" size="small" onClick={() => clearNotices('message')}>
                    清空消息
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: 'todo',
            label: `待办 (${notices.filter((n) => n.type === 'todo' && !n.read).length})`,
            children: (
              <div>
                <div className="divide-y divide-gray-100 dark:divide-neutral-800 max-h-72 overflow-y-auto">
                  {notices
                    .filter((n) => n.type === 'todo')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 px-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ opacity: item.read ? 0.5 : 1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div style={{ fontSize: 13, fontWeight: item.read ? 400 : 600 }}>
                            {item.title}
                          </div>
                          <Tag color="processing" style={{ marginLeft: 6, fontSize: 11 }}>
                            进行中
                          </Tag>
                        </div>
                        <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 2 }}>
                          {item.datetime}
                        </div>
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px 4px',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Button type="link" size="small" onClick={() => markAllAsRead('todo')}>
                    完成待办
                  </Button>
                  <Button type="link" size="small" onClick={() => clearNotices('todo')}>
                    清空待办
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => {
        onSelectMenu('workplace');
        message.info('进入个人工作台');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => {
        message.success('当前系统参数运行正常，配置处于最优状态');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: '退出登录',
      onClick: () => {
        Modal.confirm({
          title: '退出登录确认',
          content: '确定要退出 Ant Design Pro 企业级管理控制台吗？',
          okText: '确认退出',
          cancelText: '取消',
          onOk: () => {
            message.success('已安全退出控制台');
          },
        });
      },
    },
  ];

  return (
    <header
      className={`h-14 px-4 flex items-center justify-between border-b transition-colors select-none ${
        isDark ? 'bg-[#141414] border-[#303030]' : 'bg-white border-[#f0f0f0]'
      }`}
      style={{ position: 'sticky', top: 0, zIndex: 100 }}
    >
      {/* Left zone: Collapse trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="text-base"
        />
        <Breadcrumb items={getMenuBreadcrumbs()} />
      </div>

      {/* Right zone: Global Search & Control Icons & User */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search input with pinyin capability */}
        <Input
          placeholder="全局搜索规则 / 拼音 (如: pz)"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            onSearchGlobal(e.target.value);
          }}
          onPressEnter={() => {
            onSearchGlobal(searchVal);
            onSelectMenu('proTable');
          }}
          className="w-48 md:w-64"
          size="middle"
          allowClear
        />

        {/* Question / Help */}
        <Button
          type="text"
          icon={<QuestionCircleOutlined />}
          onClick={() => {
            Modal.info({
              title: 'Ant Design Pro 6.0 架构说明',
              content: (
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• 本系统基于 Ant Design 5 + ProComponents 完整生态构建。</p>
                  <p>• 集成 ECharts 动态双轴图表与品类漏斗分析。</p>
                  <p>• 集成 xlsx 纯前端 Excel 真实读写导出引擎。</p>
                  <p>• 集成 pinyin-pro 拼音多音字精准分词匹配。</p>
                  <p>• 集成 @dnd-kit 流程编排引擎，支持拖拽重组与仿真执行。</p>
                </div>
              ),
              okText: '了解',
            });
          }}
        />

        {/* Notifications Popover */}
        <Popover
          content={noticeContent}
          trigger="click"
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Badge count={unreadCount} size="small" offset={[-2, 4]}>
            <Button type="text" icon={<BellOutlined className="text-base" />} />
          </Badge>
        </Popover>

        {/* Fullscreen Toggle */}
        <Button
          type="text"
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullscreen}
        />

        {/* Theme Switcher */}
        <Button
          type="text"
          icon={isDark ? <SunOutlined className="text-amber-400" /> : <MoonOutlined />}
          onClick={onToggleDark}
          title={isDark ? '切换浅色模式' : '切换深色模式'}
        />

        {/* User Profile */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <Avatar
              size="small"
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            />
            <span className="text-sm font-medium hidden sm:inline">Serati Ma</span>
            <Tag color="blue" className="hidden lg:inline-flex text-[11px] m-0">
              超级管理员
            </Tag>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
