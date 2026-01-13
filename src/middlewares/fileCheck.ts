import { NextFunction, Response, Request } from "express";
const MAX_BYTES = 5 * 1024 * 1024;
const PDF_MAGIC = Buffer.from("%PDF-");

export function validatePdfUpload(req: Request, res: Response, next: NextFunction) {
  let total = 0;
  let headerChecked = false;
  const header = Buffer.alloc(5);
  let headerOffset = 0;

  req.on("data", (chunk: Buffer) => {
    total += chunk.length;

    // Hard size limit
    if (total > MAX_BYTES) {
      req.destroy();
      return res.status(413).json({ error: "File exceeds 5MB limit" });
    }

    if (!headerChecked && headerOffset < 5) {
      const copyLen = Math.min(5 - headerOffset, chunk.length);
      chunk.copy(header, headerOffset, 0, copyLen);
      headerOffset += copyLen;

      if (headerOffset === 5) {
        headerChecked = true;
        if (!header.equals(PDF_MAGIC)) {
          req.destroy();
          return res.status(415).json({ error: "Only PDF files allowed" });
        }
      }
    }
  });

  req.on("end", () => next());
  req.on("error", () =>
    res.status(400).json({ error: "Upload stream error" })
  );
}
