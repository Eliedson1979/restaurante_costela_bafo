import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import Quentinhas from './views/Quentinhas';
import Login from './views/Login';
import Signup from './views/Signup';
import Profile from './views/Profile';
import AdminDashboard from './views/AdminDashboard';
import Contact from './views/Contact';
import Careers from './views/Careers';
import Avaliacoes from './views/Avaliacoes';
import CafeDaManha from './views/CafeDaManha';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-black text-zinc-100">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/pagamento" element={<Checkout />} />
                <Route path="/quentinhas" element={<Quentinhas />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/trabalhe-conosco" element={<Careers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/avaliacoes" element={<Avaliacoes />} />
                <Route path="/cafe-da-manha" element={<CafeDaManha />} />              </Routes>
            </main>

            <footer className="bg-black text-zinc-100 mt-20 pt-16 pb-8 border-t border-zinc-800">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-black mb-4">Restaurante <span className="text-yellow-500">Costela no Bafo</span></h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto italic">Tradicionalismo e sabor em cada pedaço. O melhor churrasco da cidade direto na sua mesa.</p>
                <div className="flex justify-center space-x-6 mb-8">
                  <a href="/trabalhe-conosco" className="text-zinc-400 hover:text-yellow-500 transition-colors">Trabalhe Conosco</a>
                </div>
                <div className="h-px bg-zinc-800 mb-8"></div>
                <p className="text-zinc-500 text-sm">© 2025 Restaurante Costela no Bafo - Todos os direitos reservados.</p>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
