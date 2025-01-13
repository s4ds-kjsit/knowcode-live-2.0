import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, BarChart3, Home, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Submit Project', href: '/submit', icon: Upload },
    { name: 'Judge Projects', href: '/judge', icon: Award },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <Award className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    HackJudge
                  </span>
                </div>
                <nav className="mt-8 flex-1 space-y-1 px-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          location.pathname === item.href
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50',
                          'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                        )}
                      >
                        <Icon
                          className={cn(
                            location.pathname === item.href
                              ? 'text-blue-600'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-3 h-5 w-5 flex-shrink-0'
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}