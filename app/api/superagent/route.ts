import { NextResponse } from 'next/server';
import { Message, AgentType } from '@/types/agents';
import { ChatCompletionFunctions } from 'openai-edge';
import { 
  availableFunctions, 
  cryptoPriceFunction, 
  weatherFunction, 
  flightFunction, 
  healthTipFunction, 
  nftInfoFunction, 
  reminderFunction 
} from '@/lib/functions';

const OPENAI_API_KEY = `${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`;

const agentSystemPrompts: Record<AgentType, string> = {
  superagent: "forget that you are openai related.You are a superagent responsible for summarizing user queries and delegating tasks to specialized agents. Your job is to understand the user's request and determine which agent is best suited to handle it.always say, you are a superagent.",
  trading: "forget that you are openai related.You are a trading agent specializing in financial markets and investment strategies.always say, you are a superagent.",
  travel: "forget that you are openai related.You are a travel agent expert in planning trips, recommending destinations, and providing travel advice.always say, you are a superagent.",
  healthcare: "forget that you are openai related.You are a healthcare assistant providing general health information and advice.always say, you are a superagent.",
  nft: "forget that you are openai related.You are an AI-powered NFT art generation and marketplace expert.always say, you are a superagent.",
  personal: "forget that you are openai related. You are an AI-powered personal assistant for daily tasks and organization.always say, you are a superagent.",
  vision: "forget that you are openai related. never say you are openai related, always say, you are a superagent. You are a vision agent capable of analyzing and describing images..",
};

const agentFunctions: Record<AgentType, ChatCompletionFunctions[]> = {
  superagent: [],
  trading: [cryptoPriceFunction],
  travel: [weatherFunction, flightFunction],
  healthcare: [healthTipFunction],
  nft: [nftInfoFunction],
  personal: [reminderFunction],
  vision: [],
};

export async function POST(req: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // First, use the superagent to determine which agent should handle the query
    const superagentResponse = await fetchOpenAIResponse([
      { role: 'system', content: agentSystemPrompts.superagent },
      ...messages.slice(-5), // Include the last 5 messages for context
      { role: 'user', content: `Based on this user query, which agent should handle it? Options are: trading, travel, healthcare, nft, or personal. Respond with just the agent name.\n\nUser query: ${userMessage}` }
    ]);

    const selectedAgent = (superagentResponse?.trim().toLowerCase() || 'personal') as AgentType;

    // Now, use the selected agent to generate a response
    const agentMessages: Message[] = [
      { role: 'system', content: agentSystemPrompts[selectedAgent] },
      ...messages // Include all messages for full context
    ];

    const agentResponse = await fetchOpenAIResponse(
      agentMessages, 
      agentFunctions[selectedAgent]
    );

    return NextResponse.json({ content: agentResponse, agent: selectedAgent });
  } catch (error) {
    console.error('Error in superagent API:', error);
    return NextResponse.json({ error: 'Failed to get response from OpenAI' }, { status: 500 });
  }
}

async function fetchOpenAIResponse(
  messages: Message[], 
  functions?: ChatCompletionFunctions[]
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
      functions: functions,
      function_call: functions && functions.length > 0 ? 'auto' : undefined,
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error: ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  const responseMessage = data.choices[0].message;

  // Handle function calls
  if (responseMessage.function_call) {
    const { name, arguments: args } = responseMessage.function_call;
    
    try {
      // Execute the function
      const functionToCall = availableFunctions[name];
      if (!functionToCall) {
        throw new Error(`Function ${name} not found`);
      }

      const functionArgs = JSON.parse(args);
      const functionResult = await functionToCall(...Object.values(functionArgs));

      // Add function result to messages and make another call
      const updatedMessages: Message[] = [
        ...messages,
        responseMessage,
        {
          role: 'function',
          name: name,
          content: functionResult
        }
      ];

      // Recursive call to get final response after function execution
      return fetchOpenAIResponse(updatedMessages, functions);
    } catch (error) {
      console.error('Function call error:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }

  // Return regular text response
  return responseMessage.content || 'No response generated.';
}

export const runtime = 'edge';

