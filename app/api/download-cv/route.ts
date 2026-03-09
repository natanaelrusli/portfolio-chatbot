import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const CV_FILENAME = "Nata Nael CV.pdf";

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), "data", CV_FILENAME);
    const buffer = await readFile(filePath);
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get("preview") === "1";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": isPreview
          ? "inline"
          : `attachment; filename="${CV_FILENAME}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("CV download error:", err);
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}
