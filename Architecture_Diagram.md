# Architecture Diagram - NatureMama Heritage E-Commerce

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         NATUREMAMA HERITAGE                                 │
│                      E-Commerce Architecture                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  FRONTEND LAYER (AWS Amplify)                                              │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  React Application (Vite)                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │    │
│  │  │   Home       │  │  Products    │  │   Cart       │            │    │
│  │  │   Page       │  │   Catalog    │  │   Checkout   │            │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │    │
│  │                                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │    │
│  │  │  Our Story   │  │ Commitments  │  │ Cart Context │            │    │
│  │  │   Page       │  │    Page      │  │  (State Mgmt)│            │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │    │
│  │                                                                     │    │
│  │  Hosted on: AWS Amplify                                            │    │
│  │  CDN: CloudFront (automatic)                                       │    │
│  │  SSL: Automatic HTTPS                                              │    │
│  │                                                                     │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS Request
                                    │ POST /orders
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  API LAYER (AWS API Gateway)                                               │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  REST API: NatureMamaOrdersAPI                                     │    │
│  │  Region: us-east-1                                                 │    │
│  │                                                                     │    │
│  │  Endpoints:                                                         │    │
│  │  ┌─────────────────────────────────────────────────────────┐      │    │
│  │  │  POST   /orders  → Process new order                    │      │    │
│  │  │  OPTIONS /orders → CORS preflight                       │      │    │
│  │  └─────────────────────────────────────────────────────────┘      │    │
│  │                                                                     │    │
│  │  Features:                                                          │    │
│  │  • CORS enabled (Access-Control-Allow-Origin: *)                  │    │
│  │  • Request validation                                              │    │
│  │  • AWS_PROXY integration with Lambda                              │    │
│  │                                                                     │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Invoke
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  COMPUTE LAYER (AWS Lambda)                                                │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  Function: NatureMamaOrderHandler                                  │    │
│  │  Runtime: Node.js 20.x                                             │    │
│  │  Memory: 256 MB                                                    │    │
│  │  Timeout: 30 seconds                                               │    │
│  │                                                                     │    │
│  │  Responsibilities:                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐      │    │
│  │  │  1. Validate order data                                 │      │    │
│  │  │  2. Generate unique order number                        │      │    │
│  │  │  3. Save order to DynamoDB                              │      │    │
│  │  │  4. Send confirmation email via SES                     │      │    │
│  │  │  5. Return success/error response                       │      │    │
│  │  └─────────────────────────────────────────────────────────┘      │    │
│  │                                                                     │    │
│  │  Environment Variables:                                             │    │
│  │  • ORDERS_TABLE: NatureMamaOrders                                 │    │
│  │  • SENDER_EMAIL: contact@naturemamaheritage.com                   │    │
│  │                                                                     │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                    │
                    │                                    │
                    ▼                                    ▼
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│                                  │    │                                  │
│  DATABASE LAYER                  │    │  EMAIL SERVICE                   │
│  (AWS DynamoDB)                  │    │  (AWS SES)                       │
│                                  │    │                                  │
│  ┌────────────────────────────┐ │    │  ┌────────────────────────────┐ │
│  │                            │ │    │  │                            │ │
│  │  Table: NatureMamaOrders   │ │    │  │  Verified Sender Email     │ │
│  │                            │ │    │  │                            │ │
│  │  Primary Key:              │ │    │  │  Sends HTML emails with:   │ │
│  │  • orderNumber (String)    │ │    │  │  • Order confirmation      │ │
│  │                            │ │    │  │  • Order details           │ │
│  │  Attributes:               │ │    │  │  • Customer info           │ │
│  │  • customer (Map)          │ │    │  │  • Branded design          │ │
│  │    - fullName              │ │    │  │                            │ │
│  │    - email                 │ │    │  │  Region: us-east-1         │ │
│  │    - street                │ │    │  │                            │ │
│  │    - postalCode            │ │    │  └────────────────────────────┘ │
│  │    - city                  │ │    │                │                 │
│  │    - phone                 │ │    │                │                 │
│  │  • items (List)            │ │    │                ▼                 │
│  │  • total (Number)          │ │    │  ┌────────────────────────────┐ │
│  │  • orderDate (String)      │ │    │  │                            │ │
│  │  • status (String)         │ │    │  │  Customer Email Inbox      │ │
│  │                            │ │    │  │                            │ │
│  │  Billing: Pay-per-request  │ │    │  │  ✓ Order Confirmation      │ │
│  │  Capacity: Auto-scaling    │ │    │  │  ✓ Order Number            │ │
│  │                            │ │    │  │  ✓ Items & Total           │ │
│  │                            │ │    │  │  ✓ Delivery Address        │ │
│  └────────────────────────────┘ │    │  │                            │ │
│                                  │    │  └────────────────────────────┘ │
└──────────────────────────────────┘    └──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SECURITY & IAM                                                            │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  IAM Role: NatureMamaLambdaExecutionRole                           │    │
│  │                                                                     │    │
│  │  Permissions:                                                       │    │
│  │  ┌─────────────────────────────────────────────────────────┐      │    │
│  │  │  • Lambda Basic Execution (CloudWatch Logs)             │      │    │
│  │  │  • DynamoDB: PutItem, GetItem, Query, Scan              │      │    │
│  │  │  • SES: SendEmail, SendRawEmail                         │      │    │
│  │  └─────────────────────────────────────────────────────────┘      │    │
│  │                                                                     │    │
│  │  Principle of Least Privilege: ✓                                  │    │
│  │  Resource-specific permissions: ✓                                 │    │
│  │                                                                     │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  MONITORING & LOGGING                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │  AWS CloudWatch                                                     │    │
│  │                                                                     │    │
│  │  • Lambda execution logs                                           │    │
│  │  • API Gateway access logs                                         │    │
│  │  • DynamoDB metrics                                                │    │
│  │  • SES delivery metrics                                            │    │
│  │  • Error tracking and alerts                                       │    │
│  │                                                                     │    │
│  └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════

DATA FLOW - Order Processing

1. Customer adds products to cart (stored in browser localStorage)
2. Customer fills checkout form with validation:
   • Full name (required)
   • Email (validated format)
   • Street address (required)
   • Postal code (5 digits)
   • City (required)
   • Phone (French format: 0612345678 or +33612345678)

3. Frontend sends POST request to API Gateway:
   {
     "customer": { ... },
     "items": [ ... ],
     "total": 99.99
   }

4. API Gateway invokes Lambda function

5. Lambda function:
   a. Validates request data
   b. Generates order number: NMH-{timestamp}-{random}
   c. Saves to DynamoDB
   d. Sends confirmation email via SES
   e. Returns success response

6. Frontend displays success message

7. Customer receives branded confirmation email

═══════════════════════════════════════════════════════════════════════════════

INFRASTRUCTURE AS CODE

All resources deployed via CloudFormation:
• Template: backend/cloudformation-template.yaml
• Stack Name: NatureMamaBackend
• Region: us-east-1
• Deployment: AWS Console or CLI

═══════════════════════════════════════════════════════════════════════════════

SCALABILITY & PERFORMANCE

• API Gateway: Auto-scales to handle traffic
• Lambda: Concurrent executions (up to 1000 default)
• DynamoDB: On-demand capacity, auto-scales
• Amplify: Global CDN via CloudFront
• SES: High throughput email delivery

═══════════════════════════════════════════════════════════════════════════════

COST OPTIMIZATION

• Lambda: Pay per invocation (free tier: 1M requests/month)
• DynamoDB: Pay per request (free tier: 25 GB storage)
• API Gateway: Pay per request (free tier: 1M requests/month)
• SES: $0.10 per 1,000 emails
• Amplify: ~$15/month for hosting

Estimated monthly cost for 100 orders: ~$16

═══════════════════════════════════════════════════════════════════════════════
```

## Architecture Highlights

### 1. Frontend (React + Vite)
- Modern, responsive design with Sage Green theme
- Cart management with React Context
- Form validation (email, phone, postal code)
- Deployed on AWS Amplify with automatic CI/CD

### 2. API Layer (API Gateway)
- RESTful API with CORS enabled
- Secure HTTPS endpoints
- Request/response validation
- Integration with Lambda

### 3. Business Logic (Lambda)
- Serverless compute
- Node.js 20.x runtime
- Order processing and validation
- Email generation with branded HTML

### 4. Data Storage (DynamoDB)
- NoSQL database
- Pay-per-request billing
- Automatic scaling
- Order number as primary key

### 5. Email Service (SES)
- Transactional emails
- HTML templates with brand design
- Verified sender identity
- Delivery tracking

### 6. Security
- IAM roles with least privilege
- HTTPS everywhere
- Input validation
- No hardcoded credentials

### 7. Monitoring
- CloudWatch Logs for debugging
- Metrics for performance tracking
- Error alerting capabilities

## Deployment Strategy

1. **Backend First**: Deploy CloudFormation stack
2. **Lambda Code**: Upload function code
3. **Frontend Config**: Set API URL in .env
4. **Frontend Deploy**: Push to Amplify

## Maintenance

- **Logs**: CloudWatch Logs for troubleshooting
- **Updates**: Lambda code updates via console or CLI
- **Scaling**: Automatic, no manual intervention
- **Backups**: DynamoDB point-in-time recovery (optional)
