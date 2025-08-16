import { useState, useEffect, useCallback } from 'react';
import { webrtcService } from '@/services/webrtc-service';
import { emitWebRTCOffer, emitWebRTCAnswer, emitICECandidate } from '@/lib/socket';

interface ParticipantStream {
  _id: string;
  userId: {
    username: string;
    avatar?: string;
  };
  isMuted?: boolean;
  isVideoOff?: boolean;
  stream?: MediaStream;
  isLocal?: boolean;
  isScreenSharing?: boolean;
}

export const useWebRTC = (roomCode: string) => {
  const [participants, setParticipants] = useState<ParticipantStream[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize local stream
  const initializeLocalStream = useCallback(async () => {
    console.log('🚀 Initializing local media stream...');
    
    try {
      const stream = await webrtcService.initializeLocalStream();
      console.log('✅ Local stream obtained:', stream);
      
      // Add local user to participants
      const localParticipant: ParticipantStream = {
        _id: 'local',
        userId: { username: 'You', avatar: '/placeholder-user.jpg' },
        isMuted: false,
        isVideoOff: false,
        stream,
        isLocal: true,
        isScreenSharing: false
      };
      
      console.log('👤 Setting local participant:', localParticipant);
      
      setParticipants(prev => {
        console.log('🔄 Updating participants from:', prev, 'to:', [localParticipant]);
        return [localParticipant];
      });
      
      setIsInitialized(true);
      console.log('✅ Local stream initialization completed');
      
      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize local stream';
      console.error('❌ Failed to initialize local stream:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Handle incoming WebRTC offer
  const handleIncomingOffer = useCallback(async (fromPeerId: string, offer: RTCSessionDescriptionInit) => {
    console.log('📥 Received WebRTC offer from:', fromPeerId);
    
    try {
      // Create peer connection if it doesn't exist
      if (!webrtcService.hasPeerConnection(fromPeerId)) {
        webrtcService.createPeerConnection(fromPeerId);
      }
      
      // Set remote description
      await webrtcService.setRemoteDescription(fromPeerId, offer);
      
      // Create and emit answer
      const answer = await webrtcService.createAnswer(fromPeerId, offer);
      emitWebRTCAnswer(roomCode, fromPeerId, answer);
      
      console.log('✅ WebRTC offer handled successfully');
    } catch (err) {
      console.error('❌ Failed to handle WebRTC offer:', err);
    }
  }, [roomCode]);

  // Handle incoming WebRTC answer
  const handleIncomingAnswer = useCallback(async (fromPeerId: string, answer: RTCSessionDescriptionInit) => {
    console.log('📥 Received WebRTC answer from:', fromPeerId);
    
    try {
      await webrtcService.setRemoteDescription(fromPeerId, answer);
      console.log('✅ WebRTC answer handled successfully');
    } catch (err) {
      console.error('❌ Failed to handle WebRTC answer:', err);
    }
  }, []);

  // Handle incoming ICE candidate
  const handleIncomingICECandidate = useCallback(async (fromPeerId: string, candidate: RTCIceCandidate) => {
    console.log('🧊 Received ICE candidate from:', fromPeerId);
    
    try {
      await webrtcService.addIceCandidate(fromPeerId, candidate);
      console.log('✅ ICE candidate added successfully');
    } catch (err) {
      console.error('❌ Failed to add ICE candidate:', err);
    }
  }, []);

  // Handle outgoing ICE candidate
  const handleOutgoingICECandidate = useCallback((peerId: string, candidate: RTCIceCandidate) => {
    console.log('🧊 Emitting ICE candidate to:', peerId);
    emitICECandidate(roomCode, peerId, candidate);
  }, [roomCode]);

  // Create peer connection and offer
  const createPeerConnection = useCallback(async (peerId: string) => {
    console.log('🔗 Creating peer connection for:', peerId);
    
    try {
      const peerConnection = webrtcService.createPeerConnection(peerId);
      const offer = await webrtcService.createOffer(peerId);
      
      // Emit offer
      emitWebRTCOffer(roomCode, peerId, offer);
      
      console.log('✅ Peer connection created and offer sent');
    } catch (err) {
      console.error('❌ Failed to create peer connection:', err);
    }
  }, [roomCode]);

  // Update participant media state
  const updateParticipantMediaState = useCallback((participantId: string, updates: Partial<ParticipantStream>) => {
    setParticipants(prev => 
      prev.map(p => 
        p._id === participantId ? { ...p, ...updates } : p
      )
    );
  }, []);

  // Add remote participant
  const addRemoteParticipant = useCallback((participant: ParticipantStream) => {
    console.log('➕ Adding remote participant:', participant);
    
    setParticipants(prev => {
      // Check if participant already exists
      if (prev.find(p => p._id === participant._id)) {
        console.log('⚠️ Participant already exists, updating instead');
        return prev.map(p => 
          p._id === participant._id ? { ...p, ...participant } : p
        );
      }
      
      console.log('🆕 Adding new remote participant');
      return [...prev, participant];
    });
    
    // Create peer connection
    createPeerConnection(participant._id);
  }, [createPeerConnection]);

  // Remove remote participant
  const removeRemoteParticipant = useCallback((participantId: string) => {
    console.log('➖ Removing remote participant:', participantId);
    
    setParticipants(prev => prev.filter(p => p._id !== participantId));
    webrtcService.removePeerConnection(participantId);
  }, []);

  // Handle screen sharing state changes
  const handleScreenSharingChanged = useCallback((isScreenSharing: boolean, stream: MediaStream | null) => {
    console.log('🖥️ Screen sharing changed:', isScreenSharing, stream);
    
    setParticipants(prev => 
      prev.map(p => 
        p.isLocal ? { 
          ...p, 
          isScreenSharing, 
          stream: stream || p.stream,
          // If screen sharing stopped, ensure video is visible
          isVideoOff: false
        } : p
      )
    );
  }, []);

  // Setup WebRTC service callbacks
  useEffect(() => {
    console.log('🔧 Setting up WebRTC event listeners...');
    
    // Set up track callback
    webrtcService.onTrack((peerId, stream) => {
      console.log('📹 Received track from peer:', peerId, stream);
      
      // Update participant with stream
      updateParticipantMediaState(peerId, { stream });
    });

    // Set up peer connection callback
    webrtcService.onPeerConnection((peerId, connection) => {
      console.log('🔗 New peer connection established:', peerId);
    });

    // Set up ICE candidate callback
    webrtcService.onIceCandidate((peerId, candidate) => {
      console.log('🧊 ICE candidate generated for peer:', peerId);
      handleOutgoingICECandidate(peerId, candidate);
    });

    // Set up screen sharing callback
    webrtcService.setScreenSharingCallback(handleScreenSharingChanged);
    
    console.log('✅ WebRTC event listeners set up successfully');
  }, [updateParticipantMediaState, handleOutgoingICECandidate, handleScreenSharingChanged]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up WebRTC service...');
      webrtcService.cleanup();
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🔍 useWebRTC - Participants state changed:', participants);
  }, [participants]);

  return {
    webrtcParticipants: participants,
    isWebRTCInitialized: isInitialized,
    webrtcError: error,
    addRemoteParticipant,
    removeRemoteParticipant,
    initializeLocalStream,
    handleIncomingOffer,
    handleIncomingAnswer,
    handleIncomingICECandidate
  };
};
