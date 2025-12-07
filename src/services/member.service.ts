import apiClient from '@/lib/apiClient';
import type { ApiResponse, Member } from '@/types';

export interface UpdateMemberProfileData {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImage?: File;
}

export const memberService = {
  getProfile: async (): Promise<ApiResponse<{ member: Member }>> => {
    const response = await apiClient.get<ApiResponse<{ member: Member }>>('/members/profile');
    return response.data;
  },

  updateProfile: async (
    data: UpdateMemberProfileData
  ): Promise<ApiResponse<{ member: Member }>> => {
    // Check if we have a file to upload
    const hasFile = !!data.profileImage;
    
    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      if (data.firstName !== undefined) formData.append('firstName', data.firstName);
      if (data.lastName !== undefined) formData.append('lastName', data.lastName);
      if (data.mobileNumber !== undefined) formData.append('mobileNumber', data.mobileNumber);
      if (data.address !== undefined) formData.append('address', data.address);
      if (data.dateOfBirth !== undefined) formData.append('dateOfBirth', data.dateOfBirth);
      if (data.gender !== undefined) formData.append('gender', data.gender);
      
      // Add profile image
      formData.append('profileImage', data.profileImage);

      // Content-Type will be set automatically by axios with boundary for FormData
      const response = await apiClient.put<ApiResponse<{ member: Member }>>('/members/profile', formData);
      return response.data;
    } else {
      // Use JSON for regular updates without files
      const jsonData: any = {};
      if (data.firstName !== undefined) jsonData.firstName = data.firstName;
      if (data.lastName !== undefined) jsonData.lastName = data.lastName;
      if (data.mobileNumber !== undefined) jsonData.mobileNumber = data.mobileNumber;
      if (data.address !== undefined) jsonData.address = data.address;
      if (data.dateOfBirth !== undefined) jsonData.dateOfBirth = data.dateOfBirth;
      if (data.gender !== undefined) jsonData.gender = data.gender;

      const response = await apiClient.put<ApiResponse<{ member: Member }>>('/members/profile', jsonData);
      return response.data;
    }
  },
};

