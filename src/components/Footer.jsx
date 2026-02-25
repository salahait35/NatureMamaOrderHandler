import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>NatureMama Heritage</h3>
            <p>Née au cœur des Alpes françaises, nous créons des compléments alimentaires d'excellence en harmonie avec la nature.</p>
          </div>
          <div className="footer-section">
            <h4>Navigation</h4>
            <p><a href="/notre-histoire">Notre Histoire</a></p>
            <p><a href="/nos-produits">Nos Produits</a></p>
            <p><a href="/nos-engagements">Nos Engagements</a></p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: contact@naturemamaheritage.com</p>
            <p>Service client expert et réactif</p>
          </div>
          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <p>Instagram | Facebook | LinkedIn</p>
            <p className="certification">🌿 Certification Bio Européenne</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 NatureMama Heritage. Tous droits réservés. | 1% du CA reversé à la préservation de la biodiversité</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
