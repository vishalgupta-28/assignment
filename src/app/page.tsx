
'use client';

import { useState } from 'react';
import { UrlInput } from '@/components/url-input';
import { ReelDisplay } from '@/components/reel-display';
import { ProfileDisplay } from '@/components/profile-display';
import { SentimentDisplay } from '@/components/sentiment-display';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProfileData, ReelData, SentimentData } from '@/lib/types';

// Define interfaces based on instruction.txt format




export default function Home() {
  const [analysisStep, setAnalysisStep] = useState<'idle' | 'reel' | 'profile-sentiment' | 'complete'>('idle');
  const [reelData, setReelData] = useState<ReelData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractUsernameFromReelData = (reelData: ReelData): string | null => {
    return reelData?.ownerUsername || null;
  };

  const handleUrlSubmit = async (url: string) => {
    try {
      // Reset all states
      setReelData(null);
      setProfileData(null);
      setSentimentData(null);
      setError(null);
      setLoading(true);
      
      setAnalysisStep('reel');
      
      // Step 1: Scrape reel data
      const reelResponse = await fetch('/api/scrape-reel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reelUrl: url }),
      });

      if (!reelResponse.ok) {
        throw new Error('Failed to fetch reel data');
      }

      const reelResult = await reelResponse.json();
      const currentReelData = reelResult.data[0];
      setReelData(currentReelData);

      console.log(currentReelData);
      
      if (!currentReelData) {
        setLoading(false);
        setAnalysisStep('idle');
        return;
      }
      
      // Step 2 & 3: Run profile scraping and sentiment analysis in parallel
      setAnalysisStep('profile-sentiment');
      const username = extractUsernameFromReelData(currentReelData);
      
      // Prepare sentiment data
      const comments = currentReelData.latestComments?.map((comment : any)  => ({
        id: comment.id,
        text: comment.text
      })) || [];
      
      // Create parallel promises
      const promises = [];
      
      // Profile scraping promise (only if username exists)
      if (username) {
        const profilePromise = fetch('/api/scrape-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        }).then(async (response) => {
          if (response.ok) {
            const profileResult = await response.json();
            setProfileData(profileResult.data[0]);
            return profileResult.data[0];
          }
          return null;
        }).catch(error => {
          console.error('Profile scraping failed:', error);
          return null;
        });
        promises.push(profilePromise);
      }
      
      // Sentiment analysis promise
      const sentimentPromise = fetch('/api/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: currentReelData.caption || '',
          comments: comments
        }),
      }).then(async (response) => {
        if (response.ok) {
          const sentimentResult = await response.json();
          setSentimentData(sentimentResult.data);
          return sentimentResult.data;
        }
        return null;
      }).catch(error => {
        console.error('Sentiment analysis failed:', error);
        return null;
      });
      promises.push(sentimentPromise);
      
      // Wait for all promises to complete
      await Promise.allSettled(promises);
      
      setAnalysisStep('complete');
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze post');
      setAnalysisStep('idle');
    } finally {
      setLoading(false);
    }
  };

  const getLoadingMessage = () => {
    switch (analysisStep) {
      case 'reel':
        return 'Scraping Instagram reel data...';
      case 'profile-sentiment':
        return 'Analyzing profile and sentiment data...';
      default:
        return 'Processing...';
    }
  };

  const hasError = error;

  return (
    
    <div style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
    }} 
    className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <UrlInput 
            onSubmit={handleUrlSubmit} 
            loading={loading} 
          />

          {loading && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                {getLoadingMessage()}
              </div>
            </div>
          )}

          {hasError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {analysisStep === 'complete' && (
            <div className="space-y-6">
              {reelData && (
                <ReelDisplay reelData={reelData} />
              )}
              
              {profileData && (
                <ProfileDisplay profileData={profileData} />
              )}
              
              {sentimentData && (
                <SentimentDisplay sentimentData={sentimentData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
