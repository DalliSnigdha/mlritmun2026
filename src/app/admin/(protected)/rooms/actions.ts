"use server";

import { revalidatePath } from "next/cache";
import { createRoom, deleteRoom, updateRoom, type RoomGender } from "@/lib/rooms";

function parseRoomForm(formData: FormData) {
  return {
    block: String(formData.get("block") ?? "").trim(),
    number: String(formData.get("number") ?? "").trim(),
    capacity: Math.max(1, Number(formData.get("capacity")) || 1),
    gender: String(formData.get("gender") ?? "any") as RoomGender,
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

export async function createRoomAction(formData: FormData) {
  const input = parseRoomForm(formData);
  if (!input.block || !input.number) return;
  createRoom(input);
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
}

export async function updateRoomAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  updateRoom(id, parseRoomForm(formData));
  revalidatePath("/admin/rooms");
  revalidatePath("/admin/delegates");
}

export async function deleteRoomAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  deleteRoom(id);
  revalidatePath("/admin/rooms");
  revalidatePath("/admin/delegates");
  revalidatePath("/admin");
}
