import { useCart } from '../context/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="price">{product.price.toFixed(2)}€</span>
          <button className="btn" onClick={handleAddToCart}>Ajouter au panier</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
