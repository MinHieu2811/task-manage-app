import { getCollectionDoc } from "@/utils/get-collection-snapshot";
import { db } from "config/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../../models/index";
// import { getCollectionDoc } from "../../../utils/index";

interface ActionProps {
  message: string
  success: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[] | ActionProps>
) {
  if (req.method === "GET") {
    const { id } = req.query;
    let arrBoard: BoardData[] = [];

    (await getCollectionDoc("boards"))?.forEach((item) => {
      if (item?.data() && item?.data()?.userId === id) {
        arrBoard = [
          ...arrBoard,
          { boardData: item?.data(), boardId: item?.id },
        ] as BoardData[];
      }
    });

    res.status(200).json(arrBoard);
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await deleteDoc(doc(db, "boards", id as string));

      res.status(200).json({
        message: "Delete successfully!",
        success: true,
      });
    } catch (error) {
      res.status(404).json({
        message: "Delete successfully!",
        success: true,
      });
    }
  }
}
