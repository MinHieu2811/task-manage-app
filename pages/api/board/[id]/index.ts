import { getCollectionDoc } from "@/utils/get-collection-snapshot";
import { db } from "config/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../../models/index";
// import { getCollectionDoc } from "../../../utils/index";

interface ActionProps {
  message: string
  success?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardData[] | ActionProps>
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

    // res.status(200).json([{
    //   boardData: {},
    //   boardId: ''
    // }]);
    } catch(err) {
      res.status(200).json({
        message: 'Can not get board!'
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      res.status(200).json({
        message: "Delete successfully!",
        success: true,
      });
    } catch (error) {
      res.status(404).json({
        message: "Delete failed!",
        success: false,
      });
    }
  }
}
