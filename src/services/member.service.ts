import apiClient from '@/lib/apiClient';
import type { ApiResponse, Member } from '@/types';

export interface UpdateMemberProfileData {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: File | string;
}

export const memberService = {
  getProfile: async (): Promise<ApiResponse<{ member: Member }>> => {
    const response = await apiClient.get<ApiResponse<{ member: Member }>>('/members/profile');
    return response.data;
  },

  updateProfile: async (
    data: UpdateMemberProfileData
  ): Promise<ApiResponse<{ member: Member }>> => {
    // If profilePicture is a File, use FormData for multipart upload
    if (data.profilePicture instanceof File) {
      const formData = new FormData();
      
      // Append all fields to FormData
      if (data.firstName) formData.append('firstName', data.firstName);
      if (data.lastName) formData.append('lastName', data.lastName);
      if (data.mobileNumber) formData.append('mobileNumber', data.mobileNumber);
      if (data.address) formData.append('address', data.address);
      if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
      if (data.gender) formData.append('gender', data.gender);
      formData.append('profilePicture', data.profilePicture);
      
      const response = await apiClient.put<ApiResponse<{ member: Member }>>(
        '/members/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    }
    
    // Otherwise, send as JSON
    const response = await apiClient.put<ApiResponse<{ member: Member }>>('/members/profile', data);
    return response.data;
  },
};

