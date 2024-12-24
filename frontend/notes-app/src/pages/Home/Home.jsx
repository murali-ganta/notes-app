/* eslint-disable no-unused-vars */
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';

const Home = () => {
    return (
        <>
            <Navbar />

            <div className='container mx-auto'>
                <div className='grid grid-cols-3 gap-4 mt-8'>
                    {/* Note Card Component */}
                    <NoteCard 
                        title="Apply for WES Evaluation"
                        date="25/12/2024"
                        content="VTU Credentials Evaluation for Future use. Apply as soon as possible"
                        tags='#Application'
                        isPinned={true}
                        onEdit={()=>{}}
                        onDelete={()=>{}}
                        onPinNote={()=>{}}
                    />
                    
                    {/* Add New Note Button ' + ' */}
                    <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-800 hover:bg-blue-600 absolute right-10 bottom-10" onClick={()=>{}}>
                        <MdAdd className="text-[32px] text-white" />
                    </button>

                </div>
            </div>
        </>
    )
}

export default Home;