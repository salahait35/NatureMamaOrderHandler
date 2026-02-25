import ProductCard from '../components/ProductCard'
import './Produits.css'

const products = [
  {
    id: 1,
    name: 'Vitalité - Booster d\'Énergie',
    description: 'Formule naturelle pour retrouver votre énergie quotidienne. Extraction à froid des principes actifs.',
    price: 34.99,
    category: 'Ligne Vitalité',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400'
  },
  {
    id: 2,
    name: 'Sérénité - Anti-Stress',
    description: 'Solution naturelle pour retrouver calme et équilibre. Ingrédients 100% naturels.',
    price: 29.99,
    category: 'Ligne Sérénité',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  {
    id: 3,
    name: 'Immunité - Défenses Naturelles',
    description: 'Renforce vos défenses naturelles avec des plantes sélectionnées des Alpes.',
    price: 39.99,
    category: 'Ligne Immunité',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'
  },
  {
    id: 4,
    name: 'Enfants - Croissance',
    description: 'Compléments adaptés aux plus jeunes, formulation douce et efficace.',
    price: 27.99,
    category: 'Ligne Enfants',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400'
  },
  {
    id: 5,
    name: 'Vitalité - Pack Mensuel',
    description: 'Cure d\'un mois pour une énergie durable. Meilleur rapport qualité-prix.',
    price: 44.99,
    category: 'Ligne Vitalité',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'
  },
  {
    id: 6,
    name: 'Sérénité - Sommeil Réparateur',
    description: 'Favorise un sommeil naturel et réparateur. Plantes bio certifiées.',
    price: 32.99,
    category: 'Ligne Sérénité',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400'
  }
]

function Produits() {
  return (
    <div className="produits-page">
      <div className="container">
        <div className="page-header">
          <h1>Nos Produits</h1>
          <p>Compléments alimentaires d'excellence, en harmonie avec la nature</p>
          <div className="price-range">
            <span>Prix : 25-45€ pour un mois de traitement</span>
          </div>
        </div>

        <section className="product-features">
          <div className="grid grid-3">
            <div className="feature-box">
              <h3>🌿 100% Naturel</h3>
              <p>Extraction à froid des principes actifs</p>
            </div>
            <div className="feature-box">
              <h3>🔬 Scientifiquement Prouvé</h3>
              <p>Formulation synergique des ingrédients</p>
            </div>
            <div className="feature-box">
              <h3>♻️ Éco-Responsable</h3>
              <p>Packaging 100% recyclable</p>
            </div>
          </div>
        </section>

        <section className="product-lines">
          <h2>Nos Gammes</h2>
          <div className="grid grid-3">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="consultation-cta">
          <h2>Besoin de Conseils ?</h2>
          <p>Profitez d'une consultation personnalisée en ligne avec nos experts</p>
          <button className="btn">Consultation Gratuite</button>
        </section>
      </div>
    </div>
  )
}

export default Produits
