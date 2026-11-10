import React from 'react';
import {
  DashboardOutlined,
  LineChartOutlined,
  TableOutlined,
  FormOutlined,
  ApartmentOutlined,
  FileExcelOutlined,
  PartitionOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { MenuKey } from '../types';

interface SidebarNavProps {
  collapsed: boolean;
  activeMenu: MenuKey;
  onSelectMenu: (key: MenuKey) => void;
  isDark: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  collapsed,
  activeMenu,
  onSelectMenu,
  isDark,
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'grp-dashboard',
      label: '仪表盘',
      type: 'group',
      children: [
        {
          key: 'workplace',
          icon: <DashboardOutlined />,
          label: '工作台',
        },
        {
          key: 'analysis',
          icon: <LineChartOutlined />,
          label: '监控分析',
        },
      ],
    },
    {
      key: 'grp-business',
      label: '业务管理',
      type: 'group',
      children: [
        {
          key: 'materialTree',
          icon: <PartitionOutlined />,
          label: '物料分类树 (ERP)',
        },
        {
          key: 'proTable',
          icon: <TableOutlined />,
          label: '高级查询表格',
        },
        {
          key: 'stepsForm',
          icon: <FormOutlined />,
          label: '分步配置表单',
        },
      ],
    },
    {
      key: 'grp-orchestration',
      label: '架构协同',
      type: 'group',
      children: [
        {
          key: 'workflow',
          icon: <ApartmentOutlined />,
          label: 'BPMN 流程编排',
        },
        {
          key: 'excelTools',
          icon: <FileExcelOutlined />,
          label: '报表与拼音工具',
        },
      ],
    },
  ];

  return (
    <aside
      className={`flex flex-col border-r transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        isDark
          ? 'bg-[#141414] border-[#303030]'
          : 'bg-[#001529] text-white border-transparent'
      }`}
      style={{
        minHeight: '100vh',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
      }}
    >
      {/* Brand Logo & Name */}
      <div
        className="h-16 flex items-center px-4 gap-3 border-b overflow-hidden cursor-pointer"
        style={{
          borderColor: isDark ? '#303030' : 'rgba(255, 255, 255, 0.1)',
        }}
        onClick={() => onSelectMenu('workplace')}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-8 h-8 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 15L173.6 57.5V142.5L100 185L26.4 142.5V57.5L100 15Z"
            fill="#1677FF"
          />
          <path
            d="M100 45L147.6 72.5V127.5L100 155L52.4 127.5V72.5L100 45Z"
            fill="#4096FF"
          />
          <circle cx="100" cy="100" r="24" fill="#FFFFFF" />
        </svg>
        {!collapsed && (
          <div className="flex flex-col truncate">
            <span className="font-bold text-base tracking-wide text-white truncate">
              Ant Design Pro
            </span>
            <span className="text-[11px] text-gray-400 -mt-0.5 truncate">
              企业级管理中后台 v6.0
            </span>
          </div>
        )}
      </div>

      {/* Menu Navigation */}
      <div className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        <Menu
          theme={isDark ? 'dark' : 'dark'}
          mode="inline"
          selectedKeys={[activeMenu]}
          items={items}
          onClick={({ key }) => onSelectMenu(key as MenuKey)}
          inlineCollapsed={collapsed}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </div>

      {/* Sider Footer */}
      {!collapsed && (
        <div
          className="p-3 border-t text-[11px] text-center"
          style={{
            borderColor: isDark ? '#303030' : 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          <div>Ant Design Pro ©2026</div>
          <div className="text-[10px] opacity-75">Produced with @ant-design/pro</div>
        </div>
      )}
    </aside>
  );
};
