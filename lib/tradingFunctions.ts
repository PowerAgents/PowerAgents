import { ChatCompletionFunctions } from 'openai-edge';

export async function getCryptoPrice(coinId: string): Promise<string> {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    
    if (!response.ok) {
      throw new Error('CoinGecko API request failed');
    }

    const data = await response.json();
    const price = data[coinId]?.usd;

    if (!price) {
      throw new Error('Price not found for the given coin ID');
    }

    return JSON.stringify({ coinId, price });
  } catch (error) {
    console.error('CoinGecko API error:', error);
    return JSON.stringify({ error: 'Unable to fetch crypto price' });
  }
}

export const cryptoPriceFunction: ChatCompletionFunctions = {
  name: 'get_crypto_price',
  description: 'Get the current price of a cryptocurrency in USD',
  parameters: {
    type: 'object',
    properties: {
      coinId: {
        type: 'string',
        description: 'The CoinGecko ID of the cryptocurrency, e.g., bitcoin, ethereum',
      },
    },
    required: ['coinId'],
  },
};

