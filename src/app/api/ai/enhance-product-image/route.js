import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request) {
  try {
    // No authentication required
    const formData = await request.formData();
    const file = formData.get("image");
    const style = formData.get("style");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No image uploaded" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Apply enhancements based on style
    let enhancedBuffer;

    switch (style) {
      case "professional":
        enhancedBuffer = await sharp(buffer)
          .resize(1000, 1000, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .flatten({ background: "#ffffff" })
          .modulate({ brightness: 1.1, saturation: 1.2 })
          .sharpen()
          .png()
          .toBuffer();
        break;

      case "clean":
        enhancedBuffer = await sharp(buffer)
          .resize(1000, 1000, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .flatten({ background: "#ffffff" })
          .modulate({ brightness: 1.05 })
          .png()
          .toBuffer();
        break;

      case "luxury":
        enhancedBuffer = await sharp(buffer)
          .resize(1000, 1000, {
            fit: "contain",
            background: { r: 240, g: 240, b: 245, alpha: 1 },
          })
          .flatten({ background: "#f0f0f5" })
          .modulate({ brightness: 1.15, saturation: 1.3 })
          .sharpen(2)
          .png()
          .toBuffer();
        break;

      case "minimal":
        enhancedBuffer = await sharp(buffer)
          .resize(1000, 1000, {
            fit: "contain",
            background: { r: 248, g: 248, b: 248, alpha: 1 },
          })
          .flatten({ background: "#f8f8f8" })
          .modulate({ brightness: 1.08, saturation: 1.1 })
          .png()
          .toBuffer();
        break;

      default:
        enhancedBuffer = buffer;
    }

    const enhancedBase64 = `data:image/png;base64,${enhancedBuffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      enhancedImageUrl: enhancedBase64,
    });
  } catch (error) {
    console.error("Image enhancement error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enhance image" },
      { status: 500 },
    );
  }
}
