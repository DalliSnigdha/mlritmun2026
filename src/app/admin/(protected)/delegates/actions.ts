"use server";

import { revalidatePath } from "next/cache";
import {
  assignRoom,
  autoAssign,
  bulkCreateDelegates,
  createDelegate,
  deleteDelegate,
  updateDelegate,
  type DelegateInput,
} from "@/lib/delegates";

function parseDelegateForm(formData: FormData): DelegateInput {
  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    institution: String(formData.get("institution") ?? "").trim(),
    committee: String(formData.get("committee") ?? "").trim(),
    gender: String(formData.get("gender") ?? "").trim(),
    source: String(formData.get("source") ?? "priority").trim(),
    needsRoom: formData.get("needsRoom") !== "false",
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

export async function createDelegateAction(formData: FormData) {
  const input = parseDelegateForm(formData);
  if (!input.fullName) return;
  createDelegate(input);
  revalidatePath("/admin/delegates");
  revalidatePath("/admin");
}

export async function updateDelegateAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  updateDelegate(id, parseDelegateForm(formData));
  revalidatePath("/admin/delegates");
}

export async function deleteDelegateAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  deleteDelegate(id);
  revalidatePath("/admin/delegates");
  revalidatePath("/admin");
}

export async function assignRoomAction(formData: FormData) {
  const delegateId = String(formData.get("delegateId") ?? "");
  const roomId = String(formData.get("roomId") ?? "");
  if (!delegateId) return;
  assignRoom(delegateId, roomId || null);
  revalidatePath("/admin/delegates");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
}

export async function autoAssignAction() {
  autoAssign();
  revalidatePath("/admin/delegates");
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
}

/** CSV import — called directly from the client with already-mapped rows
 *  (mapping raw CSV headers to our fields happens in the browser, since it
 *  needs the user's input to resolve arbitrary Google Forms column names). */
export async function importDelegatesAction(rows: DelegateInput[]): Promise<number> {
  const valid = rows.filter((r) => r.fullName.trim().length > 0);
  const count = bulkCreateDelegates(valid);
  revalidatePath("/admin/delegates");
  revalidatePath("/admin");
  return count;
}
