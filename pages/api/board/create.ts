import { doc, setDoc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../config/firebase";
export interface ApiStatus {
  success: boolean;
  message: string;
  data?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiStatus>
) {
  if (req.method === "POST") {
    try {
      const { boardData, boardId } = req.body;
      await setDoc(doc(db, "boards", boardId), boardData);

      res.status(200).json({
        success: true,
        message: "Create board successfully!",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Create board failed!",
      });
    }
  }
}
