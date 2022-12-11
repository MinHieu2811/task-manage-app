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
      const { sectionData, sectionId } = req.body;
      await setDoc(doc(db, "section", sectionId), sectionData);

      res.status(200).json({
        success: true,
        message: "Create section successfully!",
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: "Create section failed!",
      });
    }
  }
}
