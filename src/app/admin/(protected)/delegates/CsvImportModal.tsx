"use client";

import Papa from "papaparse";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { importDelegatesAction } from "./actions";
import type { DelegateInput } from "@/lib/delegates";

type MappableField = "fullName" | "email" | "phone" | "institution" | "committee" | "gender";

const FIELDS: { key: MappableField; label: string; required?: boolean }[] = [
  { key: "fullName", label: "Full Name", required: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "institution", label: "Institution" },
  { key: "committee", label: "Committee" },
  { key: "gender", label: "Gender" },
];

const NONE = "__none__";

export function CsvImportModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<MappableField, string>>({
    fullName: NONE,
    email: NONE,
    phone: NONE,
    institution: NONE,
    committee: NONE,
    gender: NONE,
  });
  const [needsRoomColumn, setNeedsRoomColumn] = useState(NONE);
  const [needsRoomValue, setNeedsRoomValue] = useState("Yes");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);

  function handleFile(file: File) {
    setError(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const detected = result.meta.fields ?? [];
        setHeaders(detected);
        setRows(result.data);

        // Best-effort auto-match by header name, so the common case needs no
        // manual mapping at all.
        const guess = (needle: string) =>
          detected.find((h) => h.toLowerCase().includes(needle)) ?? NONE;
        setMapping({
          fullName: guess("name"),
          email: guess("email"),
          phone: guess("phone"),
          institution: guess("institution") !== NONE ? guess("institution") : guess("school"),
          committee: guess("committee") !== NONE ? guess("committee") : guess("preference"),
          gender: guess("gender"),
        });
        const accommodationGuess = detected.find((h) => h.toLowerCase().includes("accommodation"));
        setNeedsRoomColumn(accommodationGuess ?? NONE);
      },
      error: (err) => setError(err.message),
    });
  }

  async function handleImport() {
    if (!mapping.fullName || mapping.fullName === NONE) {
      setError("Map a column to Full Name before importing.");
      return;
    }
    setImporting(true);
    setError(null);

    const inputs: DelegateInput[] = rows.map((row) => {
      const get = (field: MappableField) =>
        mapping[field] !== NONE ? (row[mapping[field]] ?? "").trim() : "";

      const needsRoom =
        needsRoomColumn === NONE
          ? true
          : (row[needsRoomColumn] ?? "").trim().toLowerCase() ===
            needsRoomValue.trim().toLowerCase();

      return {
        fullName: get("fullName"),
        email: get("email"),
        phone: get("phone"),
        institution: get("institution"),
        committee: get("committee"),
        gender: get("gender"),
        needsRoom,
        source: "priority",
      };
    });

    try {
      const count = await importDelegatesAction(inputs);
      setDone(count);
      router.refresh();
    } catch {
      setError("Import failed — please try again.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/85 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-white/10 bg-blue-900/95 p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-light text-white">Import from CSV</h2>
          <button type="button" onClick={onClose} className="text-white/50 hover:text-white">
            ✕
          </button>
        </div>

        {done !== null ? (
          <div className="mt-6">
            <p className="text-[14.5px] text-white/75">
              Imported {done} {done === 1 ? "delegate" : "delegates"}.
            </p>
            <button type="button" onClick={onClose} className="btn-primary mt-6">
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[13.5px] text-white/45">
              Export your Google Form responses as a CSV (File → Download in Google Sheets),
              then upload it here. Nothing is imported until you confirm below.
            </p>

            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="mt-5 block w-full text-[13.5px] text-white/60 file:mr-4 file:rounded-sm file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[12px] file:uppercase file:tracking-widest2 file:text-white/80"
            />

            {headers.length > 0 && (
              <div className="mt-6 space-y-4">
                <p className="text-[13px] text-white/50">
                  {rows.length} row{rows.length === 1 ? "" : "s"} detected. Match each field to a
                  column from your file.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {FIELDS.map((field) => (
                    <label key={field.key} className="block">
                      <span className="mb-1 block text-[11px] uppercase tracking-widest2 text-white/45">
                        {field.label}
                        {field.required && <span className="text-ivory-500"> *</span>}
                      </span>
                      <select
                        value={mapping[field.key]}
                        onChange={(e) =>
                          setMapping((m) => ({ ...m, [field.key]: e.target.value }))
                        }
                        className="w-full rounded-sm border border-white/15 bg-white/[0.04] px-2.5 py-2 text-[13px] text-white"
                      >
                        <option value={NONE}>— none —</option>
                        {headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>

                <div className="rounded-sm border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-widest2 text-white/45">
                    Needs Accommodation
                  </p>
                  <p className="mt-1 text-[12.5px] text-white/40">
                    Every row is imported either way — this just flags which ones actually
                    asked for a room, so they show up in the assignment queue.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <select
                      value={needsRoomColumn}
                      onChange={(e) => setNeedsRoomColumn(e.target.value)}
                      className="rounded-sm border border-white/15 bg-white/[0.04] px-2.5 py-2 text-[13px] text-white"
                    >
                      <option value={NONE}>— assume everyone needs one —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    {needsRoomColumn !== NONE && (
                      <input
                        value={needsRoomValue}
                        onChange={(e) => setNeedsRoomValue(e.target.value)}
                        placeholder="Value that means yes, e.g. Yes"
                        className="rounded-sm border border-white/15 bg-white/[0.04] px-2.5 py-2 text-[13px] text-white"
                      />
                    )}
                  </div>
                </div>

                {error && <p className="text-[13px] text-red-300">{error}</p>}

                <button
                  type="button"
                  onClick={handleImport}
                  disabled={importing}
                  className="btn-primary w-full justify-center"
                >
                  {importing ? "Importing…" : `Import ${rows.length} Rows`}
                </button>
              </div>
            )}

            {error && headers.length === 0 && (
              <p className="mt-4 text-[13px] text-red-300">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
