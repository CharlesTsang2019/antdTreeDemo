import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { HeaderNav } from './components/HeaderNav';
import { SidebarNav } from './components/SidebarNav';
import { DashboardView } from './components/DashboardView';
import { AnalysisView } from './components/AnalysisView';
import { ProTableView } from './components/ProTableView';
import { StepsFormView } from './components/StepsFormView';
import { WorkflowDesigner } from './components/WorkflowDesigner';
import { ExcelToolsView } from './components/ExcelToolsView';
import { MaterialCategoryView } from './components/MaterialCategoryView';
import { MenuKey } from './types';

dayjs.locale('zh-cn');

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('materialTree');
  const [isDark, setIsDark] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Sync dark class to html documentElement for Tailwind and dark theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      }}
    >
      <div className="min-h-screen flex bg-[#f0f2f5] dark:bg-[#141414] text-neutral-800 dark:text-neutral-100 transition-colors">
        {/* Left Sidebar */}
        <SidebarNav
          collapsed={collapsed}
          activeMenu={activeMenu}
          onSelectMenu={setActiveMenu}
          isDark={isDark}
        />

        {/* Right Main Region */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header */}
          <HeaderNav
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            activeMenu={activeMenu}
            onSelectMenu={setActiveMenu}
            isDark={isDark}
            onToggleDark={() => setIsDark(!isDark)}
            onSearchGlobal={(q) => {
              setGlobalSearch(q);
              if (q.trim()) {
                setActiveMenu('proTable');
              }
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {activeMenu === 'materialTree' && <MaterialCategoryView />}
            {activeMenu === 'workplace' && (
              <DashboardView onNavigate={(key) => setActiveMenu(key)} />
            )}
            {activeMenu === 'analysis' && <AnalysisView isDark={isDark} />}
            {activeMenu === 'proTable' && <ProTableView initialSearch={globalSearch} />}
            {activeMenu === 'stepsForm' && <StepsFormView />}
            {activeMenu === 'workflow' && <WorkflowDesigner />}
            {activeMenu === 'excelTools' && <ExcelToolsView />}
          </main>

          {/* Global Footer */}
          <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
            <div className="flex items-center justify-center gap-4 mb-1">
              <a
                href="#help"
                className="hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu('workplace');
                }}
              >
                Pro 首页
              </a>
              <span>·</span>
              <a
                href="#analysis"
                className="hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu('analysis');
                }}
              >
                监控分析
              </a>
              <span>·</span>
              <a
                href="#github"
                className="hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu('workflow');
                }}
              >
                BPMN 流程设计
              </a>
              <span>·</span>
              <a
                href="#excel"
                className="hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu('excelTools');
                }}
              >
                Excel 报表
              </a>
            </div>
            <div>Ant Design Pro 6.0 · 基于 Ant Design 与 ProComponents 全栈设计</div>
          </footer>
        </div>
      </div>
    </ConfigProvider>
  );
}
