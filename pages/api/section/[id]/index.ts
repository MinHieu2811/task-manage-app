import { getCollectionDoc } from "@/utils/get-collection-snapshot";
import type { NextApiRequest, NextApiResponse } from "next";
import { SectionData } from "../../../../models/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SectionData[]>
) {
  if (req.method === "GET") {
    const { id } = req.query;
    let arrSection: SectionData[] = [];

    res.status(200).json(arrSection);
  }
}
