# NatureMama Heritage - Site E-Commerce

Site e-commerce moderne et élégant pour NatureMama Heritage, spécialisé dans les compléments alimentaires naturels.

## 🌿 À Propos

NatureMama Heritage incarne la rencontre entre la sagesse ancestrale des plantes et l'innovation scientifique moderne. Née au cœur des Alpes françaises en 2023, notre mission est de démocratiser l'accès à des solutions naturelles de haute qualité.

## ✨ Fonctionnalités

### Frontend
- **Notre Histoire** : Timeline interactive avec photos
- **Nos Produits** : Catalogue de 4 gammes de compléments alimentaires
- **Nos Engagements** : Transparence sur nos actions environnementales et sociales
- **Panier** : Système complet de gestion de panier avec :
  - Ajout/suppression de produits
  - Modification des quantités
  - Calcul automatique du total
  - Livraison gratuite dès 50€

### Checkout & Commande
- Formulaire de commande avec validation :
  - Nom complet
  - Email (format validé)
  - Adresse complète
  - Code postal (5 chiffres)
  - Téléphone (format français validé)
- Confirmation de commande en temps réel
- Email de confirmation automatique avec design de la marque

### Backend (AWS)
- **API Gateway** : REST API sécurisée
- **Lambda** : Traitement des commandes (Node.js 20.x)
- **DynamoDB** : Stockage des commandes
- **SES** : Envoi d'emails de confirmation
- **CloudFormation** : Infrastructure as Code

## 🎨 Design

- Palette de couleurs : Vert sauge (#8b9d83), Brun terre (#8b7355), Blanc naturel
- Design épuré et élégant évoquant pureté et authenticité
- Responsive et moderne
- Interface en français

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18 ou supérieur)
- npm
- Compte AWS

### Installation

1. Clonez le dépôt :
```bash
git clone <your-repo-url>
cd naturemama-heritage
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
# Éditez .env et ajoutez votre URL API Gateway
```

4. Lancez en développement :
```bash
npm run dev
```

## 📦 Déploiement

Consultez le **[Guide de Déploiement](./Deployment_Guide.md)** pour des instructions détaillées sur :
- Configuration AWS SES
- Déploiement de l'infrastructure CloudFormation
- Configuration du frontend
- Déploiement sur AWS Amplify
- Tests et dépannage

## 🏗️ Architecture

Consultez le **[Diagramme d'Architecture](./Architecture_Diagram.md)** pour une vue complète de :
- Architecture frontend/backend
- Flux de données
- Services AWS utilisés
- Sécurité et IAM
- Scalabilité

## 📁 Structure du Projet

```
naturemama-heritage/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ProductCard.jsx
│   │   └── Footer.jsx
│   ├── context/           # Context API (Cart)
│   │   └── CartContext.jsx
│   ├── pages/             # Pages principales
│   │   ├── Home.jsx
│   │   ├── Histoire.jsx
│   │   ├── Produits.jsx
│   │   ├── Engagements.jsx
│   │   └── Panier.jsx
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── lambda/            # Code Lambda
│   │   ├── orderHandler.js
│   │   └── package.json
│   └── cloudformation-template.yaml
├── public/
├── .env.example
├── Deployment_Guide.md
├── Architecture_Diagram.md
└── README.md
```

## 🎯 Positionnement

- **Cible** : CSP+ urbains, 25-55 ans, sensibles à l'environnement
- **Prix** : 25-45€ pour un mois de traitement (milieu de gamme premium)
- **Distribution** : E-commerce, pharmacies, magasins bio

## 🌍 Engagements

- ♻️ 1% du CA reversé à la préservation de la biodiversité
- 🌿 Emballages 100% recyclables
- 🏆 Certification Bio Européenne
- 🇫🇷 Fabriqué en France (Alpes françaises)

## 🔧 Technologies

### Frontend
- React 18
- Vite
- React Router
- Context API

### Backend
- AWS Lambda (Node.js 20.x)
- AWS API Gateway
- AWS DynamoDB
- AWS SES
- AWS Amplify

### Infrastructure
- CloudFormation
- IAM

## 💰 Coûts Estimés

Avec un trafic modéré (100 commandes/mois) :
- Lambda : ~0.20$ / mois
- API Gateway : ~0.35$ / mois
- DynamoDB : ~0.25$ / mois
- SES : 0.10$ / 1000 emails
- Amplify : ~15$ / mois

**Total estimé** : ~16$ / mois

## 🧪 Tests

### Test local
```bash
npm run dev
```

### Test de commande
1. Ajoutez des produits au panier
2. Remplissez le formulaire de commande
3. Vérifiez l'email de confirmation
4. Consultez DynamoDB pour voir la commande

## 📊 Monitoring

- **CloudWatch Logs** : Logs Lambda et API Gateway
- **DynamoDB Console** : Visualisation des commandes
- **SES Console** : Statistiques d'envoi d'emails

## 🔐 Sécurité

- HTTPS partout
- Validation des entrées (frontend et backend)
- IAM avec principe du moindre privilège
- Pas de credentials en dur
- CORS configuré correctement

## 📝 Maintenance

### Mettre à jour le code Lambda
```bash
cd backend/lambda
npm install
zip -r lambda-function.zip orderHandler.js node_modules package.json
# Upload via Console Lambda
```

### Mettre à jour le frontend
```bash
git add .
git commit -m "Update"
git push
# Amplify redéploie automatiquement
```

## 🐛 Dépannage

Consultez la section "Dépannage" du [Guide de Déploiement](./Deployment_Guide.md) pour :
- Problèmes d'email
- Erreurs de commande
- Erreurs CORS
- Logs CloudWatch

## 📄 Licence

© 2026 NatureMama Heritage. Tous droits réservés.

## 🤝 Support

Pour toute question :
1. Consultez le [Guide de Déploiement](./Deployment_Guide.md)
2. Vérifiez les logs CloudWatch
3. Consultez la documentation AWS

## 🎉 Remerciements

Merci d'avoir choisi NatureMama Heritage pour votre projet e-commerce !
