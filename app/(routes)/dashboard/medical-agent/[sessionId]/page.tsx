"use client";

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams() as { sessionId: string };
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
      console.log(result.data);
      setSessionDetail(result.data);
    } catch (err) {
      console.error("Error fetching session details:", err);
    }
  };

  return (
    <div className="p-10 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      <div className="flex flex-col items-center mt-6 text-center">
        {sessionDetail?.selectedDoctor?.image ? (
          <>
            <Image
              src={sessionDetail.selectedDoctor.image}
              alt={sessionDetail.selectedDoctor.specialist || "Doctor"}
              width={100}
              height={100}
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
            <h2 className='mt-2 text-lg font-semibold'>{sessionDetail.selectedDoctor.specialist}</h2>
            <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>

            <div className='mt-20 w-full'>
              <h2 className='text-gray-400'>Assistant Msg</h2>
              <h2 className='text-lg'>User Msg</h2>
            </div>

            <Button className='mt-10 flex gap-2 items-center cursor-pointer'>
              <PhoneCall /> Start Call
            </Button>
          </>
        ) : (
          <div className="w-[100px] h-[100px] bg-gray-200 rounded-full" />
        )}
      </div>
    </div>
  );
}

export default MedicalVoiceAgent;
