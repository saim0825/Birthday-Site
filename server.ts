import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { nanoid } from "nanoid";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize persistent storage file
const DATA_DIR = path.join(process.cwd(), "data");
const CARDS_FILE = path.join(DATA_DIR, "cards.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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
      console.log(`Loaded ${Object.keys(cardsDatabase).length} cards from storage.`);
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
    fs.writeFileSync(CARDS_FILE, JSON.stringify(cardsDatabase, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save cards database:", err);
  }
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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/stats", (req, res) => {
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

app.post("/api/pop-balloon", (req, res) => {
  totalBalloonsPopped++;
  res.json({ balloonsPopped: totalBalloonsPopped });
});

// GET Card by ID or Slug
app.get("/api/cards/:id", (req, res) => {
  const id = req.params.id;
  const card = cardsDatabase[id];

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  // Increment view count
  card.views = (card.views || 0) + 1;
  saveCardsToDisk();

  res.json(card);
});

// GET Recent Public Cards for Gallery
app.get("/api/cards", (req, res) => {
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

// CREATE New Card
app.post("/api/cards", (req, res) => {
  try {
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
    } = req.body;

    if (!recipientName || !senderName || !message) {
      return res.status(400).json({ error: "Recipient name, sender name, and message are required" });
    }

    const shortId = nanoid(8);
    let finalId = shortId;

    if (customSlug && customSlug.trim().length > 2) {
      const sanitizedSlug = customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
      if (!cardsDatabase[sanitizedSlug]) {
        finalId = sanitizedSlug;
      }
    }

    const newCard: CardData = {
      id: finalId,
      slug: customSlug ? finalId : undefined,
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      occasion: occasion || "Birthday",
      message: message.trim(),
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

    cardsDatabase[finalId] = newCard;
    if (newCard.id !== shortId) {
      cardsDatabase[shortId] = newCard;
    }

    saveCardsToDisk();

    res.status(201).json({
      success: true,
      card: newCard,
      shortUrl: `/w/${finalId}`,
      fullUrl: `${req.protocol}://${req.get("host")}/w/${finalId}`
    });
  } catch (err: any) {
    console.error("Error creating card:", err);
    res.status(500).json({ error: "Failed to create greeting card website" });
  }
});

// ADD Reaction to a Card
app.post("/api/cards/:id/reaction", (req, res) => {
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
app.post("/api/generate-wish", async (req, res) => {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CelebrationCraft SaaS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
