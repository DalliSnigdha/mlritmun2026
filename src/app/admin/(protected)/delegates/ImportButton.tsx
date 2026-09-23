"use client";

import { useState } from "react";
import { CsvImportModal } from "./CsvImportModal";

export function ImportButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-ghost">
        Import CSV
      </button>
      {open && <CsvImportModal onClose={() => setOpen(false)} />}
    </>
  );
}
