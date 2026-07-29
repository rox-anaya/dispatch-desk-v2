import { NextResponse } from "next/server";
import { generateFplXml } from "@/lib/export/fpl-generator";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(req.url);
  const dep = searchParams.get("dep") || "VOBL";
  const arr = searchParams.get("arr") || "VABB";

  const xmlData = generateFplXml(dep, arr);

  return new NextResponse(xmlData, {
    headers: {
      "Content-Type": "application/xml",
      "Content-Disposition": `attachment; filename="${dep}-${arr}.fpl"`,
    },
  });
}
