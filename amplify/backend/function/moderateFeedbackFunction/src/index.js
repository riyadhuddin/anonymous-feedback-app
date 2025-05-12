/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_ANONYMOUSFEEDBACKAPP_GRAPHQLAPIIDOUTPUT
	API_ANONYMOUSFEEDBACKAPP_GRAPHQLAPIENDPOINTOUTPUT
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const comprehend = new AWS.Comprehend();
const redis = require('redis');
const { promisify } = require('util');

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const MAX_REQUESTS_PER_IP = 10; // Maximum 10 requests per hour per IP

// Initialize Redis client for rate limiting
// In a real implementation, you would use ElastiCache or another Redis service
// For this example, we'll simulate rate limiting with in-memory storage
const ipRequestCounts = {};

// Banned words list (this would be more comprehensive in a real app)
const BANNED_WORDS = [
  'offensive',
  'inappropriate',
  'slur',
  // Add more banned words here
];

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    // Extract the message from the event
    const message = event.arguments.message;
    
    // Get IP address for rate limiting (in a real app, this would come from the request)
    // For this example, we'll use a placeholder
    const ipAddress = event.identity?.sourceIp || 'unknown';
    
    // Check rate limit
    const isRateLimited = checkRateLimit(ipAddress);
    if (isRateLimited) {
      return {
        isApproved: false,
        moderatedMessage: null,
        reason: 'Rate limit exceeded. Please try again later.'
      };
    }
    
    // Check for banned words
    const containsBannedWords = checkForBannedWords(message);
    if (containsBannedWords) {
      return {
        isApproved: false,
        moderatedMessage: null,
        reason: 'Your message contains inappropriate language.'
      };
    }
    
    // Use Amazon Comprehend for sentiment analysis
    const sentimentResult = await analyzeSentiment(message);
    
    // If sentiment is very negative, flag it
    if (sentimentResult.Sentiment === 'NEGATIVE' && sentimentResult.SentimentScore.Negative > 0.8) {
      return {
        isApproved: false,
        moderatedMessage: null,
        reason: 'Your message was flagged for extremely negative content.'
      };
    }
    
    // Message passed all checks
    return {
      isApproved: true,
      moderatedMessage: message,
      reason: null
    };
  } catch (error) {
    console.error('Error in moderation function:', error);
    
    // Default to approving the message if there's an error in the moderation service
    // In a production environment, you might want to be more conservative
    return {
      isApproved: true,
      moderatedMessage: event.arguments.message,
      reason: null
    };
  }
};

// Function to check rate limit
function checkRateLimit(ipAddress) {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  
  // Initialize or get the request record for this IP
  if (!ipRequestCounts[ipAddress]) {
    ipRequestCounts[ipAddress] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  }
  
  // Check if the window has expired and reset if needed
  if (now > ipRequestCounts[ipAddress].resetTime) {
    ipRequestCounts[ipAddress] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  }
  
  // Increment the count
  ipRequestCounts[ipAddress].count += 1;
  
  // Check if rate limit is exceeded
  return ipRequestCounts[ipAddress].count > MAX_REQUESTS_PER_IP;
}

// Function to check for banned words
function checkForBannedWords(message) {
  const lowerCaseMessage = message.toLowerCase();
  return BANNED_WORDS.some(word => lowerCaseMessage.includes(word));
}

// Function to analyze sentiment using Amazon Comprehend
async function analyzeSentiment(message) {
  const params = {
    LanguageCode: 'en',
    Text: message
  };
  
  try {
    return await comprehend.detectSentiment(params).promise();
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // Return a neutral sentiment if Comprehend fails
    return {
      Sentiment: 'NEUTRAL',
      SentimentScore: {
        Positive: 0,
        Negative: 0,
        Neutral: 1,
        Mixed: 0
      }
    };
  }
}
