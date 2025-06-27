"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import { ArrowRight, Loader2 } from 'lucide-react'
import SuggestedDoctorCard from './SuggestedDoctorCard'

function AddNewSessionDialog() {

    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
    const OnClickNext = async () => {
        setLoading(true);
        const result = await axios.post('/api/suggest-doctors', {
            notes: note
        });

        console.log(result.data);
        setSuggestedDoctors(result.data);
        setLoading(false);
    }

    const onStartConsultation = async () => {
        setLoading(true);
        //Save all info to database
        const result = await axios.post('/api/session-chat', {
            notes: note,
            selectedDoctor: selectedDoctor
        });

        console.log(result.data);

        if (result.data?.sessionId) {
            console.log(result.data.sessionId);

            //Route to conversation page

        }
        setLoading(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mt-3'>+ Start a Consultation</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Basic Details</DialogTitle>
                    <DialogDescription asChild>
                        {!suggestedDoctors ? <div>
                            <p className="mb-2">Add symptoms or any other details</p>
                            <Textarea placeholder="Add details here.." className='h-[200px] mt-1'
                                onChange={(e) => setNote(e.target.value)} />
                        </div> :
                            <div>
                                <h2>Select the Doctor</h2>
                                <div className='grid grid-col-3 gap-5'>
                                    {/*Suggested doctors */}
                                    {suggestedDoctors.map((doctor, index) => (
                                        <SuggestedDoctorCard doctorAgent={doctor} key={index}
                                            setSelectedDoctor={() => setSelectedDoctor(doctor)}
                                            //@ts-ignore
                                            selectedDoctor={selectedDoctor}
                                        />
                                    ))}
                                </div>
                            </div>}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    {!suggestedDoctors ? <Button disabled={!note || loading} onClick={() => OnClickNext()}>
                        Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}</Button>
                        : <Button disabled={loading || !selectedDoctor} onClick={() => onStartConsultation()}>Start Consultation
                            {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewSessionDialog
