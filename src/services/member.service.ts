import apiClient from '@/utils/axios';
import type { ApiResponse, Member } from '@/types';

export interface UpdateMemberProfileData {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

export const memberService = {
  getProfile: async (): Promise<ApiResponse<{ member: Member }>> => {
    const response = await apiClient.get<ApiResponse<{ member: Member }>>('/members/profile');
    return response.data;
  },

  updateProfile: async (
    data: UpdateMemberProfileData
  ): Promise<ApiResponse<{ member: Member }>> => {
    const response = await apiClient.put<ApiResponse<{ member: Member }>>('/members/profile', data);
    return response.data;
  },
};

