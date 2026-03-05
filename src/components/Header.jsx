import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'

function Header() {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <span className="logo-main">NatureMama Heritage</span>
            <span className="logo-tagline">La force de la nature pour votre bien-être</span>
          </Link>
          <ul className="nav-links">
            <li><Link to="/notre-histoire">Notre Histoire</Link></li>
            <li><Link to="/nos-produits">Nos Produits</Link></li>
            <li><Link to="/nos-engagements">Nos Engagements</Link></li>
            <li><Link to="/aide">Aide</Link></li>
            <li>
              <Link to="/panier" className="cart-link">
                Panier {cartCount > 0 && `(${cartCount})`}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
