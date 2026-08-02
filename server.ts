import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { nanoid } from "nanoid";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize persistent storage file
const DATA_DIR = path.join(process.cwd(), "data");
const CARDS_FILE = path.join(DATA_DIR, "cards.json");

// Firebase connection pooling setup for Vercel Serverless
let db: ReturnType<typeof getFirestore> | null = null;

function getFirestoreDb() {
  if (db) return db;
  try {
    let firebaseConfigJson: any = null;

    // 1. Check Vercel or Node environment variables
    if (process.env.FIREBASE_CONFIG) {
      try {
        firebaseConfigJson = JSON.parse(process.env.FIREBASE_CONFIG);
      } catch (e) {}
    }
    
    if (!firebaseConfigJson && process.env.FIREBASE_API_KEY) {
      firebaseConfigJson = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "(default)"
      };
    }

    // 2. Fall back to local firebase applet config JSON file
    if (!firebaseConfigJson) {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        firebaseConfigJson = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      }
    }

    if (firebaseConfigJson) {
      const firebaseConfig = {
        apiKey: firebaseConfigJson.apiKey,
        authDomain: firebaseConfigJson.authDomain,
        projectId: firebaseConfigJson.projectId,
        storageBucket: firebaseConfigJson.storageBucket,
        messagingSenderId: firebaseConfigJson.messagingSenderId,
        appId: firebaseConfigJson.appId,
      };
      const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      const databaseId = firebaseConfigJson.firestoreDatabaseId || "(default)";
      db = getFirestore(firebaseApp, databaseId);
      console.log("[Firebase] Firestore database connection initialized with serverless connection pooling.");
      return db;
    }
  } catch (err: any) {
    console.warn("[Firebase] Could not initialize Firestore database connection:", err?.message || err);
  }
  return null;
}

export interface CardData {
  id: string;
  slug?: string;
  recipientName: string;
  senderName: string;
  occasion: string;
  message: string;
  templateId: string;
  images: Array<{ url: string; caption?: string }>;
  themeColor: string;
  musicTrack: string;
  interactiveOptions: {
    cake: boolean;
    candles: boolean;
    balloons: boolean;
    giftBox: boolean;
    confetti: boolean;
    soundEffects: boolean;
  };
  secretMessage?: string;
  createdAt: string;
  views: number;
  reactions: Array<{ emoji: string; text?: string; from?: string; date: string }>;
}

let cardsDatabase: Record<string, CardData> = {};

// Load saved cards from disk if available
function loadCardsFromDisk() {
  try {
    if (fs.existsSync(CARDS_FILE)) {
      const content = fs.readFileSync(CARDS_FILE, "utf-8");
      cardsDatabase = JSON.parse(content);
      console.log(`Loaded ${Object.keys(cardsDatabase).length} cards from local storage.`);
    } else {
      seedDefaultCards();
    }
  } catch (err) {
    console.error("Failed to read cards database, initializing seed:", err);
    seedDefaultCards();
  }
}

function saveCardsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (mkdirErr) {
        // Read-only filesystem handling on serverless platforms like Vercel
      }
    }
    fs.writeFileSync(CARDS_FILE, JSON.stringify(cardsDatabase, null, 2), "utf-8");
  } catch (err: any) {
    console.warn("Notice: Local disk persistence unavailable (Vercel serverless environment):", err?.message || err);
  }
}

async function saveCardToFirestore(card: CardData) {
  const dbInstance = getFirestoreDb();
  if (!dbInstance) {
    console.warn("[Firestore] No database connection available. Saved card in memory cache.");
    return;
  }
  try {
    const cardRef = doc(dbInstance, "cards", card.id);
    await setDoc(cardRef, card, { merge: true });
    console.log(`[Firestore] Successfully persisted card ${card.id}`);
  } catch (err: any) {
    console.error(`[Firestore Error] Failed to save card ${card.id}:`, err?.message || err);
    throw new Error(`Firestore database error: ${err?.message || "Write failed"}`);
  }
}

async function getCardFromFirestore(id: string): Promise<CardData | null> {
  const dbInstance = getFirestoreDb();
  if (!dbInstance) return null;
  try {
    const cardRef = doc(dbInstance, "cards", id);
    const snap = await getDoc(cardRef);
    if (snap.exists()) {
      const data = snap.data() as CardData;
      cardsDatabase[id] = data; // Cache in serverless memory
      return data;
    }
  } catch (err: any) {
    console.error(`[Firestore Error] Fetching card ${id}:`, err?.message || err);
  }
  return null;
}

function seedDefaultCards() {
  const sampleBirthdayCard: CardData = {
    id: "birthday-demo",
    slug: "birthday-demo",
    recipientName: "Sarah",
    senderName: "Your Besties",
    occasion: "Birthday",
    message: "Happy Birthday Sarah! 🎉 May your day be filled with endless laughter, boundless joy, sweet memories, and all the happiness in the world. You bring so much light and positive energy into everyone's life. Keep shining brightly!",
    templateId: "interactive-suite",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
        caption: "Celebrating another glorious year!"
      },
      {
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
        caption: "Unforgettable laughter & joyful moments"
      },
      {
        url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
        caption: "Wishing you sweet surprises today!"
      }
    ],
    themeColor: "#ec4899",
    musicTrack: "happy-piano",
    interactiveOptions: {
      cake: true,
      candles: true,
      balloons: true,
      giftBox: true,
      confetti: true,
      soundEffects: true
    },
    secretMessage: "🎁 Surprise! You are genuinely loved and appreciated more than words can express. Never stop chasing your biggest dreams!",
    createdAt: new Date().toISOString(),
    views: 42,
    reactions: [
      { emoji: "💖", text: "Thank you so so much!! This made my entire day! 🎉", from: "Sarah", date: new Date().toISOString() }
    ]
  };

  cardsDatabase[sampleBirthdayCard.id] = sampleBirthdayCard;
  cardsDatabase[sampleBirthdayCard.slug!] = sampleBirthdayCard;
  saveCardsToDisk();
}

loadCardsFromDisk();

// Initialize Gemini Client
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Global stats counter
let totalBalloonsPopped = 14280;

// API Endpoints
app.get(["/api/health", "/health"], (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get(["/api/stats", "/stats"], (req, res) => {
  const cardCount = Object.keys(cardsDatabase).length;
  let totalViews = 0;
  Object.values(cardsDatabase).forEach(card => {
    totalViews += (card.views || 0);
  });
  res.json({
    cardsCreated: cardCount + 1280,
    totalViews: totalViews + 48900,
    balloonsPopped: totalBalloonsPopped
  });
});

app.post(["/api/pop-balloon", "/pop-balloon"], (req, res) => {
  totalBalloonsPopped++;
  res.json({ balloonsPopped: totalBalloonsPopped });
});

// GET Card by ID or Slug
app.get(["/api/cards/:id", "/cards/:id"], async (req, res) => {
  try {
    const id = req.params.id;
    let card = cardsDatabase[id];

    if (!card) {
      card = (await getCardFromFirestore(id)) || undefined;
    }

    if (!card) {
      return res.status(404).json({ success: false, error: "Card not found" });
    }

    // Increment view count
    card.views = (card.views || 0) + 1;
    saveCardsToDisk();

    if (db) {
      try {
        const cardRef = doc(db, "cards", card.id);
        await updateDoc(cardRef, { views: card.views }).catch(() => {});
      } catch (err) {
        // Ignore view update background errors
      }
    }

    return res.json(card);
  } catch (err: any) {
    console.error(`[API GET /api/cards/${req.params.id} Error]:`, err);
    return res.status(500).json({ success: false, error: err?.message || "Internal server error fetching card" });
  }
});

// GET Recent Public Cards for Gallery
app.get(["/api/cards", "/cards"], (req, res) => {
  const cards = Object.values(cardsDatabase)
    // deduplicate by ID
    .reduce((acc: CardData[], current) => {
      if (!acc.some(item => item.id === current.id)) {
        acc.push(current);
      }
      return acc;
    }, [])
    .slice(0, 10);

  res.json(cards);
});

// CREATE New Card Handler
const handleCreateCard = async (req: express.Request, res: express.Response) => {
  try {
    console.log("[API POST /api/cards] Incoming payload:", {
      recipientName: req.body?.recipientName,
      senderName: req.body?.senderName,
      occasion: req.body?.occasion,
      imageCount: Array.isArray(req.body?.images) ? req.body.images.length : 0
    });

    const {
      recipientName,
      senderName,
      occasion,
      message,
      templateId,
      images,
      themeColor,
      musicTrack,
      interactiveOptions,
      secretMessage,
      customSlug
    } = req.body || {};

    if (!recipientName || !senderName || !message) {
      console.warn("[API POST /api/cards] Missing required fields");
      return res.status(400).json({
        success: false,
        error: "Recipient name, sender name, and message are required"
      });
    }

    const shortId = nanoid(8);
    let finalId = shortId;

    if (customSlug && typeof customSlug === "string" && customSlug.trim().length > 2) {
      const sanitizedSlug = customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
      if (!cardsDatabase[sanitizedSlug]) {
        finalId = sanitizedSlug;
      }
    }

    const newCard: CardData = {
      id: finalId,
      slug: customSlug ? finalId : undefined,
      recipientName: String(recipientName).trim(),
      senderName: String(senderName).trim(),
      occasion: occasion || "Birthday",
      message: String(message).trim(),
      templateId: templateId || "interactive-suite",
      images: Array.isArray(images) && images.length > 0 ? images : [
        {
          url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
          caption: "A special day for someone amazing!"
        }
      ],
      themeColor: themeColor || "#ec4899",
      musicTrack: musicTrack || "happy-piano",
      interactiveOptions: interactiveOptions || {
        cake: true,
        candles: true,
        balloons: true,
        giftBox: true,
        confetti: true,
        soundEffects: true
      },
      secretMessage: secretMessage || "",
      createdAt: new Date().toISOString(),
      views: 0,
      reactions: []
    };

    // 1. Memory cache
    cardsDatabase[finalId] = newCard;
    if (newCard.id !== shortId) {
      cardsDatabase[shortId] = newCard;
    }

    // 2. Local disk backup (if directory is writable)
    saveCardsToDisk();

    // 3. Persistent Firestore sync
    await saveCardToFirestore(newCard);

    // Host & Protocol determination
    const protocol = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const host = req.get("host") || "localhost:3000";
    const fullUrl = `${protocol}://${host}/w/${finalId}`;

    return res.status(201).json({
      success: true,
      card: newCard,
      shortUrl: `/w/${finalId}`,
      fullUrl
    });
  } catch (err: any) {
    console.error("[API POST /api/cards Error]:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Internal server error saving card"
    });
  }
};

app.post(["/api/cards", "/cards", "/api/save-card", "/save-card"], handleCreateCard);

// ADD Reaction to a Card
app.post(["/api/cards/:id/reaction", "/cards/:id/reaction"], (req, res) => {
  const id = req.params.id;
  const card = cardsDatabase[id];

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  const { emoji, text, from } = req.body;
  const newReaction = {
    emoji: emoji || "💖",
    text: text || "",
    from: from || card.recipientName,
    date: new Date().toISOString()
  };

  card.reactions = card.reactions || [];
  card.reactions.unshift(newReaction);
  saveCardsToDisk();

  res.json({ success: true, card });
});

// AI Wish Generator Endpoint
app.post(["/api/generate-wish", "/generate-wish"], async (req, res) => {
  try {
    const { recipientName, senderName, relationship, occasion, tone } = req.body;

    if (!process.env.GEMINI_API_KEY || !genAI) {
      // Fallback pre-written rich templates if API key is not configured or offline
      const fallbacks: Record<string, string[]> = {
        heartfelt: [
          `Happy ${occasion || 'Birthday'}, ${recipientName}! You have a heart of pure gold and a spirit that brightens every room you enter. May this year bring you as much happiness, peace, and warmth as you give so selflessly to everyone around you. Forever grateful for you! — With love, ${senderName}`,
          `To the wonderful ${recipientName}, wishing you a truly extraordinary ${occasion || 'Birthday'}! Working and walking through life alongside you is a blessing. May your days ahead be filled with big achievements, gentle moments, and overflowing joy. — Warmest wishes, ${senderName}`
        ],
        hilarious: [
          `Happy ${occasion || 'Birthday'}, ${recipientName}! They say age is just a number, but in your case... it's a pretty high number! 🎂 Don't worry, you're still young enough to pretend you know what you're doing. Have the absolute best celebration! — Yours in comedy, ${senderName}`,
          `Happy ${occasion || 'Birthday'} to ${recipientName}, my favorite human to cause mild chaos with! May your day be as awesome as you are, and may your cake be 90% frosting. Stay legendary! — ${senderName}`
        ],
        poetic: [
          `For ${recipientName}: Another turn around the sun, another chapter written in grace. May the path ahead bloom with serene beauty, cherished dreams, and endless light on this happy ${occasion || 'Birthday'}. — Eternally, ${senderName}`,
          `Like stars that illuminate the night, your kindness leaves a lasting glow. Wishing ${recipientName} a celebratory ${occasion || 'Birthday'} filled with harmony, beauty, and heartfelt joy. — ${senderName}`
        ],
        energetic: [
          `LET'S GOOO! 🎉 Happy ${occasion || 'Birthday'} ${recipientName}! It's time to turn up the music, pop the balloons, and eat way too much cake! Wishing you the most hype year yet full of huge wins! 🚀 — ${senderName}`,
          `BOOM! 💥 Huge ${occasion || 'Birthday'} shouts to the legend ${recipientName}! Today is all about celebrating YOU! Keep crushing it and shining bright! — ${senderName}`
        ]
      };

      const selectedTone = tone && fallbacks[tone] ? tone : 'heartfelt';
      const wishList = fallbacks[selectedTone];
      const wish = wishList[Math.floor(Math.random() * wishList.length)];
      return res.json({ wish });
    }

    const prompt = `Write a personalized, delightful, and engaging greeting wish message for a custom interactive celebration website.
Recipient Name: ${recipientName || 'Friend'}
Sender Name: ${senderName || 'Me'}
Relationship: ${relationship || 'Friend'}
Occasion: ${occasion || 'Birthday'}
Desired Tone: ${tone || 'heartfelt'}

Requirements:
- Keep it warm, engaging, and suitable for display on a gorgeous digital greeting card.
- Length: 2 to 4 sentences (approx 40-70 words).
- Do not wrap in quotes or code blocks. Include appropriate celebratory emojis.`;

    const response = await genAI.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const generatedWish = response.text ? response.text.trim() : `Happy ${occasion || 'Birthday'} ${recipientName}! Wishing you a day filled with laughter, love, and joy. — ${senderName}`;
    res.json({ wish: generatedWish });
  } catch (err: any) {
    console.error("Gemini wish generation error:", err);
    res.status(500).json({
      wish: `Happy Birthday ${req.body.recipientName || 'there'}! May your special day be filled with happiness, warmth, and lots of cake! — ${req.body.senderName || 'Your Friend'}`
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CelebrationCraft SaaS Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
