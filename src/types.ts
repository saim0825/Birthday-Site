export interface Reaction {
  emoji: string;
  text?: string;
  from?: string;
  date: string;
}

export interface CardImage {
  url: string;
  caption?: string;
}

export interface InteractiveOptions {
  cake: boolean;
  candles: boolean;
  balloons: boolean;
  giftBox: boolean;
  confetti: boolean;
  soundEffects: boolean;
}

export interface CardData {
  id: string;
  slug?: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  message: string;
  templateId: string;
  images: CardImage[];
  themeColor: string;
  musicTrack: string;
  interactiveOptions: InteractiveOptions;
  secretMessage?: string;
  createdAt: string;
  views: number;
  reactions: Reaction[];
}

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  badge: string;
  previewBg: string;
  accentColor: string;
  isPopular?: boolean;
}
