import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './Panier.css'

function Panier() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    street: '',
    postalCode: '',
    city: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone) => {
    const re = /^(\+33|0)[1-9](\d{2}){4}$/
    return re.test(phone.replace(/\s/g, ''))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.street.trim()) {
      newErrors.street = 'L\'adresse est requise'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis'
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Code postal invalide (5 chiffres)'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide (ex: 0612345678 ou +33612345678)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'YOUR_API_GATEWAY_URL'
      
      const orderData = {
        customer: formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: getCartTotal(),
        orderDate: new Date().toISOString()
      }

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la commande')
      }

      const result = await response.json()
      
      setOrderSuccess(true)
      clearCart()
      setFormData({
        fullName: '',
        email: '',
        street: '',
        postalCode: '',
        city: '',
        phone: ''
      })
      
      setTimeout(() => {
        setShowCheckout(false)
        setOrderSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la commande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="panier-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Commande confirmée !</h1>
            <p>Merci pour votre commande. Un email de confirmation vous a été envoyé.</p>
            <a href="/nos-produits" className="btn">Continuer vos achats</a>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="panier-page">
        <div className="container">
          <div className="page-header">
            <h1>Votre Panier</h1>
          </div>
          <div className="panier-empty">
            <p>Votre panier est actuellement vide</p>
            <p className="subtitle">Découvrez nos compléments alimentaires naturels</p>
            <a href="/nos-produits" className="btn">Découvrir nos produits</a>
          </div>
          
          <section className="panier-benefits">
            <h3>Pourquoi choisir NatureMama Heritage ?</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <span>✓</span>
                <p>Livraison gratuite dès 50€</p>
              </div>
              <div className="benefit-item">
                <span>✓</span>
                <p>Programme de fidélité écologique</p>
              </div>
              <div className="benefit-item">
                <span>✓</span>
                <p>Service client expert et réactif</p>
              </div>
              <div className="benefit-item">
                <span>✓</span>
                <p>Satisfaction garantie</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="panier-page">
        <div className="container">
          <div className="page-header">
            <h1>Finaliser la commande</h1>
          </div>
          
          <div className="checkout-container">
            <form onSubmit={handleSubmitOrder} className="checkout-form">
              <h2>Informations de livraison</h2>
              
              <div className="form-group">
                <label htmlFor="fullName">Nom complet *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="street">Rue et numéro *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={errors.street ? 'error' : ''}
                />
                {errors.street && <span className="error-message">{errors.street}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Code postal *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={errors.postalCode ? 'error' : ''}
                  />
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city">Ville *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="0612345678"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCheckout(false)} className="btn btn-outline">
                  Retour au panier
                </button>
                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
                </button>
              </div>
            </form>

            <div className="order-summary">
              <h2>Récapitulatif</h2>
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
              <div className="summary-total">
                <span>Total</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panier-page">
      <div className="container">
        <div className="page-header">
          <h1>Votre Panier</h1>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-price">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
                <button className="item-remove" onClick={() => removeFromCart(item.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Récapitulatif</h2>
            <div className="summary-line">
              <span>Sous-total</span>
              <span>{getCartTotal().toFixed(2)}€</span>
            </div>
            <div className="summary-line">
              <span>Livraison</span>
              <span>{getCartTotal() >= 50 ? 'Gratuite' : '5.90€'}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{(getCartTotal() + (getCartTotal() >= 50 ? 0 : 5.90)).toFixed(2)}€</span>
            </div>
            <button className="btn" onClick={() => setShowCheckout(true)}>
              Passer la commande
            </button>
            <button className="btn btn-outline" onClick={clearCart}>
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Panier
