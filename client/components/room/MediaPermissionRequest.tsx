'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Mic, AlertCircle, CheckCircle } from 'lucide-react'

interface MediaPermissionRequestProps {
  onPermissionGranted: () => void
  onPermissionDenied: () => void
}

export const MediaPermissionRequest = ({ onPermissionGranted, onPermissionDenied }: MediaPermissionRequestProps) => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false
  })

  const requestPermissions = async () => {
    setIsRequesting(true)
    
    try {
      // Request both camera and microphone permissions simultaneously
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop())
      
      // Update permissions state
      setPermissions({
        camera: true,
        microphone: true
      })
      
      // Wait a moment for state update, then proceed
      setTimeout(() => {
        onPermissionGranted()
      }, 100)
      
    } catch (error) {
      console.error('Permission request failed:', error)
      onPermissionDenied()
    } finally {
      setIsRequesting(false)
    }
  }

  const checkPermissions = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasCamera = devices.some(device => device.kind === 'videoinput')
      const hasMicrophone = devices.some(device => device.kind === 'audioinput')
      
      setPermissions({
        camera: hasCamera,
        microphone: hasMicrophone
      })
    } catch (error) {
      console.error('Failed to check permissions:', error)
    }
  }

  // Check permissions on mount
  useEffect(() => {
    checkPermissions()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-white">Camera & Microphone Access</CardTitle>
        <CardDescription className="text-gray-400">
          This app needs access to your camera and microphone for video calls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span className="text-sm text-gray-300">Camera</span>
            {permissions.camera ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Mic className="h-4 w-4" />
            <span className="text-sm text-gray-300">Microphone</span>
            {permissions.microphone ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={requestPermissions}
            disabled={isRequesting}
            className="flex-1"
          >
            {isRequesting ? 'Requesting...' : 'Grant Permissions'}
          </Button>
          <Button
            variant="outline"
            onClick={onPermissionDenied}
            className="flex-1"
          >
            Continue Without
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center">
          If permissions are denied, you can still join the room but won't be able to use video/audio
        </p>
      </CardContent>
    </Card>
  )
}
