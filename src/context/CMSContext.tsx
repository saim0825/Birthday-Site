import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  WebsiteSettings,
  HeroSectionConfig,
  ThemeTemplateItem,
  ImageItem,
  GalleryPhoto,
  MusicTrack,
  ReviewItem,
  WishRecord,
  AnalyticsStats,
} from "../types/cms";
import {
  defaultSettings,
  defaultHero,
  defaultTemplates,
  defaultImages,
  defaultGallery,
  defaultMusicTracks,
  defaultReviews,
  defaultWishes,
  defaultAnalytics,
} from "../lib/cmsDefaults";

interface CMSContextType {
  settings: WebsiteSettings;
  hero: HeroSectionConfig;
  templates: ThemeTemplateItem[];
  images: ImageItem[];
  gallery: GalleryPhoto[];
  musicTracks: MusicTrack[];
  reviews: ReviewItem[];
  wishes: WishRecord[];
  analytics: AnalyticsStats;
  loading: boolean;
  updateSettings: (data: WebsiteSettings) => Promise<void>;
  updateHero: (data: HeroSectionConfig) => Promise<void>;
  saveTemplate: (template: ThemeTemplateItem) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (template: ThemeTemplateItem) => Promise<void>;
  reorderTemplates: (newList: ThemeTemplateItem[]) => Promise<void>;
  addImage: (image: ImageItem) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  saveGalleryPhoto: (photo: GalleryPhoto) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
  saveMusicTrack: (track: MusicTrack) => Promise<void>;
  deleteMusicTrack: (id: string) => Promise<void>;
  saveReview: (review: ReviewItem) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
  seedInitialDataIfEmpty: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [hero, setHero] = useState<HeroSectionConfig>(defaultHero);
  const [templates, setTemplates] = useState<ThemeTemplateItem[]>(defaultTemplates);
  const [images, setImages] = useState<ImageItem[]>(defaultImages);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(defaultGallery);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>(defaultMusicTracks);
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [wishes, setWishes] = useState<WishRecord[]>(defaultWishes);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(defaultAnalytics);
  const [loading, setLoading] = useState(true);

  // Realtime listeners for Firestore
  useEffect(() => {
    let unsubscribeSettings: () => void = () => {};
    let unsubscribeHero: () => void = () => {};
    let unsubscribeTemplates: () => void = () => {};
    let unsubscribeImages: () => void = () => {};
    let unsubscribeGallery: () => void = () => {};
    let unsubscribeMusic: () => void = () => {};
    let unsubscribeReviews: () => void = () => {};
    let unsubscribeWishes: () => void = () => {};

    try {
      // 1. Settings listener
      const settingsRef = doc(db, "settings", "main");
      unsubscribeSettings = onSnapshot(
        settingsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setSettings({ ...defaultSettings, ...snapshot.data() } as WebsiteSettings);
          }
        },
        (err) => console.log("Settings listener notice:", err.message)
      );

      // 2. Hero listener
      const heroRef = doc(db, "hero", "main");
      unsubscribeHero = onSnapshot(
        heroRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setHero({ ...defaultHero, ...snapshot.data() } as HeroSectionConfig);
          }
        },
        (err) => console.log("Hero listener notice:", err.message)
      );

      // 3. Templates listener
      const templatesRef = collection(db, "templates");
      unsubscribeTemplates = onSnapshot(
        templatesRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ThemeTemplateItem[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as ThemeTemplateItem);
            });
            list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setTemplates(list);
          }
        },
        (err) => console.log("Templates listener notice:", err.message)
      );

      // 4. Images listener
      const imagesRef = collection(db, "image_library");
      unsubscribeImages = onSnapshot(
        imagesRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ImageItem[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as ImageItem);
            });
            setImages(list);
          }
        },
        (err) => console.log("Images listener notice:", err.message)
      );

      // 5. Gallery listener
      const galleryRef = collection(db, "photo_gallery");
      unsubscribeGallery = onSnapshot(
        galleryRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: GalleryPhoto[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as GalleryPhoto);
            });
            list.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
            setGallery(list);
          }
        },
        (err) => console.log("Gallery listener notice:", err.message)
      );

      // 6. Music listener
      const musicRef = collection(db, "music_library");
      unsubscribeMusic = onSnapshot(
        musicRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: MusicTrack[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as MusicTrack);
            });
            setMusicTracks(list);
          }
        },
        (err) => console.log("Music listener notice:", err.message)
      );

      // 7. Reviews listener
      const reviewsRef = collection(db, "reviews");
      unsubscribeReviews = onSnapshot(
        reviewsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: ReviewItem[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as ReviewItem);
            });
            setReviews(list);
          }
        },
        (err) => console.log("Reviews listener notice:", err.message)
      );

      // 8. Wishes listener
      const wishesRef = collection(db, "wishes");
      unsubscribeWishes = onSnapshot(
        wishesRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: WishRecord[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as WishRecord);
            });
            setWishes(list);
          }
        },
        (err) => console.log("Wishes listener notice:", err.message)
      );
    } catch (e) {
      console.warn("Firestore listener setup error:", e);
    } finally {
      setLoading(false);
    }

    return () => {
      unsubscribeSettings();
      unsubscribeHero();
      unsubscribeTemplates();
      unsubscribeImages();
      unsubscribeGallery();
      unsubscribeMusic();
      unsubscribeReviews();
      unsubscribeWishes();
    };
  }, []);

  // Seed default data if database is empty (called on admin init or demand)
  const seedInitialDataIfEmpty = async () => {
    try {
      // Seed settings
      await setDoc(doc(db, "settings", "main"), defaultSettings, { merge: true });
      await setDoc(doc(db, "hero", "main"), defaultHero, { merge: true });

      // Seed templates if empty
      const tSnap = await getDocs(collection(db, "templates"));
      if (tSnap.empty) {
        for (const item of defaultTemplates) {
          await setDoc(doc(db, "templates", item.id), item);
        }
      }

      // Seed images if empty
      const iSnap = await getDocs(collection(db, "image_library"));
      if (iSnap.empty) {
        for (const item of defaultImages) {
          await setDoc(doc(db, "image_library", item.id), item);
        }
      }

      // Seed gallery if empty
      const gSnap = await getDocs(collection(db, "photo_gallery"));
      if (gSnap.empty) {
        for (const item of defaultGallery) {
          await setDoc(doc(db, "photo_gallery", item.id), item);
        }
      }

      // Seed music if empty
      const mSnap = await getDocs(collection(db, "music_library"));
      if (mSnap.empty) {
        for (const item of defaultMusicTracks) {
          await setDoc(doc(db, "music_library", item.id), item);
        }
      }

      // Seed reviews if empty
      const rSnap = await getDocs(collection(db, "reviews"));
      if (rSnap.empty) {
        for (const item of defaultReviews) {
          await setDoc(doc(db, "reviews", item.id), item);
        }
      }

      // Seed wishes if empty
      const wSnap = await getDocs(collection(db, "wishes"));
      if (wSnap.empty) {
        for (const item of defaultWishes) {
          await setDoc(doc(db, "wishes", item.id), item);
        }
      }
    } catch (e) {
      console.warn("Seeding notice:", e);
    }
  };

  // 1. Settings Update
  const updateSettings = async (data: WebsiteSettings) => {
    setSettings(data);
    try {
      await setDoc(doc(db, "settings", "main"), data, { merge: true });
    } catch (e) {
      console.error("Error updating settings:", e);
    }
  };

  // 2. Hero Update
  const updateHero = async (data: HeroSectionConfig) => {
    setHero(data);
    try {
      await setDoc(doc(db, "hero", "main"), data, { merge: true });
    } catch (e) {
      console.error("Error updating hero:", e);
    }
  };

  // 3. Template CRUD
  const saveTemplate = async (template: ThemeTemplateItem) => {
    const updatedList = templates.some((t) => t.id === template.id)
      ? templates.map((t) => (t.id === template.id ? template : t))
      : [...templates, template];
    setTemplates(updatedList);
    try {
      await setDoc(doc(db, "templates", template.id), template, { merge: true });
    } catch (e) {
      console.error("Error saving template:", e);
    }
  };

  const deleteTemplate = async (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteDoc(doc(db, "templates", id));
    } catch (e) {
      console.error("Error deleting template:", e);
    }
  };

  const duplicateTemplate = async (template: ThemeTemplateItem) => {
    const newId = `template-${Date.now()}`;
    const dup: ThemeTemplateItem = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
      orderIndex: templates.length + 1,
    };
    await saveTemplate(dup);
  };

  const reorderTemplates = async (newList: ThemeTemplateItem[]) => {
    const indexed = newList.map((t, idx) => ({ ...t, orderIndex: idx + 1 }));
    setTemplates(indexed);
    try {
      for (const item of indexed) {
        await setDoc(doc(db, "templates", item.id), { orderIndex: item.orderIndex }, { merge: true });
      }
    } catch (e) {
      console.error("Error reordering templates:", e);
    }
  };

  // 4. Image CRUD
  const addImage = async (image: ImageItem) => {
    setImages((prev) => [image, ...prev]);
    try {
      await setDoc(doc(db, "image_library", image.id), image, { merge: true });
    } catch (e) {
      console.error("Error adding image:", e);
    }
  };

  const deleteImage = async (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    try {
      await deleteDoc(doc(db, "image_library", id));
    } catch (e) {
      console.error("Error deleting image:", e);
    }
  };

  // 5. Gallery CRUD
  const saveGalleryPhoto = async (photo: GalleryPhoto) => {
    const updated = gallery.some((g) => g.id === photo.id)
      ? gallery.map((g) => (g.id === photo.id ? photo : g))
      : [...gallery, photo];
    setGallery(updated);
    try {
      await setDoc(doc(db, "photo_gallery", photo.id), photo, { merge: true });
    } catch (e) {
      console.error("Error saving gallery photo:", e);
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    try {
      await deleteDoc(doc(db, "photo_gallery", id));
    } catch (e) {
      console.error("Error deleting gallery photo:", e);
    }
  };

  // 6. Music CRUD
  const saveMusicTrack = async (track: MusicTrack) => {
    let updated = musicTracks.map((m) => (m.id === track.id ? track : m));
    if (!musicTracks.some((m) => m.id === track.id)) {
      updated = [...updated, track];
    }
    if (track.isDefault) {
      updated = updated.map((m) => ({ ...m, isDefault: m.id === track.id }));
    }
    setMusicTracks(updated);
    try {
      for (const item of updated) {
        await setDoc(doc(db, "music_library", item.id), item, { merge: true });
      }
    } catch (e) {
      console.error("Error saving music track:", e);
    }
  };

  const deleteMusicTrack = async (id: string) => {
    setMusicTracks((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteDoc(doc(db, "music_library", id));
    } catch (e) {
      console.error("Error deleting music track:", e);
    }
  };

  // 7. Review CRUD
  const saveReview = async (review: ReviewItem) => {
    const updated = reviews.some((r) => r.id === review.id)
      ? reviews.map((r) => (r.id === review.id ? review : r))
      : [review, ...reviews];
    setReviews(updated);
    try {
      await setDoc(doc(db, "reviews", review.id), review, { merge: true });
    } catch (e) {
      console.error("Error saving review:", e);
    }
  };

  const deleteReview = async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (e) {
      console.error("Error deleting review:", e);
    }
  };

  // 8. Wishes CRUD
  const deleteWish = async (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
    try {
      await deleteDoc(doc(db, "wishes", id));
    } catch (e) {
      console.error("Error deleting wish:", e);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        settings,
        hero,
        templates,
        images,
        gallery,
        musicTracks,
        reviews,
        wishes,
        analytics,
        loading,
        updateSettings,
        updateHero,
        saveTemplate,
        deleteTemplate,
        duplicateTemplate,
        reorderTemplates,
        addImage,
        deleteImage,
        saveGalleryPhoto,
        deleteGalleryPhoto,
        saveMusicTrack,
        deleteMusicTrack,
        saveReview,
        deleteReview,
        deleteWish,
        seedInitialDataIfEmpty,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
