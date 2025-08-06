export interface ReelData {
  inputUrl?: string;
  id?: string;
  type?: string;
  shortCode?: string;
  caption?: string;
  hashtags?: string[];
  mentions?: string[];
  url?: string;
  commentsCount?: number;
  firstComment?: string;
  latestComments?: Array<{
    id?: string;
    text?: string;
    ownerUsername?: string;
    ownerProfilePicUrl?: string;
    timestamp?: string;
    repliesCount?: number;
    likesCount?: number;
  }>;
  dimensionsHeight?: number;
  dimensionsWidth?: number;
  displayUrl?: string;
  images?: string[];
  videoUrl?: string;
  videoViewCount?: number;
  videoPlayCount?: number;
  likes?: number;
  likesCount?: number; // Included as both likes and likesCount were present
  timestamp?: string;
  owner?: {
    id?: string;
    username?: string;
    fullName?: string;
    isVerified?: boolean;
    profilePicUrl?: string;
  };

  // New fields based on your data
  alt?: string | null;
  childPosts?: any[]; // Can be typed further if structure is known
  productType?: string;
  videoDuration?: number;
  isSponsored?: boolean;
  isCommentsDisabled?: boolean;

  musicInfo?: {
    artist_name?: string;
    song_name?: string;
    uses_original_audio?: boolean;
    should_mute_audio?: boolean;
    should_mute_audio_reason?: string;
    audio_id?: string;
  };

  // Owner fields present at root level in your data
  ownerFullName?: string;
  ownerUsername?: string;
  ownerId?: string;
}

export interface ProfileData {
  inputUrl?: string;
  id?: string;
  username?: string;
  url?: string;
  fullName?: string;
  biography?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  profilePicUrl?: string;
  latestPosts?: Array<{
    id?: string;
    type?: string;
    shortCode?: string;
    caption?: string;
    hashtags?: string[];
    mentions?: string[];
    url?: string;
    commentsCount?: number;
    likes?: number;
    timestamp?: string;
    displayUrl?: string;
  }>;
}

export interface SentimentData {
  response?: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
  info?: string;
}