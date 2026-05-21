import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-500",
        isCollapsed ? "ml-[80px]" : "ml-[280px]"
      )}>
        <div className="max-w-full">
          <TopBar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
          <main className="p-6 lg:p-10 w-full mx-auto max-w-[1600px]">
            {children}
          </main>
        </div>
      </div>
      
      {/* Styles to make the sidebar-main relationship clean */}
      <style>{`
        main {
          transition: all 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
