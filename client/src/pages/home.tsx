import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h2 className="text-lg font-bold mb-4" data-testid="tournaments-title">Torneos</h2>
        <div className="bg-white border border-gray-300 rounded p-4">
          <Link href="/tournament" data-testid="tournament-link">
            <div className="flex items-center justify-between p-3 border-b hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" 
                  alt="Copa" 
                  className="w-8 h-8 mr-3"
                  data-testid="tournament-logo"
                />
                <div>
                  <h3 className="font-bold text-sm" data-testid="tournament-name">Copa Libertadores de Plato</h3>
                  <p className="text-xs text-gray-600" data-testid="tournament-phase">Cuartos de Final - 2025</p>
                </div>
              </div>
              <span className="text-blue-600 text-sm" data-testid="tournament-arrow">Ver torneo →</span>
            </div>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
