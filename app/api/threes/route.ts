import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "@/db/firebase";

export async function GET() {
  const scores: Score[] = [];
  const querySnapshot = await getDocs(collection(db, "scores"));
  querySnapshot.forEach((doc) => {
    scores.push({ id: doc.id, ...doc.data() } as Score);
  });

  return Response.json(scores);
}

export async function POST(req: Request) {
  const { name, score } = await req.json();
  if (!name || !score) {
    return Response.json(
      { message: "Name and score are required" },
      { status: 400 }
    );
  }

  const docRef = await addDoc(collection(db, "scores"), {
    name,
    score,
  });

  return Response.json({ id: docRef.id, name, score });
}
