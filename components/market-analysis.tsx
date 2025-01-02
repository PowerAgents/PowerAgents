'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MarketAnalysis {
  marketOverview: {
    trend: string
    support: number[]
    resistance: number[]
  }
  patternAnalysis: string[]
  tradeSetups: string[]
}

interface MarketAnalysisProps {
  content: string
}

export function MarketAnalysis({ content }: MarketAnalysisProps) {
  let analysisData: MarketAnalysis

  try {
    analysisData = JSON.parse(content)
  } catch (error) {
    return (
      <Card className="border-2 border-red-500 bg-red-100">
        <CardContent className="p-4">
          <p className="text-red-600 font-mono">Error parsing analysis data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-4 font-mono text-sm">
      <Card className="border-2 border-black">
        <CardHeader className="bg-blue-100 border-b-2 border-black">
          <CardTitle className="text-lg">Market Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <p>Trend: <span className={analysisData.marketOverview.trend === 'bullish' ? 'text-green-600' : 'text-red-600'}>{analysisData.marketOverview.trend}</span></p>
          <p>Support: {analysisData.marketOverview.support.join(', ')}</p>
          <p>Resistance: {analysisData.marketOverview.resistance.join(', ')}</p>
        </CardContent>
      </Card>

      <Card className="border-2 border-black">
        <CardHeader className="bg-green-100 border-b-2 border-black">
          <CardTitle className="text-lg">Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="list-disc list-inside space-y-1">
            {analysisData.patternAnalysis.map((pattern, index) => (
              <li key={index}>{pattern}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-2 border-black">
        <CardHeader className="bg-yellow-100 border-b-2 border-black">
          <CardTitle className="text-lg">Trade Setups</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="list-disc list-inside space-y-1">
            {analysisData.tradeSetups.map((setup, index) => (
              <li key={index}>{setup}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

