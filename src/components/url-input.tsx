'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export function UrlInput({ onSubmit, loading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Instagram className="w-6 h-6" />
          Instagram Post Analyzer
        </CardTitle>
        <CardDescription>
          Enter an Instagram post URL to analyze engagement and sentiment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="https://www.instagram.com/reel/ABC123DEF/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !url.trim()}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
