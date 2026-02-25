import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Histoire from './pages/Histoire'
import Produits from './pages/Produits'
import Engagements from './pages/Engagements'
import Panier from './pages/Panier'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notre-histoire" element={<Histoire />} />
              <Route path="/nos-produits" element={<Produits />} />
              <Route path="/nos-engagements" element={<Engagements />} />
              <Route path="/panier" element={<Panier />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
