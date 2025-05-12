# Setting Up the Anonymous Feedback App

This guide will walk you through the process of setting up the Anonymous Feedback App using AWS Amplify.

## Prerequisites

1. Node.js 18.x or later
2. AWS Account
3. AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)

## Step 1: Initialize the Project

First, clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd anonymous-feedback-app
npm install
```

## Step 2: Initialize Amplify

```bash
amplify init
```

Follow the prompts:
- Enter a name for the project (e.g., anonymousFeedbackApp)
- Choose your default editor
- Choose JavaScript as the type of app
- Choose React as the framework
- Choose the source directory path (default: src)
- Choose the distribution directory path (default: .next)
- Choose the build command (default: npm run-script build)
- Choose the start command (default: npm run-script start)

## Step 3: Add Authentication

```bash
amplify add auth
```

Follow the prompts:
- Choose default configuration with social provider (if you want social logins)
- Select the sign-in method (Username or Email)
- Configure advanced settings as needed

## Step 4: Add API (GraphQL)

```bash
amplify add api
```

Follow the prompts:
- Choose GraphQL
- Provide API name (e.g., anonymousFeedbackAPI)
- Choose authorization type (Amazon Cognito User Pool)
- Choose the schema template (Single object with fields)
- Do you want to edit the schema now? (Y)

Replace the default schema with the content from `models/schema.graphql`.

## Step 5: Add Lambda Function for Moderation

```bash
amplify add function
```

Follow the prompts:
- Provide a function name (e.g., moderateFeedbackFunction)
- Choose Node.js runtime
- Choose function template (Hello World)
- Do you want to configure advanced settings? (Y)
- Configure environment variables, access to other resources, etc.

Replace the function code with the content from `amplify/backend/function/moderateFeedbackFunction/src/index.js`.

## Step 6: Push to AWS

```bash
amplify push
```

This will create all the necessary resources in your AWS account.

## Step 7: Update GraphQL Schema

After the initial push, you may need to update the GraphQL schema to include the Lambda function:

1. Edit the schema in `amplify/backend/api/anonymousFeedbackAPI/schema.graphql`
2. Add the Query type for the moderation function
3. Run `amplify push` again

## Step 8: Generate GraphQL Code

```bash
amplify codegen
```

This will generate the necessary TypeScript types and GraphQL operations.

## Step 9: Start the Development Server

```bash
npm run dev
```

Your app should now be running at http://localhost:3000.

## Step 10: Deploy to Amplify Hosting

```bash
amplify add hosting
```

Follow the prompts to set up hosting with Amplify Console.

```bash
amplify publish
```

This will deploy your app to Amplify Hosting.

## Additional Configuration

### Social Login

If you want to add social login providers (Google, Facebook, etc.):

```bash
amplify update auth
```

Follow the prompts to add social providers.

### Custom Domain

To add a custom domain:

1. Go to the AWS Amplify Console
2. Select your app
3. Go to "Domain Management"
4. Follow the steps to add your custom domain
