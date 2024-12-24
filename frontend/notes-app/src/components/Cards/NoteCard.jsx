/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { MdOutlinePushPin } from 'react-icons/md';
import { MdCreate, MdDelete } from 'react-icons/md';

const Note = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote
}) => {
  return (
    // Note Card
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
        {/* Note title, date and Pin */}
        <div className='flex items-center justify-between'>
          <div>
              <h6 className="text-sm font-medium">{title}</h6>
              <span className="text-xs text-slate-500">{date}</span>
          </div>

          <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-blue-600': 'text-slate-300'}`} onClick={onPinNote} />
        </div>

        {/* Note Content */}
        <p className="text-xs text-slate-600 mt-2">{content?.slice(0,60)}</p>

        {/* Note tags and icons (i.e., edit and delete) */}
        <div className='flex items-center justify-between mt-2'>
          <div className="text-xs text-slate-500">{tags}</div>

          <div className="flex items-center gap-2">
            <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit} />
            <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete} />
          </div>
        </div>
        
    </div>
  )
}

export default Note