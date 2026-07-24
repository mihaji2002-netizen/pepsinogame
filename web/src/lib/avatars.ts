import { labForLevel } from "./constants";
import type { AvatarKey, Gender, LabId } from "./types";

export const AVATAR_KEYS: AvatarKey[] = [1, 2, 3];

export const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: "female", label: "دختر" },
  { id: "male", label: "پسر" },
];

export type AvatarOption = {
  key: AvatarKey;
  gender: Gender;
  labId: LabId;
  src: string;
  label: string;
};

const avatarLabels: Record<Gender, Record<AvatarKey, string>> = {
  female: { 1: "استایل ۱", 2: "استایل ۲", 3: "استایل ۳" },
  male: { 1: "استایل ۱", 2: "استایل ۲", 3: "استایل ۳" },
};

export function avatarImagePath(
  labId: LabId,
  gender: Gender,
  avatarKey: AvatarKey,
) {
  return `/labs/avatars/${labId}/${gender}-${avatarKey}.png`;
}

export function listAvatarsForGender(
  gender: Gender,
  labId: LabId = "neuro",
): AvatarOption[] {
  return AVATAR_KEYS.map((key) => ({
    key,
    gender,
    labId,
    src: avatarImagePath(labId, gender, key),
    label: avatarLabels[gender][key],
  }));
}

export function resolveStudentAvatar(
  student: { gender: Gender; avatarKey: AvatarKey; level: number },
  labId?: LabId,
) {
  const lab = labId ?? labForLevel(student.level).id;
  return avatarImagePath(lab, student.gender, student.avatarKey);
}

export function defaultAvatarKey(): AvatarKey {
  return 1;
}

export function defaultGender(): Gender {
  return "female";
}
