import './Engagements.css'

function Engagements() {
  return (
    <div className="engagements-page">
      <div className="container">
        <div className="page-header">
          <h1>Nos Engagements</h1>
          <p className="subtitle">Pour un avenir durable et responsable</p>
        </div>

        <section className="engagement-hero">
          <div className="hero-stat">
            <h2>1%</h2>
            <p>du CA reversé à la préservation de la biodiversité</p>
          </div>
          <div className="hero-stat">
            <h2>100%</h2>
            <p>emballages recyclables</p>
          </div>
          <div className="hero-stat">
            <h2>Bio</h2>
            <p>Certification européenne</p>
          </div>
        </section>

        <section className="engagement-section">
          <h2>🌍 Engagement Environnemental</h2>
          <div className="engagement-content">
            <div className="engagement-card">
              <h3>Programme de Reforestation</h3>
              <p>Nous participons activement à des projets de reforestation pour compenser notre empreinte carbone et restaurer les écosystèmes naturels.</p>
            </div>
            <div className="engagement-card">
              <h3>Emballages Éco-Responsables</h3>
              <p>Tous nos emballages sont 100% recyclables et conçus pour minimiser l'impact environnemental tout en préservant la qualité de nos produits.</p>
            </div>
            <div className="engagement-card">
              <h3>Préservation de la Biodiversité</h3>
              <p>1% de notre chiffre d'affaires est reversé à des projets de préservation de la biodiversité française et alpine.</p>
            </div>
          </div>
        </section>

        <section className="engagement-section">
          <h2>🤝 Engagement Social</h2>
          <div className="engagement-content">
            <div className="engagement-card">
              <h3>Partenariats Locaux</h3>
              <p>Nous travaillons exclusivement avec des producteurs locaux des Alpes françaises, garantissant une rémunération équitable et des relations durables.</p>
            </div>
            <div className="engagement-card">
              <h3>Transparence Totale</h3>
              <p>Traçabilité complète de nos ingrédients, de la source à votre porte. Chaque produit raconte son histoire.</p>
            </div>
            <div className="engagement-card">
              <h3>Accessibilité</h3>
              <p>Notre mission est de démocratiser l'accès à des solutions naturelles de haute qualité, avec un positionnement milieu de gamme premium.</p>
            </div>
          </div>
        </section>

        <section className="engagement-section">
          <h2>🔬 Engagement Qualité</h2>
          <div className="engagement-content">
            <div className="engagement-card">
              <h3>Certification Bio Européenne</h3>
              <p>Tous nos produits sont certifiés bio selon les standards européens les plus stricts.</p>
            </div>
            <div className="engagement-card">
              <h3>Processus Breveté</h3>
              <p>Notre processus d'extraction à froid préserve l'intégrité des principes actifs pour une efficacité maximale.</p>
            </div>
            <div className="engagement-card">
              <h3>Tests Scientifiques</h3>
              <p>Chaque formulation est scientifiquement prouvée et testée pour garantir son efficacité et sa sécurité.</p>
            </div>
          </div>
        </section>

        <section className="engagement-section">
          <h2>🏆 Labels et Certifications</h2>
          <div className="certifications">
            <div className="cert-badge">
              <span className="cert-icon">🌿</span>
              <p>Bio Européen</p>
            </div>
            <div className="cert-badge">
              <span className="cert-icon">🎯</span>
              <p>Entreprise à Mission</p>
            </div>
            <div className="cert-badge">
              <span className="cert-icon">♻️</span>
              <p>Emballage Recyclable</p>
            </div>
            <div className="cert-badge">
              <span className="cert-icon">🇫🇷</span>
              <p>Fabriqué en France</p>
            </div>
          </div>
        </section>

        <section className="community-section">
          <h2>Rejoignez Notre Communauté Engagée</h2>
          <p>Ensemble, construisons un avenir plus sain et durable. Chaque achat contribue à nos projets environnementaux et sociaux.</p>
          <div className="community-actions">
            <a href="/nos-produits" className="btn">Découvrir nos produits</a>
            <a href="/notre-histoire" className="btn btn-outline">En savoir plus</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Engagements
