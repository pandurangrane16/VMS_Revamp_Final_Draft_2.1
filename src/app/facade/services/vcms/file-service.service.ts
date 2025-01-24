import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
  constructor() {}

  checkFileType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();

    // List of image file extensions
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    // List of video file extensions
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'webm'];

    // Check if the file is an image
    if (imageExtensions.includes(extension!)) {
      return 'image';
    }

    // Check if the file is a video
    if (videoExtensions.includes(extension!)) {
      return 'video';
    }

    return 'unknown'; // If not image or video
  }
}
