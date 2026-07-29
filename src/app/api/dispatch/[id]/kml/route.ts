import { NextResponse } from "next/server";
import { generateKml } from "@/lib/export/kml-generator";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(req.url);
  const dep = searchParams.get("dep") || "VOBL";
  const arr = searchParams.get("arr") || "VABB";

  const kmlData = generateKml(dep, arr);

  return new NextResponse(kmlData, {
    headers: {
      "Content-Type": "application/vnd.google-earth.kml+xml",
      "Content-Disposition": `attachment; filename="${dep}-${arr}.kml"`,
    },
  });
}
