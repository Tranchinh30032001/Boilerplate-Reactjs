import { Outlet } from 'react-router'

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      {/* Header/Navigation */}
      <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Practice S3
          </span>
        </div>
        <nav className="flex items-center gap-4">
          {/* Add user profile / logout button here */}
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Responsive Sidebar (Desktop) */}
        <aside className="w-64 border-r border-zinc-200 bg-white hidden md:block p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-zinc-100 text-sm font-medium">
                Dashboard
              </a>
            </li>
          </ul>
        </aside>

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-6 bg-zinc-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
