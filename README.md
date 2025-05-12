# Anonymous Feedback App

A full-stack web application built with Next.js 14 and AWS Amplify that allows users to receive anonymous feedback and respond to it.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: AWS Amplify (Auth, GraphQL API with DynamoDB, Lambda functions)
- **Deployment**: Amplify Hosting with GitHub integration (CI/CD)

## Features

- User authentication with AWS Cognito
- Public profile pages with anonymous feedback forms
- Private dashboard for viewing and responding to feedback
- Shareable response cards for social media
- Privacy-focused with no sender tracking
- Basic rate limiting and content moderation

## Getting Started

### Prerequisites

- Node.js 18.x or later
- AWS Account
- AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Amplify:
   ```bash
   amplify init
   ```
4. Add authentication:
   ```bash
   amplify add auth
   ```
5. Add API:
   ```bash
   amplify add api
   ```
6. Push to AWS:
   ```bash
   amplify push
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and Amplify configuration
- `/models`: GraphQL schema and generated models
- `/public`: Static assets
