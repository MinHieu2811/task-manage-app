import { getCollectionDoc } from "@/utils/get-collection-snapshot";
import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../../models/index";
// import { getCollectionDoc } from "../../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[]>
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
  }
}
