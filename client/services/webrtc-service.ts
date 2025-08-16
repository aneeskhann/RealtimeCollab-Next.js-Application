export interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export interface MediaState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}

class WebRTCService {
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, PeerConnection> = new Map();
  private onTrackCallback?: (peerId: string, stream: MediaStream) => void;
  private onPeerConnectionCallback?: (peerId: string, connection: RTCPeerConnection) => void;
  private onIceCandidateCallback?: (peerId: string, candidate: RTCIceCandidate) => void;
  private onScreenSharingChangedCallback?: (isScreenSharing: boolean, stream: MediaStream | null) => void;
  private screenStream: MediaStream | null = null;

  // Configuration
  private readonly rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Initialize local media stream
  async initializeLocalStream(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      console.log('🚀 WebRTCService: Initializing local stream with constraints:', constraints);
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ WebRTCService: Local stream obtained successfully:', this.localStream);
      console.log('📹 WebRTCService: Video tracks:', this.localStream.getVideoTracks());
      console.log('🎤 WebRTCService: Audio tracks:', this.localStream.getAudioTracks());
      
      return this.localStream;
    } catch (error) {
      console.error('❌ WebRTCService: Failed to access media devices:', error);
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  }

  // Get current active stream (camera or screen sharing)
  getCurrentStream(): MediaStream | null {
    return this.screenStream || this.localStream;
  }

  // Get local stream
  getLocalStream(): MediaStream | null {
    console.log('🔍 WebRTCService: Getting local stream:', this.localStream);
    return this.localStream;
  }

  // Check if peer connection exists
  hasPeerConnection(peerId: string): boolean {
    return this.peerConnections.has(peerId);
  }

  // Create peer connection
  async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    console.log('🔗 WebRTCService: Creating peer connection for:', peerId);
    
    // Check if connection already exists
    if (this.peerConnections.has(peerId)) {
      console.log('⚠️ WebRTCService: Peer connection already exists for:', peerId);
      return this.peerConnections.get(peerId)!.connection;
    }
    
    const connection = new RTCPeerConnection(this.rtcConfig);
    
    // Add local tracks to the connection
    if (this.localStream) {
      console.log('📤 WebRTCService: Adding local tracks to peer connection');
      this.localStream.getTracks().forEach(track => {
        console.log('📤 WebRTCService: Adding track:', track.kind, track.enabled);
        connection.addTrack(track, this.localStream!);
      });
    } else {
      console.warn('⚠️ WebRTCService: No local stream available for peer connection');
    }

    // Handle incoming tracks
    connection.ontrack = (event) => {
      console.log('🎥 WebRTCService: Received track from peer:', peerId, event.streams);
      if (this.onTrackCallback) {
        this.onTrackCallback(peerId, event.streams[0]);
      }
    };

    // Handle ICE candidates
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 WebRTCService: ICE candidate generated for peer:', peerId);
        // Emit ICE candidate through callback
        if (this.onIceCandidateCallback) {
          this.onIceCandidateCallback(peerId, event.candidate);
        }
      }
    };

    // Store the connection
    this.peerConnections.set(peerId, { id: peerId, connection });
    console.log('💾 WebRTCService: Stored peer connection for:', peerId);
    
    if (this.onPeerConnectionCallback) {
      this.onPeerConnectionCallback(peerId, connection);
    }

    return connection;
  }

  // Remove peer connection
  removePeerConnection(peerId: string): void {
    console.log('🗑️ WebRTCService: Removing peer connection for:', peerId);
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      peer.connection.close();
      this.peerConnections.delete(peerId);
    }
  }

  // Create offer
  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit> {
    console.log('📤 WebRTCService: Creating offer for peer:', peerId);
    const connection = await this.createPeerConnection(peerId);
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    console.log('✅ WebRTCService: Offer created successfully for peer:', peerId);
    return offer;
  }

  // Create answer
  async createAnswer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    console.log('📤 WebRTCService: Creating answer for peer:', peerId);
    const connection = await this.createPeerConnection(peerId);
    await connection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);
    console.log('✅ WebRTCService: Answer created successfully for peer:', peerId);
    return answer;
  }

  // Set remote description
  async setRemoteDescription(peerId: string, description: RTCSessionDescriptionInit): Promise<void> {
    console.log('📥 WebRTCService: Setting remote description for peer:', peerId);
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      await peer.connection.setRemoteDescription(new RTCSessionDescription(description));
      console.log('✅ WebRTCService: Remote description set for peer:', peerId);
    } else {
      console.warn('⚠️ WebRTCService: No peer connection found for:', peerId);
    }
  }

  // Add ICE candidate
  async addIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
    console.log('🧊 WebRTCService: Adding ICE candidate for peer:', peerId);
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('✅ WebRTCService: ICE candidate added for peer:', peerId);
    } else {
      console.warn('⚠️ WebRTCService: No peer connection found for:', peerId);
    }
  }

  // Toggle video
  toggleVideo(enabled: boolean): void {
    console.log('📹 WebRTCService: Toggling video:', enabled);
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = enabled;
        console.log('📹 WebRTCService: Video track enabled:', track.enabled);
      });
    } else {
      console.warn('⚠️ WebRTCService: No local stream to toggle video');
    }
  }

  // Toggle audio
  toggleAudio(enabled: boolean): void {
    console.log('🎤 WebRTCService: Toggling audio:', enabled);
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = enabled;
        console.log('🎤 WebRTCService: Audio track enabled:', track.enabled);
      });
    } else {
      console.warn('⚠️ WebRTCService: No local stream to toggle audio');
    }
  }

  // Start screen sharing
  async startScreenSharing(): Promise<MediaStream> {
    try {
      console.log('🖥️ WebRTCService: Starting screen sharing');
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor"
        },
        audio: false
      });

      // Store screen stream
      this.screenStream = screenStream;

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      this.peerConnections.forEach(peer => {
        const sender = peer.connection.getSenders().find(s => 
          s.track?.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      // Notify about screen sharing started
      if (this.onScreenSharingChangedCallback) {
        this.onScreenSharingChangedCallback(true, screenStream);
      }

      console.log('✅ WebRTCService: Screen sharing started successfully');
      return screenStream;
    } catch (error) {
      console.error('❌ WebRTCService: Failed to start screen sharing:', error);
      throw new Error('Failed to start screen sharing');
    }
  }

  // Stop screen sharing
  stopScreenSharing(): void {
    console.log('🖥️ WebRTCService: Stopping screen sharing');
    
    if (this.screenStream) {
      // Stop screen sharing tracks
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
      
      // Restore camera video track
      if (this.localStream) {
        this.peerConnections.forEach(peer => {
          const sender = peer.connection.getSenders().find(s => 
            s.track?.kind === 'video'
          );
          if (sender && this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
              sender.replaceTrack(videoTrack);
              console.log('✅ WebRTCService: Restored camera track for peer:', peer.id);
            }
          }
        });
      }

      // Notify about screen sharing stopped
      if (this.onScreenSharingChangedCallback) {
        this.onScreenSharingChangedCallback(false, this.localStream);
      }

      console.log('✅ WebRTCService: Screen sharing stopped, camera restored');
    }
  }

  // Set callbacks
  onTrack(callback: (peerId: string, stream: MediaStream) => void): void {
    console.log('🎯 WebRTCService: Setting onTrack callback');
    this.onTrackCallback = callback;
  }

  onPeerConnection(callback: (peerId: string, connection: RTCPeerConnection) => void): void {
    console.log('🎯 WebRTCService: Setting onPeerConnection callback');
    this.onPeerConnectionCallback = callback;
  }

  onIceCandidate(callback: (peerId: string, candidate: RTCIceCandidate) => void): void {
    console.log('🎯 WebRTCService: Setting onIceCandidate callback');
    this.onIceCandidateCallback = callback;
  }

  setScreenSharingCallback(callback: (isScreenSharing: boolean, stream: MediaStream | null) => void): void {
    console.log('🎯 WebRTCService: Setting onScreenSharingChanged callback');
    this.onScreenSharingChangedCallback = callback;
  }

  // Cleanup
  cleanup(): void {
    console.log('🧹 WebRTCService: Cleaning up...');
    this.peerConnections.forEach(peer => {
      peer.connection.close();
    });
    this.peerConnections.clear();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }

    console.log('✅ WebRTCService: Cleanup completed');
  }

  // Get current media state
  getMediaState(): MediaState {
    if (!this.localStream) {
      return { isVideoEnabled: false, isAudioEnabled: false, isScreenSharing: false };
    }

    const videoTrack = this.localStream.getVideoTracks()[0];
    const audioTrack = this.localStream.getAudioTracks()[0];

    return {
      isVideoEnabled: videoTrack?.enabled || false,
      isAudioEnabled: audioTrack?.enabled || false,
      isScreenSharing: this.screenStream !== null,
    };
  }
}

export const webrtcService = new WebRTCService();
