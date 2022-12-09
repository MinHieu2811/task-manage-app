import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../models/index";
import { getCollectionDoc } from "../../../utils/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[]>
) {
  if (req.method === "POST") {
    const { userUid } = req.body;
    let arrBoard: BoardData[] = [];
    (await getCollectionDoc("boards"))?.forEach((item) => {
      if (item?.data() && item?.data()?.userId === req.body) {
        console.log(item?.data().userId === userUid);
        arrBoard = [
          ...arrBoard,
          { boardData: item?.data(), boardId: item?.id },
        ] as BoardData[];
      }
    });

    res.status(200).json(arrBoard);
  }
}
