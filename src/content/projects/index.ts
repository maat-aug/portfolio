import { CPF_GEN } from "@/content/projects/cpf-gen";
import { NINX } from "@/content/projects/ninx";
import { NINX_DATA } from "@/content/projects/ninx-data";
import { VIDEO_DOWNLOADER } from "@/content/projects/video-downloader";
import type { Project } from "@/domain/project";

export const PROJECTS: readonly Project[] = [NINX, NINX_DATA, VIDEO_DOWNLOADER, CPF_GEN];
