"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';

function HistoryList() {
    const [historyList, setHistoryList] = useState([]);
    return (
        <div className='mt-10'>
            {historyList.length == 0 ?
                <div className='flex items-center flex-col justify-center p-7 border-dashed rounded-2xl border-2'>
                    <Image src={'/medical-assistance.png'} alt='empty' width={200} height={200} />
                    <h2 className='font-bold text-xl mt-5'>No recent Consultations</h2>
                    <p>It looks like you haven't consulted with any doctors yet.</p>
                    <AddNewSessionDialog/>
                </div>
                : <div>List</div>
            }
        </div>
    )
}

export default HistoryList