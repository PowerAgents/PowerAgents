import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schemas for response validation
const MintNFTResponseSchema = z.object({
  actionId: z.string(),
  onChain: z.object({
    status: z.string(),
    chain: z.string()
  }),
  id: z.string()
});

const StatusResponseSchema = z.object({
  actionId: z.string(),
  action: z.string(),
  status: z.string(),
  data: z.object({
    collection: z.object({}),
    recipient: z.object({}),
    token: z.object({})
  }),
  startedAt: z.string(),
  resource: z.string()
});

const NFTSchema = z.object({
  chain: z.string(),
  mintHash: z.string(),
  metadata: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    attributes: z.array(z.unknown())
  }),
  locator: z.string()
});

const CreateWalletResponseSchema = z.object({
  type: z.string(),
  address: z.string(),
  linkedUser: z.string()
});

const GetNFTResponseSchema = z.array(NFTSchema);

// Function to validate responses
function validateResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

// Available functions for OpenAI
const availableFunctions = {
  mint_nft: {
    name: 'mint_nft',
    description: 'Mint an NFT using Crossmint and send it to user email',
    parameters: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address of the recipient'
        },
        chain: {
          type: 'string',
          enum: ['solana', 'polygon-amoy', 'ethereum-sepolia'],
          description: 'Blockchain network to mint on'
        }
      },
      required: ['email']
    }
  },
  check_mint_status: {
    name: 'check_mint_status',
    description: 'Check the status of an NFT minting process',
    parameters: {
      type: 'object',
      properties: {
        actionId: {
          type: 'string',
          description: 'The action ID received from the minting process'
        }
      },
      required: ['actionId']
    }
  },
  view_nfts: {
    name: 'view_nfts',
    description: 'View NFTs owned by an email address',
    parameters: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address of the NFT owner'
        },
        chain: {
          type: 'string',
          enum: ['solana', 'polygon-amoy', 'ethereum-sepolia'],
          description: 'Blockchain network to check'
        }
      },
      required: ['email']
    }
  },
  create_wallet: {
    name: 'create_wallet',
    description: 'Create a new wallet for a user using their email address',
    parameters: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address of the wallet owner'
        },
        type: {
          type: 'string',
          enum: ['solana-mpc-wallet', 'polygon-mpc-wallet', 'ethereum-mpc-wallet'],
          description: 'Type of wallet to create',
          default: 'solana-mpc-wallet'
        }
      },
      required: ['email']
    }
  }
};

// Function to mint NFT
async function mint_nft(args: { email: string; chain?: string; imageUrl?: string }) {
  const apiKey = process.env.CROSSMINT_API_KEY;
  const chain = args.chain || "solana";
  const env = "staging";
  const recipientEmail = args.email;
  const recipientAddress = `email:${recipientEmail}:${chain}`;
  const url = `https://${env}.crossmint.com/api/collections/default/nfts`;

  const metadata = {
    name: "Crossmint Test NFT",
    image: args.imageUrl || "https://picsum.photos/400",
    description: "My first NFT using Crossmint",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-key": apiKey!,
    },
    body: JSON.stringify({
      recipient: recipientAddress,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to mint NFT: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Mint NFT Response:", data);
  return validateResponse(MintNFTResponseSchema, {
    ...data,
    askStatus: "Would you like me to check the current status of your NFT minting process?"
  });
}

// Function to check mint status
async function check_mint_status(args: { actionId: string }) {
  const apiKey = process.env.CROSSMINT_API_KEY;
  const env = "staging";
  const url = `https://${env}.crossmint.com/api/actions/${args.actionId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": apiKey!
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to check mint status: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Check Status Response:", data);
  return validateResponse(StatusResponseSchema, {
    ...data,
    message: `NFT minting status checked successfully. Current status: ${data.status || 'unknown'}`
  });
}

// Function to view NFTs
async function view_nfts(args: { email: string; chain?: string }) {
  const apiKey = process.env.CROSSMINT_API_KEY;
  const chain = args.chain || "solana";
  const identifier = `email:${args.email}:${chain}`;
  const url = `https://staging.crossmint.com/api/wallets/${identifier}/nfts`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-KEY": apiKey!
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("View NFTs Response:", data);
  const simplifiedNFTs = validateResponse(GetNFTResponseSchema, data);

  return {
    nfts: simplifiedNFTs,
    count: simplifiedNFTs.length,
    message: `Found ${simplifiedNFTs.length} NFTs for the provided email address`
  };
}

// Function to create wallet
async function create_wallet(args: { email: string; type?: string }) {
  const apiKey = process.env.CROSSMINT_API_KEY;
  const walletType = args.type || "solana-mpc-wallet";
  const linkedUser = `email:${args.email}`;
  const url = "https://staging.crossmint.com/api/v1-alpha2/wallets";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: walletType,
      linkedUser: linkedUser
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create wallet: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Wallet Creation Response:", data);
  
  return validateResponse(CreateWalletResponseSchema, {
    ...data,
    message: `Wallet created successfully with address: ${data.address}`
  });
}

// Main POST function
export async function POST(req: Request) {
  try {
    const { messages, imageUrl } = await req.json();
    const systemPrompt = {
      role: "system",
      content: "You are an onchain assistant, always respond in markdown. If an image is provided, use it for minting NFTs."
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          systemPrompt,
          ...messages.map((msg: any) => ({
            ...msg,
            content: msg.imageUrl ? `${msg.content}\n[Image URL: ${msg.imageUrl}]` : msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000,
        functions: Object.values(availableFunctions),
        function_call: 'auto'
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    const message = data.choices[0].message;
    if (message.function_call) {
      const functionName = message.function_call.name;
      const functionArgs = JSON.parse(message.function_call.arguments);
      
      let functionResponse;
      switch (functionName) {
        case 'mint_nft':
          functionResponse = await mint_nft({ ...functionArgs, imageUrl });
          break;
        case 'check_mint_status':
          functionResponse = await check_mint_status(functionArgs);
          break;
        case 'view_nfts':
          functionResponse = await view_nfts(functionArgs);
          break;
        case 'create_wallet':
          functionResponse = await create_wallet(functionArgs);
          break;
        default:
          throw new Error(`Unknown function: ${functionName}`);
      }

      const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            systemPrompt,
            ...messages,
            message,
            {
              role: 'function',
              name: functionName,
              content: JSON.stringify(functionResponse)
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      console.log("Function Response:", functionResponse);
      const secondData = await secondResponse.json();
      return NextResponse.json({
        role: 'assistant',
        content: secondData.choices[0].message.content,
        functionResponse,
        agent: 'onchain'
      });
    }

    return NextResponse.json({
      role: 'assistant',
      content: message.content,
      agent: 'onchain'
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}