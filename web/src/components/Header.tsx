import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-black hover:text-gray-800 transition-all"
            >
              Sinta Serve
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
