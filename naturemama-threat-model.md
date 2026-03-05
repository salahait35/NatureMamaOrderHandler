# Comprehensive Threat Model Report

**Generated**: 2026-03-02 13:08:57
**Current Phase**: 1 - Business Context Analysis
**Overall Completion**: 80.0%

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Context](#business-context)
3. [System Architecture](#system-architecture)
4. [Threat Actors](#threat-actors)
5. [Trust Boundaries](#trust-boundaries)
6. [Assets and Flows](#assets-and-flows)
7. [Threats](#threats)
8. [Mitigations](#mitigations)
9. [Assumptions](#assumptions)
10. [Phase Progress](#phase-progress)

## Executive Summary

NatureMama Heritage is a French e-commerce platform selling natural dietary supplements (compléments alimentaires). Built with a React/Vite frontend hosted on AWS Amplify, and a serverless backend using AWS API Gateway, Lambda (Node.js 20.x), DynamoDB, and SES. The platform processes customer orders including PII (name, email, address, phone) and sends branded confirmation emails. No payment processing is integrated — orders are placed without credit card handling. The target audience is affluent urban French consumers (CSP+, ages 25-55). Products range from €25-45 per month treatment across 4 product lines (Vitalité, Sérénité, Immunité, Enfants).

### Key Statistics

- **Total Threats**: 14
- **Total Mitigations**: 16
- **Total Assumptions**: 6
- **System Components**: 7
- **Assets**: 12
- **Threat Actors**: 11

## Business Context

**Description**: NatureMama Heritage is a French e-commerce platform selling natural dietary supplements (compléments alimentaires). Built with a React/Vite frontend hosted on AWS Amplify, and a serverless backend using AWS API Gateway, Lambda (Node.js 20.x), DynamoDB, and SES. The platform processes customer orders including PII (name, email, address, phone) and sends branded confirmation emails. No payment processing is integrated — orders are placed without credit card handling. The target audience is affluent urban French consumers (CSP+, ages 25-55). Products range from €25-45 per month treatment across 4 product lines (Vitalité, Sérénité, Immunité, Enfants).

### Business Features

- **Industry Sector**: Retail
- **Data Sensitivity**: Confidential
- **User Base Size**: Small
- **Geographic Scope**: National
- **Regulatory Requirements**: GDPR
- **System Criticality**: Medium
- **Financial Impact**: Medium
- **Authentication Requirement**: None
- **Deployment Environment**: Cloud-Public
- **Integration Complexity**: Limited

## System Architecture

### Components

| ID | Name | Type | Service Provider | Description |
|---|---|---|---|---|
| C001 | React Frontend (Vite) | Compute | AWS | Single-page React application serving the e-commerce storefront. Includes product catalog, shopping cart (localStorage), checkout form with validation, and order submission. Hosted on AWS Amplify with CloudFront CDN and automatic HTTPS. |
| C002 | API Gateway | Network | AWS | REST API (NatureMamaOrdersAPI) with a single POST /orders endpoint and OPTIONS for CORS preflight. Uses AWS_PROXY integration with Lambda. No authentication, no API key, no rate limiting, no WAF. CORS allows all origins (*). |
| C003 | Lambda Order Handler | Compute | AWS | Serverless function (NatureMamaOrderHandler) that processes orders: validates input, generates order number (NMH-{timestamp}-{random}), saves to DynamoDB, sends confirmation email via SES. 256MB memory, 30s timeout. Returns verbose error messages including error.message. |
| C004 | DynamoDB Orders Table | Storage | AWS | NoSQL table (NatureMamaOrders) storing all order data including customer PII (fullName, email, street, postalCode, city, phone), order items, total, date, and status. Primary key is orderNumber (String). Pay-per-request billing. DynamoDB Streams enabled. No explicit encryption at rest configured in CloudFormation. |
| C005 | SES Email Service | Compute | AWS | Simple Email Service used to send branded HTML order confirmation emails to customers. Sends from a verified sender email (contact@naturemamaheritage.com). Emails contain full order details including customer PII and delivery address. May be in sandbox mode. |
| C006 | CloudWatch Logging | Compute | AWS | Lambda execution logs including full event payloads (console.log of entire event with customer PII). API Gateway access logs not explicitly configured. |
| C007 | Customer Browser | Compute | N/A | End-user web browser running the React SPA. Stores cart data in localStorage. Submits order data via HTTPS POST to API Gateway. Performs client-side form validation (email format, French phone format, postal code). |

### Connections

| ID | Source | Destination | Protocol | Port | Encrypted | Description |
|---|---|---|---|---|---|---|
| CN001 | C007 | C002 | HTTPS | 443 | Yes | Customer browser submits order data (customer PII + cart items + total) to API Gateway via HTTPS POST /orders |
| CN002 | C003 | C004 | HTTPS | 443 | Yes | Lambda writes order data (PII + items + total) to DynamoDB via PutItem |
| CN003 | C003 | C005 | HTTPS | 443 | Yes | Lambda sends branded HTML confirmation email via SES containing order details and customer PII |
| CN004 | C005 | C007 | SMTP | 25 | No | SES delivers confirmation email to customer's email inbox (may traverse untrusted SMTP relays) |
| CN005 | C001 | C007 | HTTPS | 443 | Yes | Customer browser loads React SPA from Amplify/CloudFront CDN |
| CN006 | C003 | C006 | HTTPS | N/A | Yes | Lambda logs full event payloads (including customer PII) to CloudWatch |
| CN007 | C002 | C003 | HTTPS | N/A | Yes | API Gateway invokes Lambda function via AWS_PROXY integration, passing full HTTP event |

### Data Stores

| ID | Name | Type | Classification | Encrypted at Rest | Description |
|---|---|---|---|---|---|
| D001 | CloudWatch Logs | Object Storage | Internal | Yes | Lambda execution logs containing full event payloads with customer PII (console.log of entire event object). No explicit retention policy configured. |
| D002 | Browser localStorage (Cart) | Object Storage | Internal | No | Browser localStorage storing cart data (product IDs, names, prices, quantities) under key 'naturemama-cart'. Persists across sessions. No encryption. |
| D003 | NatureMamaOrders DynamoDB Table | NoSQL | Confidential | No | DynamoDB table storing customer PII (fullName, email, street, postalCode, city, phone), order items, totals, dates, and status. Primary key: orderNumber. No explicit encryption at rest in CloudFormation template. No backups configured. |

## Threat Actors

### Insider

- **Type**: ThreatActorType.INSIDER
- **Capability Level**: CapabilityLevel.MEDIUM
- **Motivations**: Financial, Revenge
- **Resources**: ResourceLevel.LIMITED
- **Relevant**: Yes
- **Priority**: 3/10
- **Description**: An employee or contractor with legitimate access to the system

### External Attacker

- **Type**: ThreatActorType.EXTERNAL
- **Capability Level**: CapabilityLevel.MEDIUM
- **Motivations**: Financial
- **Resources**: ResourceLevel.MODERATE
- **Relevant**: Yes
- **Priority**: 2/10
- **Description**: An external individual or group attempting to gain unauthorized access

### Nation-state Actor

- **Type**: ThreatActorType.NATION_STATE
- **Capability Level**: CapabilityLevel.HIGH
- **Motivations**: Espionage, Political
- **Resources**: ResourceLevel.EXTENSIVE
- **Relevant**: No
- **Priority**: 1/10
- **Description**: A government-sponsored group with advanced capabilities

### Hacktivist

- **Type**: ThreatActorType.HACKTIVIST
- **Capability Level**: CapabilityLevel.MEDIUM
- **Motivations**: Ideology, Political
- **Resources**: ResourceLevel.MODERATE
- **Relevant**: No
- **Priority**: 6/10
- **Description**: An individual or group motivated by ideological or political beliefs

### Organized Crime

- **Type**: ThreatActorType.ORGANIZED_CRIME
- **Capability Level**: CapabilityLevel.HIGH
- **Motivations**: Financial
- **Resources**: ResourceLevel.EXTENSIVE
- **Relevant**: No
- **Priority**: 2/10
- **Description**: A criminal organization with significant resources

### Competitor

- **Type**: ThreatActorType.COMPETITOR
- **Capability Level**: CapabilityLevel.MEDIUM
- **Motivations**: Financial, Espionage
- **Resources**: ResourceLevel.MODERATE
- **Relevant**: Yes
- **Priority**: 4/10
- **Description**: A business competitor seeking competitive advantage

### Script Kiddie

- **Type**: ThreatActorType.SCRIPT_KIDDIE
- **Capability Level**: CapabilityLevel.LOW
- **Motivations**: Curiosity, Reputation
- **Resources**: ResourceLevel.LIMITED
- **Relevant**: Yes
- **Priority**: 1/10
- **Description**: An inexperienced attacker using pre-made tools

### Disgruntled Employee

- **Type**: ThreatActorType.DISGRUNTLED_EMPLOYEE
- **Capability Level**: CapabilityLevel.MEDIUM
- **Motivations**: Revenge
- **Resources**: ResourceLevel.LIMITED
- **Relevant**: Yes
- **Priority**: 4/10
- **Description**: A current or former employee with a grievance

### Privileged User

- **Type**: ThreatActorType.PRIVILEGED_USER
- **Capability Level**: CapabilityLevel.HIGH
- **Motivations**: Financial, Accidental
- **Resources**: ResourceLevel.MODERATE
- **Relevant**: Yes
- **Priority**: 8/10
- **Description**: A user with elevated privileges who may abuse them or make mistakes

### Third Party

- **Type**: ThreatActorType.THIRD_PARTY
- **Capability Level**: CapabilityLevel.MEDIUM
- **Motivations**: Financial, Accidental
- **Resources**: ResourceLevel.MODERATE
- **Relevant**: Yes
- **Priority**: 10/10
- **Description**: A vendor, partner, or service provider with access to the system

### Spam Bot / Order Abuser

- **Type**: ThreatActorType.EXTERNAL
- **Capability Level**: CapabilityLevel.LOW
- **Motivations**: Disruption, Financial
- **Resources**: ResourceLevel.LIMITED
- **Relevant**: Yes
- **Priority**: 1/10
- **Description**: Automated bots or scripts that submit fake orders to the unauthenticated API endpoint, flooding DynamoDB with junk data and triggering mass SES emails

## Trust Boundaries

### Trust Zones

#### Internet

- **Trust Level**: TrustLevel.UNTRUSTED
- **Description**: The public internet, considered untrusted

#### DMZ

- **Trust Level**: TrustLevel.LOW
- **Description**: Demilitarized zone for public-facing services

#### Application

- **Trust Level**: TrustLevel.MEDIUM
- **Description**: Zone containing application servers and services

#### Data

- **Trust Level**: TrustLevel.HIGH
- **Description**: Zone containing databases and data storage

#### Admin

- **Trust Level**: TrustLevel.FULL
- **Description**: Administrative zone with highest privileges

#### Internet / Public Zone

- **Trust Level**: TrustLevel.UNTRUSTED
- **Description**: Public internet zone including customer browsers and any external entity. Completely untrusted. No authentication required to interact with the system.

#### AWS Edge / API Layer

- **Trust Level**: TrustLevel.LOW
- **Description**: AWS-managed edge services including API Gateway and Amplify/CloudFront. Partially trusted — managed by AWS but exposed to the internet with no authentication.

#### AWS Compute Layer

- **Trust Level**: TrustLevel.MEDIUM
- **Description**: AWS serverless compute layer including Lambda function. Medium trust — IAM-controlled access, processes untrusted input from API Gateway.

#### AWS Data / Services Layer

- **Trust Level**: TrustLevel.HIGH
- **Description**: AWS data and messaging services including DynamoDB, SES, and CloudWatch. High trust — IAM-controlled, stores sensitive PII data.

### Trust Boundaries

#### Internet Boundary

- **Type**: BoundaryType.NETWORK
- **Controls**: Web Application Firewall, DDoS Protection, TLS Encryption
- **Description**: Boundary between the internet and internal systems

#### DMZ Boundary

- **Type**: BoundaryType.NETWORK
- **Controls**: Network Firewall, Intrusion Detection System, API Gateway
- **Description**: Boundary between public-facing services and internal applications

#### Data Boundary

- **Type**: BoundaryType.NETWORK
- **Controls**: Database Firewall, Encryption, Access Control Lists
- **Description**: Boundary protecting data storage systems

#### Admin Boundary

- **Type**: BoundaryType.NETWORK
- **Controls**: Privileged Access Management, Multi-Factor Authentication, Audit Logging
- **Description**: Boundary for administrative access

#### Internet to AWS Edge Boundary

- **Type**: BoundaryType.NETWORK
- **Controls**: HTTPS/TLS, CORS (wildcard - weak)
- **Description**: Boundary between public internet and AWS edge services. No authentication, no rate limiting, no WAF. Only protection is HTTPS encryption in transit.

#### AWS to External Email Boundary

- **Type**: BoundaryType.NETWORK
- **Controls**: DKIM signing (SES), SPF records
- **Description**: Boundary where SES sends emails to external email infrastructure. Email content contains PII in plaintext HTML. SMTP may traverse untrusted relays.

#### API to Compute Boundary

- **Type**: BoundaryType.PROCESS
- **Controls**: IAM Role, Lambda Permission Resource Policy
- **Description**: Boundary between API Gateway and Lambda compute. Protected by IAM and Lambda resource policy.

#### Compute to Data Services Boundary

- **Type**: BoundaryType.PROCESS
- **Controls**: IAM Policy (least privilege), Resource-scoped permissions
- **Description**: Boundary between Lambda compute and AWS data services (DynamoDB, SES, CloudWatch). Protected by IAM policies with resource-scoped permissions.

## Assets and Flows

### Assets

| ID | Name | Type | Classification | Sensitivity | Criticality | Owner |
|---|---|---|---|---|---|---|
| A001 | User Credentials | AssetType.CREDENTIAL | AssetClassification.CONFIDENTIAL | 5 | 5 | N/A |
| A002 | Personal Identifiable Information | AssetType.DATA | AssetClassification.CONFIDENTIAL | 4 | 4 | N/A |
| A003 | Session Token | AssetType.TOKEN | AssetClassification.CONFIDENTIAL | 5 | 5 | N/A |
| A004 | Configuration Data | AssetType.CONFIG | AssetClassification.INTERNAL | 3 | 4 | N/A |
| A005 | Encryption Keys | AssetType.KEY | AssetClassification.RESTRICTED | 5 | 5 | N/A |
| A006 | Public Content | AssetType.DATA | AssetClassification.PUBLIC | 1 | 2 | N/A |
| A007 | Audit Logs | AssetType.DATA | AssetClassification.INTERNAL | 3 | 4 | N/A |
| A008 | Customer PII | AssetType.DATA | AssetClassification.CONFIDENTIAL | 5 | 4 | Business Owner |
| A009 | Order Data | AssetType.DATA | AssetClassification.INTERNAL | 3 | 3 | Business Owner |
| A010 | Email Content (Confirmation) | AssetType.DATA | AssetClassification.INTERNAL | 4 | 3 | Business Owner |
| A011 | Cart Data (localStorage) | AssetType.DATA | AssetClassification.INTERNAL | 1 | 2 | Customer |
| A012 | AWS IAM Credentials / Roles | AssetType.CREDENTIAL | AssetClassification.RESTRICTED | 5 | 5 | DevOps |

### Asset Flows

| ID | Asset | Source | Destination | Protocol | Encrypted | Risk Level |
|---|---|---|---|---|---|---|
| F001 | User Credentials | C001 | C002 | HTTPS | Yes | 4 |
| F002 | Session Token | C002 | C001 | HTTPS | Yes | 3 |
| F003 | Personal Identifiable Information | C003 | C004 | TLS | Yes | 3 |
| F004 | Audit Logs | C003 | C005 | TLS | Yes | 2 |

## Threats

### Identified Threats

#### T1: External attacker

**Statement**: A External attacker with ability to craft HTTP requests to the public API endpoint can manipulate order data by sending crafted JSON payloads with negative prices, zero totals, or excessively large quantities to bypass minimal server-side validation, which leads to orders stored with manipulated prices/totals, business logic bypass, potential financial loss if payment is later reconciled against stored totals

- **Prerequisites**: with ability to craft HTTP requests to the public API endpoint
- **Action**: manipulate order data by sending crafted JSON payloads with negative prices, zero totals, or excessively large quantities to bypass minimal server-side validation
- **Impact**: orders stored with manipulated prices/totals, business logic bypass, potential financial loss if payment is later reconciled against stored totals
- **Impacted Assets**: A008, A009
- **Tags**: STRIDE-T, Input Validation, API

#### T2: Malicious customer or fraudster

**Statement**: A Malicious customer or fraudster after placing an order through the anonymous checkout can deny having placed an order since there is no user authentication, no digital signature, and no IP address logging tied to orders, which leads to inability to prove order origin, potential disputes, no audit trail linking orders to specific users or sessions

- **Prerequisites**: after placing an order through the anonymous checkout
- **Action**: deny having placed an order since there is no user authentication, no digital signature, and no IP address logging tied to orders
- **Impact**: inability to prove order origin, potential disputes, no audit trail linking orders to specific users or sessions
- **Impacted Assets**: A008, A009
- **Tags**: STRIDE-R, Logging, Non-repudiation

#### T3: Network eavesdropper or compromised email relay

**Statement**: A Network eavesdropper or compromised email relay with ability to intercept SMTP traffic between SES and recipient mail server can intercept confirmation emails containing customer PII (name, address, phone, order details) as they traverse external SMTP relays in plaintext HTML, which leads to exposure of customer PII and order details during email transit, no end-to-end encryption on email content

- **Prerequisites**: with ability to intercept SMTP traffic between SES and recipient mail server
- **Action**: intercept confirmation emails containing customer PII (name, address, phone, order details) as they traverse external SMTP relays in plaintext HTML
- **Impact**: exposure of customer PII and order details during email transit, no end-to-end encryption on email content
- **Impacted Assets**: A008, A010
- **Tags**: STRIDE-I, Email, PII, SMTP

#### T4: External attacker or automated bot

**Statement**: A External attacker or automated bot with access to the public API endpoint (no rate limiting, no authentication, no WAF) can flood the POST /orders endpoint with massive volumes of requests, exhausting Lambda concurrent executions, filling DynamoDB with junk data, and triggering excessive SES email sends, which leads to service unavailability, significant AWS cost spike (Lambda invocations, DynamoDB writes, SES sends), potential SES reputation damage and sending suspension

- **Prerequisites**: with access to the public API endpoint (no rate limiting, no authentication, no WAF)
- **Action**: flood the POST /orders endpoint with massive volumes of requests, exhausting Lambda concurrent executions, filling DynamoDB with junk data, and triggering excessive SES email sends
- **Impact**: service unavailability, significant AWS cost spike (Lambda invocations, DynamoDB writes, SES sends), potential SES reputation damage and sending suspension
- **Impacted Assets**: A009
- **Tags**: STRIDE-D, API, Rate Limiting, Cost

#### T5: Insider or attacker with compromised AWS credentials

**Statement**: A Insider or attacker with compromised AWS credentials with compromised AWS credentials or overly permissive IAM policies can access customer PII stored in DynamoDB without encryption at rest, or perform unauthorized Scan operations to exfiltrate all customer data (IAM policy grants Scan permission), which leads to mass exposure of all customer PII, GDPR breach notification required, reputational damage, potential regulatory fines

- **Prerequisites**: with compromised AWS credentials or overly permissive IAM policies
- **Action**: access customer PII stored in DynamoDB without encryption at rest, or perform unauthorized Scan operations to exfiltrate all customer data (IAM policy grants Scan permission)
- **Impact**: mass exposure of all customer PII, GDPR breach notification required, reputational damage, potential regulatory fines
- **Impacted Assets**: A008
- **Tags**: STRIDE-I, DynamoDB, Encryption, GDPR

#### T6: Malicious website operator

**Statement**: A Malicious website operator with knowledge of the API endpoint URL (discoverable from frontend JavaScript source) can craft requests from any origin due to wildcard CORS (Access-Control-Allow-Origin: *), enabling cross-site order submission from malicious websites, which leads to orders placed on behalf of unsuspecting users visiting malicious sites, SES used as email relay, brand reputation damage

- **Prerequisites**: with knowledge of the API endpoint URL (discoverable from frontend JavaScript source)
- **Action**: craft requests from any origin due to wildcard CORS (Access-Control-Allow-Origin: *), enabling cross-site order submission from malicious websites
- **Impact**: orders placed on behalf of unsuspecting users visiting malicious sites, SES used as email relay, brand reputation damage
- **Impacted Assets**: A008
- **Tags**: STRIDE-S, CORS, CSRF

#### T7: Sophisticated external attacker

**Statement**: A Sophisticated external attacker with ability to exploit a vulnerability in the Lambda function or its dependencies can exploit a vulnerability in Lambda dependencies (aws-sdk packages) or Node.js runtime to escalate privileges beyond the Lambda execution role, potentially accessing other AWS resources, which leads to unauthorized access to AWS account resources beyond the Lambda role scope, potential lateral movement within the AWS account

- **Prerequisites**: with ability to exploit a vulnerability in the Lambda function or its dependencies
- **Action**: exploit a vulnerability in Lambda dependencies (aws-sdk packages) or Node.js runtime to escalate privileges beyond the Lambda execution role, potentially accessing other AWS resources
- **Impact**: unauthorized access to AWS account resources beyond the Lambda role scope, potential lateral movement within the AWS account
- **Impacted Assets**: A012
- **Tags**: STRIDE-E, Lambda, IAM, Supply Chain

#### T8: External attacker

**Statement**: A External attacker with ability to send crafted JSON to the API endpoint can inject malicious HTML/JavaScript into customer name, address, or other fields that are directly interpolated into the confirmation email HTML template without sanitization, which leads to stored XSS in confirmation emails, potential phishing via branded NatureMama emails, email client exploitation

- **Prerequisites**: with ability to send crafted JSON to the API endpoint
- **Action**: inject malicious HTML/JavaScript into customer name, address, or other fields that are directly interpolated into the confirmation email HTML template without sanitization
- **Impact**: stored XSS in confirmation emails, potential phishing via branded NatureMama emails, email client exploitation
- **Impacted Assets**: A008, A009
- **Tags**: STRIDE-T, Injection, XSS, Email

#### T9: External attacker or spam bot

**Statement**: A External attacker or spam bot with ability to submit orders with arbitrary email addresses can abuse the SES email sending capability by submitting orders with victim email addresses, using the system as an email relay to send branded NatureMama emails to arbitrary recipients, which leads to SES reputation damage, potential SES sending suspension, brand used for spam/phishing, SES bounce rate increase, AWS account flagged

- **Prerequisites**: with ability to submit orders with arbitrary email addresses
- **Action**: abuse the SES email sending capability by submitting orders with victim email addresses, using the system as an email relay to send branded NatureMama emails to arbitrary recipients
- **Impact**: SES reputation damage, potential SES sending suspension, brand used for spam/phishing, SES bounce rate increase, AWS account flagged
- **Impacted Assets**: A008
- **Tags**: STRIDE-S, SES, Email Abuse, Spam

#### T10: External attacker

**Statement**: A External attacker with knowledge that order numbers follow a predictable pattern (NMH-{timestamp}-{random with only 4 digits}) can predict or enumerate order numbers due to the weak generation algorithm (timestamp + 4-digit random), potentially enabling order lookup or manipulation if future read endpoints are added, which leads to order enumeration, potential unauthorized access to order details if read APIs are added later, weak non-repudiation

- **Prerequisites**: with knowledge that order numbers follow a predictable pattern (NMH-{timestamp}-{random with only 4 digits})
- **Action**: predict or enumerate order numbers due to the weak generation algorithm (timestamp + 4-digit random), potentially enabling order lookup or manipulation if future read endpoints are added
- **Impact**: order enumeration, potential unauthorized access to order details if read APIs are added later, weak non-repudiation
- **Impacted Assets**: A008
- **Tags**: STRIDE-T, Order Number, Predictability

#### T11: External attacker

**Statement**: A External attacker by sending a malformed request that triggers a Lambda error can extract internal system information from verbose error responses that include error.message in the JSON response body, which leads to disclosure of internal error details, stack traces, AWS service names, and potentially sensitive configuration information that aids further attacks

- **Prerequisites**: by sending a malformed request that triggers a Lambda error
- **Action**: extract internal system information from verbose error responses that include error.message in the JSON response body
- **Impact**: disclosure of internal error details, stack traces, AWS service names, and potentially sensitive configuration information that aids further attacks
- **Impacted Assets**: A008
- **Tags**: STRIDE-I, Error Handling, Information Leakage

#### T12: Spam bot or malicious script

**Statement**: A Spam bot or malicious script with access to the API Gateway URL (publicly discoverable in frontend source code) can submit fake orders with fabricated customer data to the unauthenticated POST /orders endpoint, flooding DynamoDB and triggering SES emails to arbitrary addresses, which leads to DynamoDB flooded with fake orders, SES used to send spam emails to arbitrary addresses, increased AWS costs, data integrity compromised

- **Prerequisites**: with access to the API Gateway URL (publicly discoverable in frontend source code)
- **Action**: submit fake orders with fabricated customer data to the unauthenticated POST /orders endpoint, flooding DynamoDB and triggering SES emails to arbitrary addresses
- **Impact**: DynamoDB flooded with fake orders, SES used to send spam emails to arbitrary addresses, increased AWS costs, data integrity compromised
- **Impacted Assets**: A008
- **Tags**: STRIDE-S, API, Authentication

#### T13: Insider or AWS account user

**Statement**: A Insider or AWS account user with access to CloudWatch logs (any AWS user with logs:GetLogEvents permission) can access customer PII (name, email, address, phone) from CloudWatch logs where the Lambda function logs the entire event payload via console.log, which leads to exposure of customer PII in logs, GDPR violation, no log retention policy means PII persists indefinitely

- **Prerequisites**: with access to CloudWatch logs (any AWS user with logs:GetLogEvents permission)
- **Action**: access customer PII (name, email, address, phone) from CloudWatch logs where the Lambda function logs the entire event payload via console.log
- **Impact**: exposure of customer PII in logs, GDPR violation, no log retention policy means PII persists indefinitely
- **Impacted Assets**: A008
- **Tags**: STRIDE-I, PII, Logging, GDPR

#### T14: Regulatory authority or data subject

**Statement**: A Regulatory authority or data subject given that no data retention or deletion mechanism exists can violate GDPR right to erasure (Article 17) as there is no mechanism to delete customer PII from DynamoDB, CloudWatch logs, or SES delivery records, which leads to GDPR non-compliance, potential regulatory fines up to 4% of annual turnover, inability to honor data subject access requests

- **Prerequisites**: given that no data retention or deletion mechanism exists
- **Action**: violate GDPR right to erasure (Article 17) as there is no mechanism to delete customer PII from DynamoDB, CloudWatch logs, or SES delivery records
- **Impact**: GDPR non-compliance, potential regulatory fines up to 4% of annual turnover, inability to honor data subject access requests
- **Impacted Assets**: A008
- **Tags**: STRIDE-I, GDPR, Data Retention, Right to Erasure

## Mitigations

### Identified Mitigations

#### M1: Implement API Gateway usage plan with API key requirement and throttling (rate limiting). Configure burst limit of 50 requests/second and sustained rate of 20 requests/second.

**Addresses Threats**: T12, T4, T9

#### M2: Restrict CORS to the specific Amplify frontend domain instead of wildcard (*). Set Access-Control-Allow-Origin to the actual production URL.

**Addresses Threats**: T6

#### M3: Implement comprehensive server-side input validation in Lambda: validate email format, phone format, postal code, sanitize all string fields, enforce maximum field lengths, validate price/quantity ranges, and recalculate total server-side.

**Addresses Threats**: T8, T1

#### M4: Sanitize all user-provided data before interpolating into HTML email templates. Use HTML entity encoding for customer name, address, and all other user-controlled fields.

**Addresses Threats**: T8

#### M5: Enable DynamoDB encryption at rest using AWS-managed KMS key (SSESpecification). Add SSESpecification with SSEEnabled: true to the CloudFormation template.

**Addresses Threats**: T5

#### M6: Remove verbose error messages from API responses. Replace error.message with generic error messages in the Lambda catch block. Log detailed errors only to CloudWatch.

**Addresses Threats**: T11

#### M7: Remove PII from CloudWatch logs. Stop logging the full event payload. Instead, log only order number, timestamp, and status. Implement structured logging with PII redaction.

**Addresses Threats**: T13, T14

#### M8: Deploy AWS WAF on API Gateway with managed rule groups: AWSManagedRulesCommonRuleSet, AWSManagedRulesBotControlRuleSet, and rate-based rules to block abusive IPs.

**Addresses Threats**: T12, T4, T6, T9

#### M9: Use cryptographically secure order number generation (UUID v4 or crypto.randomUUID()) instead of timestamp + 4-digit random number to prevent order enumeration.

**Addresses Threats**: T10

#### M10: Implement GDPR compliance mechanisms: data retention policy, right to erasure API endpoint, data subject access request handling, and privacy policy documentation.

**Addresses Threats**: T14

#### M11: Implement email sending rate limiting and recipient validation in Lambda. Limit to verified email domains, add CAPTCHA or honeypot to the checkout form to prevent automated abuse.

**Addresses Threats**: T12, T9

#### M12: Restrict SES IAM policy to specific verified sender identity ARN instead of wildcard Resource: '*'. Scope SES permissions to the verified sender email only.

**Addresses Threats**: T9

#### M13: Enable DynamoDB Point-in-Time Recovery (PITR) for data backup and recovery. Add PointInTimeRecoverySpecification to CloudFormation template.

**Addresses Threats**: T5

#### M14: Log source IP address, user-agent, and request ID with each order for non-repudiation and audit trail. Enable API Gateway access logging.

**Addresses Threats**: T2

#### M15: Remove unnecessary DynamoDB Scan permission from Lambda IAM role. The function only needs PutItem for order creation. Remove GetItem, Query, and Scan to follow least privilege.

**Addresses Threats**: T5, T7

#### M16: Configure SES with DKIM, SPF, and DMARC records for the sender domain. Enable TLS enforcement for outbound email delivery where supported by recipient mail servers.

**Addresses Threats**: T3

## Assumptions

### A001: Authentication

**Description**: No payment processing is handled by the application — no credit card or financial transaction data flows through the system

- **Impact**: Eliminates PCI-DSS compliance requirements and reduces financial data exposure risk significantly
- **Rationale**: The checkout flow collects customer info and order details but does not integrate with any payment gateway (Stripe, PayPal, etc.)

### A002: Authentication

**Description**: No user authentication or account system exists — all orders are placed anonymously via a public API endpoint

- **Impact**: The API is fully open to the internet with no authentication, making it vulnerable to abuse and spam orders
- **Rationale**: The API Gateway POST /orders endpoint has AuthorizationType: NONE and no API key requirement

### A003: Network

**Description**: CORS is configured with wildcard origin (Access-Control-Allow-Origin: *) allowing any website to call the API

- **Impact**: Any malicious website can submit orders to the API, enabling cross-site request abuse
- **Rationale**: Both the Lambda function headers and API Gateway OPTIONS method return wildcard CORS headers

### A004: AWS Services

**Description**: Customer PII (name, email, address, phone) is stored in DynamoDB without encryption at rest explicitly configured

- **Impact**: Data at rest may not be encrypted, increasing risk of data exposure if DynamoDB access is compromised
- **Rationale**: The CloudFormation template does not specify SSESpecification for the DynamoDB table

### A005: Network

**Description**: The application operates under GDPR jurisdiction as it targets French consumers and collects PII

- **Impact**: Requires data protection measures, right to erasure capabilities, and breach notification procedures
- **Rationale**: The site is in French, targets CSP+ urban consumers in France, and collects personal data including name, email, address, and phone

### A006: AWS Services

**Description**: SES may be in sandbox mode, limiting email delivery to verified addresses only

- **Impact**: Order confirmation emails may not reach customers unless SES production access is granted
- **Rationale**: The deployment guide mentions requesting production access as optional but recommended

## Phase Progress

| Phase | Name | Completion |
|---|---|---|
| 1 | Business Context Analysis | 100% ✅ |
| 2 | Architecture Analysis | 100% ✅ |
| 3 | Threat Actor Analysis | 100% ✅ |
| 4 | Trust Boundary Analysis | 100% ✅ |
| 5 | Asset Flow Analysis | 100% ✅ |
| 6 | Threat Identification | 100% ✅ |
| 7 | Mitigation Planning | 100% ✅ |
| 7.5 | Code Validation Analysis | 0% ⏳ |
| 8 | Residual Risk Analysis | 0% ⏳ |
| 9 | Output Generation and Documentation | 100% ✅ |

---

*This threat model report was generated automatically by the Threat Modeling MCP Server.*
