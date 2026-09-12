// Firebase v10 modular SDK, loaded straight from Google's CDN.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCz-MKz-afqCHbQjymQrPnZ2qPywl4-PQc",
  authDomain: "deepsikhatt.firebaseapp.com",
  projectId: "deepsikhatt",
  storageBucket: "deepsikhatt.firebasestorage.app",
  messagingSenderId: "108749708198",
  appId: "1:108749708198:web:1de5a330ce6266ccbfcd67",
  measurementId: "G-PSGHFXX4BX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Expected shape for each document in the "videos" collection:
//   title:   string
//   caption: string   (or "description")
//   likes:   number
//   image:   string   (thumbnail URL, or "thumbnail")
//   links:   array of { label, url }   (or { title, url })
// Adjust the field names below if your documents use different keys.
function mapDoc(doc){
  const d = doc.data();
  return {
    id: doc.id,
    title: d.title || "Untitled",
    caption: d.caption || d.description || "",
    likes: Number(d.likes) || 0,
    image: d.image || d.thumbnail || `https://picsum.photos/seed/${doc.id}/600/338`,
    links: Array.isArray(d.links)
      ? d.links.map(l => ({
          label: l.label || l.title || l.name || "Link",
          url: l.url || l.link || "#"
        }))
      : []
  };
}

async function loadVideos(){
  try {
    const snap = await getDocs(collection(db, "videos"));
    const videosData = snap.docs.map(mapDoc);
    window.setVideos(videosData);
  } catch (err) {
    console.error("Failed to load videos from Firestore:", err);
    window.showLoadError("Couldn't load videos — check your connection");
  }
}

loadVideos();
