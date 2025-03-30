"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Video, Square, Camera, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface MediaRecorderProps {
  onMediaCaptured: (mediaBlob: Blob, type: "video" | "audio" | "image") => void
  onCancel: () => void
  initialMode?: "video" | "audio" | "image"
}

export function MediaRecorder({ onMediaCaptured, onCancel, initialMode = "video" }: MediaRecorderProps) {
  const [mode, setMode] = useState<"video" | "audio" | "image">(initialMode)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { toast } = useToast()

  // Clean up function
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMediaStream()
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const startMediaStream = async () => {
    try {
      stopMediaStream() // Stop any existing stream

      if (mode === "video") {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
      } else if (mode === "audio") {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      } else if (mode === "image") {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
      }

      if (videoRef.current && (mode === "video" || mode === "image")) {
        videoRef.current.srcObject = streamRef.current
      }

      return true
    } catch (error) {
      console.error("Error accessing media devices:", error)
      toast({
        title: "Permission Error",
        description: "Please allow access to your camera and microphone to use this feature.",
        variant: "destructive",
      })
      return false
    }
  }

  const startRecording = async () => {
    chunksRef.current = []

    const success = await startMediaStream()
    if (!success || !streamRef.current) return

    try {
      const options = mode === "audio" ? { mimeType: "audio/webm" } : { mimeType: "video/webm" }

      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options)

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mode === "audio" ? "audio/webm" : "video/webm",
        })
        setMediaBlob(blob)

        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)

        stopMediaStream()
      }

      // Start recording
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Recording Error",
        description: "There was a problem starting the recording. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const captureImage = async () => {
    const success = await startMediaStream()
    if (!success || !streamRef.current || !videoRef.current) return

    // Give the video stream a moment to initialize
    setTimeout(() => {
      if (!videoRef.current) return

      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return

          setMediaBlob(blob)
          const url = URL.createObjectURL(blob)
          setPreviewUrl(url)

          stopMediaStream()
        },
        "image/jpeg",
        0.95,
      )
    }, 500)
  }

  const handleSubmit = () => {
    if (mediaBlob) {
      onMediaCaptured(mediaBlob, mode)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={mode === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("video")
                setMediaBlob(null)
                setPreviewUrl(null)
              }}
              disabled={isRecording}
            >
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
            <Button
              variant={mode === "audio" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("audio")
                setMediaBlob(null)
                setPreviewUrl(null)
              }}
              disabled={isRecording}
            >
              <Mic className="h-4 w-4 mr-1" />
              Audio
            </Button>
            <Button
              variant={mode === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("image")
                setMediaBlob(null)
                setPreviewUrl(null)
              }}
              disabled={isRecording}
            >
              <Camera className="h-4 w-4 mr-1" />
              Photo
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isRecording}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative bg-black rounded-md overflow-hidden aspect-video mb-4">
          {mode === "video" || mode === "image" ? (
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Mic className="h-16 w-16 text-gray-400" />
            </div>
          )}

          {previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              {mode === "video" ? (
                <video src={previewUrl} className="w-full h-full object-cover" controls />
              ) : mode === "audio" ? (
                <div className="w-full p-4 flex flex-col items-center">
                  <Mic className="h-16 w-16 text-white mb-2" />
                  <audio src={previewUrl} controls className="w-full" />
                </div>
              ) : (
                <img src={previewUrl || "/placeholder.svg"} className="w-full h-full object-cover" alt="Captured" />
              )}
            </div>
          )}

          {isRecording && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <span className="animate-pulse mr-1">●</span>
              {formatTime(recordingTime)}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {!mediaBlob ? (
            <>
              {mode === "image" ? (
                <Button onClick={captureImage}>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo
                </Button>
              ) : isRecording ? (
                <Button variant="destructive" onClick={stopRecording}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              ) : (
                <Button onClick={startRecording}>
                  {mode === "video" ? (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setMediaBlob(null)
                  setPreviewUrl(null)
                }}
              >
                Retake
              </Button>
              <Button onClick={handleSubmit}>Attach to Report</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

