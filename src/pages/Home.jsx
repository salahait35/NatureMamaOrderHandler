import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import './Home.css'

const featuredProducts = [
  {
    id: 1,
    name: 'Vitalité - Booster d\'Énergie',
    description: 'Formule naturelle pour retrouver votre énergie quotidienne',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400'
  },
  {
    id: 2,
    name: 'Sérénité - Anti-Stress',
    description: 'Solution naturelle pour retrouver calme et équilibre',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  {
    id: 3,
    name: 'Immunité - Défenses Naturelles',
    description: 'Renforce vos défenses naturelles avec des plantes des Alpes',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'
  }
]

function Home() {
  return (
    <div className="home">
      <Hero />
      
      <section className="mission">
        <div className="container">
          <h2>Notre Mission</h2>
          <p>Démocratiser l'accès à des solutions naturelles de haute qualité, en harmonie avec la nature et respectueuses de l'environnement. Nos produits allient tradition ancestrale et innovation scientifique pour vous offrir le meilleur du bien-être.</p>
        </div>
      </section>

      <section className="values-home">
        <div className="container">
          <div className="grid grid-3">
            <div className="value-home-card">
              <span className="value-icon">🌿</span>
              <h3>100% Naturel</h3>
              <p>Ingrédients soigneusement sélectionnés et testés pour leur efficacité</p>
            </div>
            <div className="value-home-card">
              <span className="value-icon">🔬</span>
              <h3>Scientifiquement Prouvé</h3>
              <p>Alliance de la sagesse ancestrale et de la science moderne</p>
            </div>
            <div className="value-home-card">
              <span className="value-icon">🇫🇷</span>
              <h3>Fabriqué en France</h3>
              <p>Né au cœur des Alpes françaises avec des producteurs locaux</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Nos Produits Phares</h2>
          <p className="featured-subtitle">Découvrez nos gammes de compléments alimentaires d'excellence</p>
          <div className="grid grid-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="view-all">
            <Link to="/nos-produits" className="btn">Voir tous nos produits</Link>
          </div>
        </div>
      </section>

      <section className="engagement-home">
        <div className="container">
          <h2>Nos Engagements</h2>
          <div className="engagement-grid">
            <div className="engagement-item">
              <h3>♻️ 1% pour la Biodiversité</h3>
              <p>1% de notre CA reversé à la préservation de la biodiversité</p>
            </div>
            <div className="engagement-item">
              <h3>🌍 Emballages Recyclables</h3>
              <p>100% de nos emballages sont recyclables</p>
            </div>
            <div className="engagement-item">
              <h3>🏆 Certifications</h3>
              <p>Bio européen et label "Entreprise à Mission"</p>
            </div>
          </div>
          <div className="view-all">
            <Link to="/nos-engagements" className="btn btn-outline">En savoir plus</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
