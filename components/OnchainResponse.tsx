import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"

const MintNFTResponseSchema = z.object({
  tokenId: z.string(),
  transactionHash: z.string(),
});

const CheckMintStatusResponseSchema = z.object({
  status: z.enum(["pending", "completed", "failed"]),
  tokenId: z.string().optional(),
  transactionHash: z.string().optional(),
});

const ViewNFTsResponseSchema = z.array(
  z.object({
    tokenId: z.string(),
    owner: z.string(),
    metadata: z.record(z.unknown()),
  })
);

interface OnchainResponseProps {
  content: string;
}

export function OnchainResponse({ content }: OnchainResponseProps) {
  let parsedContent;
  try {
    parsedContent = JSON.parse(content);
  } catch (error) {
    console.error('Error parsing onchain response:', error);
    return <p>{content}</p>;
  }

  const renderFunctionResponse = (functionName: string, response: any) => {
    switch (functionName) {
      case 'mint_nft':
        try {
          const validatedResponse = MintNFTResponseSchema.parse(response);
          return (
            <div className="space-y-2">
              <p><strong>Token ID:</strong> {validatedResponse.tokenId}</p>
              <p><strong>Transaction Hash:</strong> {validatedResponse.transactionHash}</p>
            </div>
          );
        } catch (error) {
          console.error('Error validating mint_nft response:', error);
          return <p>Invalid mint_nft response</p>;
        }

      case 'check_mint_status':
        try {
          const validatedResponse = CheckMintStatusResponseSchema.parse(response);
          return (
            <div className="space-y-2">
              <p><strong>Status:</strong> {validatedResponse.status}</p>
              {validatedResponse.tokenId && <p><strong>Token ID:</strong> {validatedResponse.tokenId}</p>}
              {validatedResponse.transactionHash && <p><strong>Transaction Hash:</strong> {validatedResponse.transactionHash}</p>}
            </div>
          );
        } catch (error) {
          console.error('Error validating check_mint_status response:', error);
          return <p>Invalid check_mint_status response</p>;
        }

      case 'view_nfts':
        try {
          const validatedResponse = ViewNFTsResponseSchema.parse(response);
          return (
            <div className="space-y-4">
              {validatedResponse.map((nft, index) => (
                <div key={index} className="border p-2 rounded">
                  <p><strong>Token ID:</strong> {nft.tokenId}</p>
                  <p><strong>Owner:</strong> {nft.owner}</p>
                  <p><strong>Metadata:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(nft.metadata, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          );
        } catch (error) {
          console.error('Error validating view_nfts response:', error);
          return <p>Invalid view_nfts response</p>;
        }

      default:
        return <p>Unknown function response</p>;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">Onchain Response</h3>
        {parsedContent.functionResponse && (
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">Function Response</Badge>
            <div className="bg-black bg-opacity-20 p-2 rounded">
              {renderFunctionResponse(parsedContent.functionName, parsedContent.functionResponse)}
            </div>
          </div>
        )}
        <div>
          <Badge variant="secondary" className="mb-2">Assistant Message</Badge>
          <p className="whitespace-pre-wrap">{parsedContent.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}

