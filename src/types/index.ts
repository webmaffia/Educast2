/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  INSTITUTION_ADMIN = 'INSTITUTION_ADMIN',
  FACULTY = 'FACULTY'
}

export enum VideoStatus {
  DRAFT = 'DRAFT',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  RENDERING = 'RENDERING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  quota: {
    maxVideosPerMonth: number;
    currentMonthVideos: number;
  };
  createdAt: number;
}

export interface User {
  id: string;
  institutionId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: number;
}

export interface Slide {
  id: string;
  content: string;
  title?: string;
  order: number;
  layout: 'FULL_SCREEN' | 'SPLIT_SCREEN';
}

export interface Video {
  id: string;
  institutionId: string;
  createdBy: string;
  title: string;
  status: VideoStatus;
  avatarId: string;
  backgroundId: string;
  slides: Slide[];
  outputUrl?: string;
  progress: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Avatar {
  id: string;
  name: string;
  heyGenId: string;
  previewImageUrl: string;
  gender: 'MALE' | 'FEMALE';
}

export interface Background {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}
