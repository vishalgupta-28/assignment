'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  Lock, Heart, MessageCircle } from 'lucide-react';
import { ProfileData } from '@/lib/types';


interface ProfileDisplayProps {
  profileData: ProfileData | null;
}

export function ProfileDisplay({ profileData }: ProfileDisplayProps) {
  if (!profileData) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={profileData.profilePicUrl}
              alt={profileData.fullName || 'Profile'}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold';
                placeholder.textContent = (profileData.fullName || '?').charAt(0).toUpperCase();
                target.parentNode?.appendChild(placeholder);
              }}
            />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">
              {profileData?.fullName || profileData?.username || 'Unknown User'}
            </CardTitle>
            {profileData?.username && (
              <p className="text-sm text-muted-foreground">@{profileData.username}</p>
            )}
            <div className="flex gap-2 mt-2">
              {profileData?.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
              {profileData?.isPrivate && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-2xl font-bold">{profileData?.postsCount || 0}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profileData?.followersCount || 0}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{profileData?.followsCount || 0}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </div>
        
        {profileData?.biography && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Bio</h4>
            <p className="text-sm text-muted-foreground">{profileData.biography}</p>
          </div>
        )}

        {profileData?.latestPosts && profileData.latestPosts.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Latest Posts</h4>
            <div className="grid grid-cols-3 gap-2">
              {profileData.latestPosts.slice(0, 6).map((post, index) => (
                <div key={post?.id || Math.random()} className="aspect-square relative group">
                  <img
                    src={post.displayUrl}
                    crossOrigin='anonymous'
                    alt={`Post ${index + 1}`}
                    className="w-full h-full object-cover rounded hover:opacity-75 transition-opacity cursor-pointer bg-gray-100"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = 'w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs';
                      placeholder.textContent = 'Image unavailable';
                      e.currentTarget.parentNode?.insertBefore(placeholder, e.currentTarget.nextSibling);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post?.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post?.commentsCount || 0}</span>
                      </div>
                    </div>
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
