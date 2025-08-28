import { Link } from "wouter";

export default function Header() {
  return (
    <div className="w-full bg-white border-b border-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" data-testid="logo-link">
              <h1 className="text-2xl font-bold text-blue-600" data-testid="logo">PROMIEDOS</h1>
            </Link>
            <span className="ml-2 text-sm text-gray-600" data-testid="subtitle">Fútbol Argentino</span>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-blue-600 hover:underline text-sm" data-testid="nav-home">Inicio</Link>
            <Link href="/tournament" className="text-blue-600 hover:underline text-sm font-bold" data-testid="nav-tournament">Copa Libertadores de Plato</Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
