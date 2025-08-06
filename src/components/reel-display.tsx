'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, MessageCircle, Eye, Share2, Calendar, User, View, Timer } from 'lucide-react';
import { ReelData } from '@/lib/types';




interface ReelDisplayProps {
  reelData: ReelData | null;
}

export function ReelDisplay({ reelData }: ReelDisplayProps) {
  if (!reelData) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Instagram Post Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reelData?.type === 'video' && reelData?.videoUrl && (
          <div className="w-full rounded-lg overflow-hidden">
            <video
              src={reelData.videoUrl}
              controls
              className="w-full rounded-lg"
              poster={reelData.displayUrl || '/placeholder-post.png'}
              onError={(e) => {
                const target = e.currentTarget as HTMLVideoElement;
                target.poster = '/placeholder-post.png';
                target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500';
                placeholder.textContent = 'Video unavailable';
                target.parentNode?.appendChild(placeholder);
              }}
            />
          </div>
        )}
        
        {reelData?.type === 'image' && reelData?.displayUrl && (
          <div className="w-full rounded-lg bg-gray-100 overflow-hidden">
            <img
              src={reelData.displayUrl}
              alt="Post"
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500';
                placeholder.textContent = 'Image unavailable';
                target.parentNode?.appendChild(placeholder);
              }}
            />
          </div>
        )}

        {reelData?.owner && (
          <div className="flex items-center gap-3">
            <img
              src={reelData.owner.profilePicUrl || '/placeholder-avatar.png'}
              alt={reelData.owner.username || 'User'}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '/placeholder-avatar.png';
                target.onerror = null; // Prevent infinite loop if placeholder fails
              }}
            />
            <div>
              <p className="font-semibold">{reelData.owner.fullName || 'Unknown User'}</p>
              {reelData.owner.username && (
                <p className="text-sm text-muted-foreground">@{reelData.owner.username}</p>
              )}
            </div>
            {reelData.owner.isVerified && (
              <Badge variant="secondary" className="ml-auto">
                Verified
              </Badge>
            )}
          </div>
        )}

        {reelData?.caption && (
          <div className="space-y-2">
            <p className="text-sm">{reelData.caption}</p>
            <div className="flex gap-2 flex-wrap">
              {reelData.hashtags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {reelData.mentions?.map((mention) => (
                <Badge key={mention} variant="outline" className="text-xs">
                  @{mention}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{(reelData?.likesCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span>{(reelData?.commentsCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <View className="w-4 h-4 text-green-500" />
            <span>{(reelData?.videoViewCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4 text-yellow-500" />
            <span>{(reelData?.videoDuration || 0).toLocaleString()}</span>
          </div>
          {reelData?.type === 'video' && (
            <>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-purple-500" />
                <span>{(reelData?.videoViewCount || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4 text-green-500" />
                <span>{(reelData?.videoPlayCount || 0).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        {reelData?.latestComments && reelData.latestComments.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold">Recent Comments</h4>
            <div className="space-y-2">
              {reelData.latestComments.slice(0, 3).map((comment) => (
                <div key={comment?.id || Math.random()} className="flex gap-3">
                  <img
                    src={comment?.ownerProfilePicUrl || '/placeholder-avatar.png'}
                    alt={comment?.ownerUsername || 'User'}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-avatar.png';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{comment?.ownerUsername || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{comment?.text || ''}</p>
                    {comment?.timestamp && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
