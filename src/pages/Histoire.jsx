import './Histoire.css'

function Histoire() {
  return (
    <div className="histoire-page">
      <div className="container">
        <div className="page-header">
          <h1>Notre Histoire</h1>
          <p className="subtitle">Née au cœur des Alpes françaises</p>
        </div>

        <section className="histoire-section">
          <h2>Une Passion Familiale Transmise de Génération en Génération</h2>
          <p>NatureMama Heritage incarne la rencontre entre la sagesse ancestrale des plantes et l'innovation scientifique moderne. Notre voyage a commencé en 2023, inspiré par la richesse de la biodiversité française et le désir de proposer des solutions naturelles accessibles à tous.</p>
        </section>

        <section className="timeline-section">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-image">
                <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop" alt="Racines familiales dans la campagne française" />
              </div>
              <div className="timeline-content">
                <div className="timeline-badge">Racines</div>
                <h3>Tradition Familiale</h3>
                <p>Une passion familiale pour les remèdes naturels transmise de génération en génération dans la campagne française.</p>
              </div>
            </div>

            <div className="timeline-item timeline-item-reverse">
              <div className="timeline-image">
                <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop" alt="Fondation NatureMama Heritage en 2023" />
              </div>
              <div className="timeline-content">
                <div className="timeline-badge">2023</div>
                <h3>Fondation</h3>
                <p>NatureMama Heritage est née de la rencontre entre les secrets ancestraux et la validation scientifique moderne.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-image">
                <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop" alt="Excellence et qualité aujourd'hui" />
              </div>
              <div className="timeline-content">
                <div className="timeline-badge">Aujourd'hui</div>
                <h3>Excellence</h3>
                <p>Compléments alimentaires naturels de haute qualité, certifiés bio, fabriqués en France avec une traçabilité complète.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="histoire-section">
          <h2>Notre Philosophie</h2>
          <p>NatureMama Heritage s'engage à créer des compléments alimentaires d'excellence, en harmonie avec la nature et respectueux de l'environnement. Notre mission est de démocratiser l'accès à des solutions naturelles de haute qualité, tout en préservant les ressources naturelles pour les générations futures.</p>
        </section>

        <section className="histoire-section">
          <h2>Notre Différenciation</h2>
          <ul className="differentiation-list">
            <li>✓ Traçabilité complète de nos ingrédients</li>
            <li>✓ Partenariats exclusifs avec des producteurs locaux</li>
            <li>✓ Processus d'extraction breveté préservant l'intégrité des principes actifs</li>
            <li>✓ Certification bio européenne et label "Entreprise à Mission"</li>
          </ul>
        </section>

        <section className="histoire-section">
          <h2>Notre Processus Unique</h2>
          <p>Nos produits sont élaborés selon un processus unique combinant extraction à froid des principes actifs, formulation synergique des ingrédients, conservation naturelle et packaging éco-responsable.</p>
        </section>

        <section className="values">
          <h2>Nos Valeurs</h2>
          <div className="grid grid-3">
            <div className="value-card">
              <h3>🌿 Authenticité</h3>
              <p>Ingrédients 100% naturels, soigneusement sélectionnés</p>
            </div>
            <div className="value-card">
              <h3>🔬 Innovation</h3>
              <p>Alliance de la tradition et de la science moderne</p>
            </div>
            <div className="value-card">
              <h3>🌍 Durabilité</h3>
              <p>Engagement sincère pour la préservation de la biodiversité</p>
            </div>
          </div>
        </section>

        <section className="histoire-section cta-section">
          <h2>Rejoignez Notre Communauté</h2>
          <p>Découvrez nos produits 100% naturels et scientifiquement prouvés pour votre vitalité quotidienne. Faites confiance à la puissance de la nature.</p>
          <a href="/nos-produits" className="btn">Découvrir nos produits</a>
        </section>
      </div>
    </div>
  )
}

export default Histoire
