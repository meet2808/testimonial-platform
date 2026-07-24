import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import config from '../config/app.config';
import fs from 'fs';

// ─── Ensure Upload Directory Exists ──────────────────────────────────────────
const uploadDir = path.resolve(config.upload.dir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── Disk Storage Configuration ───────────────────────────────────────────────
// Files are saved with a UUID-based name to:
//   1. Prevent filename collisions
//   2. Prevent path traversal attacks from malicious original filenames
//   3. Avoid leaking customer-provided filenames

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// ─── File Filter ──────────────────────────────────────────────────────────────
// Double validation: check both MIME type AND file extension.
// Checking only MIME type can be spoofed; checking both adds defense in depth.

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const mimeAllowed = config.upload.allowedMimeTypes.includes(file.mimetype);
  const ext = path.extname(file.originalname).toLowerCase();
  const extAllowed = config.upload.allowedExtensions.includes(ext);

  if (mimeAllowed && extAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only .jpg, .jpeg, and .png files are allowed.`
      )
    );
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeMb * 1024 * 1024, // Convert MB to bytes
  },
});
