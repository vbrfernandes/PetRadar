import api from "../../../core/api";

import type {
  DeleteProfilePayload,
  ProfilePhotoUploadResponse,
  ProfileUpdatePayload,
  UserProfile,
} from "../types/profile.types";

export const profileService = {
  getProfile: () =>
    api.get<UserProfile>("/auth/me"),

  updateProfile: (
    payload: ProfileUpdatePayload,
  ) =>
    api.put<UserProfile>("/auth/me", payload),

  uploadProfilePhoto: (
    formData: FormData,
  ) =>
    api.post<ProfilePhotoUploadResponse>("/auth/me/foto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteProfile: (
    payload: DeleteProfilePayload,
  ) =>
    api.delete("/auth/me", {
      data: payload,
    }),
};
