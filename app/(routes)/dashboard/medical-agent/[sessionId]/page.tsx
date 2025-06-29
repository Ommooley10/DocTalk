"use client";

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams() as { sessionId: string };
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
      console.log(result.data);
      setSessionDetail(result.data);
    } catch (err) {
      console.error('Error fetching session details:', err);
    }
  };

  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    // Register listeners on the new instance
    vapi.on('error', (error: any) => {
      console.error('Vapi Error:', error);
    });

    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStarted(true);
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStarted(false);
    });

    vapi.on('message', (message: any) => {
      if (message.type === 'transcript') {
        const { role, transcriptType, transcript } = message;
        console.log(`${role}: ${transcript}`);
        if (transcriptType === 'partial') {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === 'final') {
          setMessages(prev => [...prev, { role, text: transcript }]);
          setLiveTranscript('');
          setCurrentRole(null);
        }
      }
    });

    // Speech events should also be on this instance
    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });

    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });

    try {
      vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
    } catch (err) {
      console.error('Start call failed:', err);
    }
  };

  const endCall = () => {
    if (!vapiInstance) return;

    vapiInstance.stop();

    vapiInstance.off('error');
    vapiInstance.off('call-start');
    vapiInstance.off('call-end');
    vapiInstance.off('message');
    vapiInstance.off('speech-start');
    vapiInstance.off('speech-end');

    setCallStarted(false);
    setVapiInstance(null);
  };

  return (
    <div className="p-10 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
          {callStarted ? 'Connected..' : 'Not Connected'}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      <div className="flex flex-col items-center mt-6 text-center">
        {sessionDetail?.selectedDoctor?.image ? (
          <>
            <Image
              src={sessionDetail.selectedDoctor.image}
              alt={sessionDetail.selectedDoctor.specialist || 'Doctor'}
              width={100}
              height={100}
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
            <h2 className="mt-2 text-lg font-semibold">{sessionDetail.selectedDoctor.specialist}</h2>
            <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

            <div className="mt-32 overflow-y-auto">
              {messages?.slice(-4).map((msg: Message, idx) => (
                <h2 className="text-gray-400" key={idx}>
                  {msg.role} : {msg.text}
                </h2>
              ))}

              {liveTranscript && liveTranscript.length > 0 && (
                <h2 className="text-lg">
                  {currentRole} : {liveTranscript}
                </h2>
              )}
            </div>

            {!callStarted ? (
              <Button className="mt-10 flex gap-2 items-center" onClick={StartCall}>
                <PhoneCall /> Start Call
              </Button>
            ) : (
              <Button variant="destructive" onClick={endCall}>
                <PhoneOff /> Disconnect
              </Button>
            )}
          </>
        ) : (
          <div className="w-[100px] h-[100px] bg-gray-200 rounded-full" />
        )}
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
