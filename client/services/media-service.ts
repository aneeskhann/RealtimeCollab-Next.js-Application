// Media service for handling video/audio operations
export interface MediaConstraints {
  video: boolean
  audio: boolean
}

class MediaService {
  private localStream: MediaStream | null = null

  async getUserMedia(constraints: MediaConstraints): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      return this.localStream
    } catch (error) {
      throw new Error("Failed to access media devices")
    }
  }

  async getDisplayMedia(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })
    } catch (error) {
      throw new Error("Failed to access screen sharing")
    }
  }

  stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }
}

export const mediaService = new MediaService()
