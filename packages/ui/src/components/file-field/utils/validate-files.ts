import type { FileRejection, FileRejectionReason } from "../types";
import { acceptMatches } from "./accept-matches";

/** The restrictions a file field checks. Each is optional and independent. */
export interface FileRestrictions {
  accept?: string;
  /** Largest size of one file, in bytes. */
  maxSize?: number;
  /** Smallest size of one file, in bytes. */
  minSize?: number;
  /** Most items the value can hold. */
  maxFiles?: number;
  /** Largest total size of the value, in bytes. */
  maxTotalSize?: number;
}

/** What the value already holds, for the count and total-size limits. */
export interface CurrentFiles {
  count: number;
  /** Sum of the known sizes. */
  totalSize: number;
}

/**
 * Splits picked files into accepted and rejected. Type and size are checked per file; then the
 * count and the total size are checked in pick order, counting only the files accepted so far.
 */
export function validateFiles(
  files: readonly File[],
  current: CurrentFiles,
  restrictions: FileRestrictions,
): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  let count = current.count;
  let total = current.totalSize;

  for (const file of files) {
    const reasons: FileRejectionReason[] = [];
    if (!acceptMatches(file, restrictions.accept)) reasons.push("type");
    if (restrictions.maxSize !== undefined && file.size > restrictions.maxSize) {
      reasons.push("size-max");
    }
    if (restrictions.minSize !== undefined && file.size < restrictions.minSize) {
      reasons.push("size-min");
    }
    if (reasons.length === 0) {
      if (restrictions.maxFiles !== undefined && count >= restrictions.maxFiles) {
        reasons.push("count");
      } else if (
        restrictions.maxTotalSize !== undefined &&
        total + file.size > restrictions.maxTotalSize
      ) {
        reasons.push("total-size");
      }
    }
    if (reasons.length > 0) {
      rejected.push({ file, reasons });
    } else {
      accepted.push(file);
      count += 1;
      total += file.size;
    }
  }
  return { accepted, rejected };
}
