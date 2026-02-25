import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>La force de la nature pour votre bien-être</h1>
          <p>Fusion de la sagesse ancestrale des plantes avec la science moderne</p>
          <div className="hero-buttons">
            <Link to="/nos-produits" className="btn">Découvrir nos produits</Link>
            <Link to="/notre-histoire" className="btn btn-outline">Notre Histoire</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
