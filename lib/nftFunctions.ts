import { ChatCompletionFunctions } from 'openai-edge';

export async function getNFTInfo(collectionName: string): Promise<string> {
  // This is a mock function as we don't have a real NFT API
  const mockNFTInfo = {
    name: collectionName,
    floorPrice: '0.5 ETH',
    totalVolume: '1000 ETH',
    items: 10000,
  };
  return JSON.stringify(mockNFTInfo);
}

export const nftInfoFunction: ChatCompletionFunctions = {
  name: 'get_nft_info',
  description: 'Get information about an NFT collection',
  parameters: {
    type: 'object',
    properties: {
      collectionName: {
        type: 'string',
        description: 'The name of the NFT collection',
      },
    },
    required: ['collectionName'],
  },
};

