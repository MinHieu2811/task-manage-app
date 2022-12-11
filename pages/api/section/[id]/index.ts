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

    (await getCollectionDoc("section"))?.forEach((item) => {
      if (item?.data() && item?.data()?.boardId === id) {
        arrSection = [
          ...arrSection,
          { sectionData: item?.data(), sectionId: item?.id },
        ] as SectionData[];
      }
    });

    res.status(200).json(arrSection);
  }
}
