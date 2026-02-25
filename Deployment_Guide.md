# Guide de Déploiement - NatureMama Heritage

Ce guide vous accompagne pas à pas pour déployer votre site e-commerce avec toutes les fonctionnalités backend.

## 📋 Prérequis

1. **Compte AWS** avec accès à :
   - CloudFormation
   - Lambda
   - API Gateway
   - DynamoDB
   - SES (Simple Email Service)
   - Amplify

2. **Outils locaux** :
   - Node.js (v18 ou supérieur)
   - npm
   - Git

## 🚀 Étape 1 : Configuration AWS SES (Email)

### 1.1 Vérifier votre adresse email

1. Connectez-vous à la [Console AWS SES](https://console.aws.amazon.com/ses/)
2. Assurez-vous d'être dans la région **us-east-1** (en haut à droite)
3. Dans le menu de gauche, cliquez sur **Verified identities**
4. Cliquez sur **Create identity**
5. Sélectionnez **Email address**
6. Entrez votre email (ex: `contact@naturemamaheritage.com`)
7. Cliquez sur **Create identity**
8. **Important** : Vérifiez votre boîte email et cliquez sur le lien de vérification

### 1.2 Sortir du mode Sandbox (Optionnel mais recommandé)

Par défaut, SES est en mode "Sandbox" et ne peut envoyer qu'aux emails vérifiés.

1. Dans SES, allez dans **Account dashboard**
2. Cliquez sur **Request production access**
3. Remplissez le formulaire (généralement approuvé en 24h)

**Note** : En mode Sandbox, vous pouvez tester en vérifiant aussi l'email du client test.

## 🏗️ Étape 2 : Déployer l'Infrastructure Backend

### 2.1 Préparer le code Lambda

1. Ouvrez un terminal dans le dossier `backend/lambda`
2. Installez les dépendances :

```bash
cd backend/lambda
npm install
```

3. Créez un fichier ZIP avec le code :

```bash
# Sur macOS/Linux
zip -r lambda-function.zip orderHandler.js node_modules package.json

# Sur Windows (PowerShell)
Compress-Archive -Path orderHandler.js,node_modules,package.json -DestinationPath lambda-function.zip
```

### 2.2 Déployer via CloudFormation

1. Allez sur la [Console CloudFormation](https://console.aws.amazon.com/cloudformation/)
2. Assurez-vous d'être dans la région **us-east-1**
3. Cliquez sur **Create stack** → **With new resources**
4. Sélectionnez **Upload a template file**
5. Cliquez sur **Choose file** et sélectionnez `backend/cloudformation-template.yaml`
6. Cliquez sur **Next**

7. **Paramètres de la stack** :
   - Stack name : `NatureMamaBackend`
   - SenderEmail : Entrez l'email vérifié à l'étape 1.1 (ex: `contact@naturemamaheritage.com`)
   - Cliquez sur **Next**

8. **Options de la stack** :
   - Laissez les valeurs par défaut
   - Cliquez sur **Next**

9. **Review** :
   - Cochez la case **I acknowledge that AWS CloudFormation might create IAM resources**
   - Cliquez sur **Submit**

10. **Attendez** que le statut passe à `CREATE_COMPLETE` (environ 2-3 minutes)

### 2.3 Mettre à jour le code Lambda

1. Dans CloudFormation, cliquez sur votre stack `NatureMamaBackend`
2. Allez dans l'onglet **Outputs**
3. Notez le **LambdaFunctionName** (ex: `NatureMamaOrderHandler`)

4. Allez sur la [Console Lambda](https://console.aws.amazon.com/lambda/)
5. Cliquez sur la fonction `NatureMamaOrderHandler`
6. Cliquez sur **Upload from** → **.zip file**
7. Sélectionnez le fichier `lambda-function.zip` créé à l'étape 2.1
8. Cliquez sur **Save**

### 2.4 Récupérer l'URL de l'API

1. Retournez dans CloudFormation
2. Cliquez sur votre stack `NatureMamaBackend`
3. Allez dans l'onglet **Outputs**
4. **Copiez** la valeur de **ApiUrl** (ex: `https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod`)

## ⚙️ Étape 3 : Configuration du Frontend

### 3.1 Créer le fichier .env

1. À la racine du projet, créez un fichier nommé `.env`
2. Copiez le contenu de `.env.example`
3. Remplacez `YOUR_API_GATEWAY_URL_HERE` par l'URL copiée à l'étape 2.4

Exemple :
```
VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
```

### 3.2 Installer les dépendances

```bash
npm install
```

### 3.3 Tester localement

```bash
npm run dev
```

Ouvrez votre navigateur sur `http://localhost:5173` et testez :
1. Ajoutez des produits au panier
2. Remplissez le formulaire de commande
3. Vérifiez que vous recevez l'email de confirmation

## 🌐 Étape 4 : Déployer le Frontend sur AWS Amplify

### 4.1 Préparer le dépôt Git

1. Initialisez Git (si pas déjà fait) :

```bash
git init
git add .
git commit -m "Initial commit - NatureMama Heritage"
```

2. Créez un dépôt sur GitHub/GitLab/Bitbucket
3. Poussez votre code :

```bash
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 4.2 Déployer sur Amplify

1. Allez sur la [Console AWS Amplify](https://console.aws.amazon.com/amplify/)
2. Cliquez sur **New app** → **Host web app**
3. Sélectionnez votre fournisseur Git (GitHub, GitLab, etc.)
4. Autorisez AWS Amplify à accéder à votre dépôt
5. Sélectionnez votre dépôt et la branche `main`
6. Cliquez sur **Next**

7. **Build settings** :
   - Amplify détecte automatiquement Vite
   - Vérifiez que la configuration ressemble à :

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

8. **Variables d'environnement** :
   - Cliquez sur **Advanced settings**
   - Ajoutez une variable :
     - Key: `VITE_API_URL`
     - Value: Votre URL API (de l'étape 2.4)
   - Cliquez sur **Next**

9. **Review** :
   - Vérifiez tout
   - Cliquez sur **Save and deploy**

10. **Attendez** le déploiement (5-10 minutes)
11. Une fois terminé, cliquez sur le lien fourni pour voir votre site en ligne !

## 🧪 Étape 5 : Tester le Site

### 5.1 Test de commande

1. Visitez votre site Amplify
2. Allez dans **Nos Produits**
3. Ajoutez des produits au panier
4. Cliquez sur **Panier**
5. Cliquez sur **Passer la commande**
6. Remplissez le formulaire avec :
   - Nom complet : Votre nom
   - Email : Un email que vous pouvez vérifier
   - Adresse complète
   - Téléphone : Format français (ex: 0612345678)
7. Cliquez sur **Confirmer la commande**
8. Vérifiez votre boîte email pour la confirmation

### 5.2 Vérifier les commandes dans DynamoDB

1. Allez sur la [Console DynamoDB](https://console.aws.amazon.com/dynamodb/)
2. Cliquez sur **Tables** dans le menu de gauche
3. Cliquez sur **NatureMamaOrders**
4. Cliquez sur **Explore table items**
5. Vous devriez voir vos commandes avec tous les détails

## 📊 Visualiser les Commandes

### Dans la Console DynamoDB

1. Console DynamoDB → Tables → NatureMamaOrders
2. Onglet **Explore table items**
3. Vous verrez :
   - `orderNumber` : Numéro de commande unique
   - `customer` : Informations client
   - `items` : Produits commandés
   - `total` : Montant total
   - `orderDate` : Date de la commande
   - `status` : Statut (confirmed)

### Exporter les données

1. Dans DynamoDB, sélectionnez les items
2. Cliquez sur **Actions** → **Export to CSV**

## 🔧 Dépannage

### Problème : Email non reçu

**Solution** :
1. Vérifiez que l'email est vérifié dans SES
2. Vérifiez les logs Lambda :
   - Console Lambda → NatureMamaOrderHandler → Monitor → View logs in CloudWatch
3. Vérifiez votre dossier spam

### Problème : Erreur lors de la commande

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez l'onglet Network pour voir l'erreur
3. Vérifiez que `VITE_API_URL` est correctement configuré
4. Vérifiez les logs Lambda dans CloudWatch

### Problème : CORS Error

**Solution** :
1. Vérifiez que l'API Gateway a bien les méthodes OPTIONS configurées
2. Redéployez l'API :
   - Console API Gateway → NatureMamaOrdersAPI → Resources → Actions → Deploy API

## 📝 Maintenance

### Mettre à jour le code Lambda

1. Modifiez `backend/lambda/orderHandler.js`
2. Recréez le ZIP :
```bash
cd backend/lambda
zip -r lambda-function.zip orderHandler.js node_modules package.json
```
3. Uploadez dans Lambda Console

### Mettre à jour le frontend

1. Faites vos modifications
2. Committez et poussez :
```bash
git add .
git commit -m "Update frontend"
git push
```
3. Amplify redéploie automatiquement !

## 💰 Coûts Estimés

Avec un trafic modéré (100 commandes/mois) :
- **Lambda** : ~0.20$ / mois
- **API Gateway** : ~0.35$ / mois
- **DynamoDB** : ~0.25$ / mois (mode on-demand)
- **SES** : 0.10$ / 1000 emails
- **Amplify** : ~15$ / mois (hébergement)

**Total estimé** : ~16$ / mois

## 🎉 Félicitations !

Votre site e-commerce NatureMama Heritage est maintenant en ligne avec :
- ✅ Panier fonctionnel
- ✅ Formulaire de commande validé
- ✅ Emails de confirmation automatiques
- ✅ Stockage des commandes dans DynamoDB
- ✅ Infrastructure scalable et sécurisée

Pour toute question, consultez la documentation AWS ou les logs CloudWatch.
