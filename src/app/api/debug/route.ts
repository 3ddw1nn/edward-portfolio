import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Check if globals.css exists and its content
    const globalsCssPath = path.join(
      process.cwd(),
      "src",
      "app",
      "globals.css"
    );
    const globalsCssExists = fs.existsSync(globalsCssPath);
    const globalsCssContent = globalsCssExists
      ? fs.readFileSync(globalsCssPath, "utf8")
      : "File does not exist";

    // Check postcss config
    const postcssConfigPath = path.join(process.cwd(), "postcss.config.mjs");
    const postcssConfigExists = fs.existsSync(postcssConfigPath);
    const postcssConfigContent = postcssConfigExists
      ? fs.readFileSync(postcssConfigPath, "utf8")
      : "File does not exist";

    // Check tailwind config
    const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.mjs");
    const tailwindConfigExists = fs.existsSync(tailwindConfigPath);
    const tailwindConfigContent = tailwindConfigExists
      ? fs.readFileSync(tailwindConfigPath, "utf8")
      : "File does not exist";

    // Return debug info
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      files: {
        globalsCss: {
          exists: globalsCssExists,
          content: globalsCssContent,
        },
        postcssConfig: {
          exists: postcssConfigExists,
          content: postcssConfigContent,
        },
        tailwindConfig: {
          exists: tailwindConfigExists,
          content: tailwindConfigContent,
        },
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
