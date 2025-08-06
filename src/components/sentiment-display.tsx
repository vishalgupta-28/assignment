'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Info } from 'lucide-react';
interface SentimentData {
  response?: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
  info?: string;
}

interface SentimentDisplayProps {
  sentimentData: SentimentData | null;
}

export function SentimentDisplay({ sentimentData }: SentimentDisplayProps) {
  if (!sentimentData) return null;

  const response = sentimentData?.response || { positive: 0, negative: 0, neutral: 0 };
  const info = sentimentData?.info || 'No analysis available';

  const total = (response.positive || 0) + (response.negative || 0) + (response.neutral || 0);

  const getSentimentIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <Smile className="w-5 h-5" />;
      case 'negative':
        return <Frown className="w-5 h-5" />;
      case 'neutral':
        return <Meh className="w-5 h-5" />;
    }
  };

  const getSentimentColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      case 'neutral':
        return 'text-gray-600 bg-gray-50';
    }
  };

  const sentimentDataSorted = [
    { type: 'positive' as const, value: response.positive || 0, color: 'text-green-600 bg-green-50' },
    { type: 'negative' as const, value: response.negative || 0, color: 'text-red-600 bg-red-50' },
    { type: 'neutral' as const, value: response.neutral || 0, color: 'text-gray-600 bg-gray-50' },
  ].sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {(['positive', 'negative', 'neutral'] as const).map((type) => {
            const value = response[type] || 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            
            return (
              <div key={type} className="text-center">
                <Badge 
                  variant="outline" 
                  className={`${getSentimentColor(type)} border-0 px-3 py-2`}
                >
                  <div className="flex items-center gap-1">
                    {getSentimentIcon(type)}
                    <span className="capitalize">{type}</span>
                  </div>
                </Badge>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">{value} comments</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {sentimentDataSorted.map((item) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.type} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{item.type}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.type === 'positive' ? 'bg-green-500' :
                      item.type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {info && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Analysis Summary</h4>
            <p className="text-sm text-muted-foreground">{info}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
