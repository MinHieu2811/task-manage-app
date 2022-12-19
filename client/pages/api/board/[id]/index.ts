import type { NextApiRequest, NextApiResponse } from "next";
import { BoardData } from "../../../../models/index";
import axios from "axios";

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

      const fetchBoard = await axios.get(`${process.env.BE_URL}/board/${id}`).then((res) => res.data)

    res.status(200).json(fetchBoard);
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
