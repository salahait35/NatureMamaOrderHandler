import { useState } from 'react'
import './Aide.css'

const faqs = [
  {
    question: 'Comment passer une commande ?',
    answer: 'Parcourez nos produits, ajoutez-les au panier, puis validez votre commande depuis la page Panier. Le paiement est sécurisé.'
  },
  {
    question: 'Quels sont les délais de livraison ?',
    answer: 'Les commandes sont expédiées sous 24 à 48h. La livraison standard prend 3 à 5 jours ouvrés en France métropolitaine.'
  },
  {
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous disposez de 30 jours après réception pour retourner un produit non ouvert. Contactez-nous pour initier le retour.'
  },
  {
    question: 'Les produits sont-ils adaptés aux enfants ?',
    answer: 'Notre Ligne Enfants est spécialement formulée pour les plus jeunes. Pour les autres gammes, consultez les indications sur chaque fiche produit.'
  },
  {
    question: 'Comment contacter le service client ?',
    answer: 'Par email à contact@naturemama.fr ou par téléphone au 01 23 45 67 89, du lundi au vendredi de 9h à 18h.'
  }
]

function Aide() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="aide-page">
      <div className="container">
        <div className="page-header">
          <h1>Centre d'Aide</h1>
          <p>Retrouvez les réponses à vos questions les plus fréquentes</p>
        </div>

        <section className="faq-section">
          <h2>Questions Fréquentes</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggle(index)} aria-expanded={openIndex === index}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <h2>Besoin d'aide supplémentaire ?</h2>
          <div className="contact-cards">
            <div className="contact-card">
              <span className="contact-icon">📧</span>
              <h3>Email</h3>
              <p>contact@naturemama.fr</p>
              <p>Réponse sous 24h</p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📞</span>
              <h3>Téléphone</h3>
              <p>01 23 45 67 89</p>
              <p>Lun-Ven, 9h-18h</p>
            </div>
            <div className="contact-card">
              <span className="contact-icon">📍</span>
              <h3>Adresse</h3>
              <p>NatureMama Heritage</p>
              <p>Annecy, France</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Aide
