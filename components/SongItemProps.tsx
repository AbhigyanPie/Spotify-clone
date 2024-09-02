"use client";
import { Song } from "@/types";

export interface SongItemProps {
  data: Song;
  onClick: { id: string };
  void: any;
}
