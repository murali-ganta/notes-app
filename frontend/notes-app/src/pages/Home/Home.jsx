/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  return (
    <>
      <Navbar />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {/* Note Card Component */}
          <NoteCard
            title="Apply for WES Evaluation"
            date="25/12/2024"
            content="VTU Credentials Evaluation for Future use. Apply as soon as possible"
            tags="#Application"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />

          {/* Add New Note Button ' + ' */}
          <button
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-800 hover:bg-blue-600 absolute right-10 bottom-10"
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null });
            }}
          >
            <MdAdd className="text-[32px] text-white" />
          </button>

          {/* AddEdit Modal */}
          <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => {}}
            style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
            contentLabel=""
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
          >
            <AddEditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={() => {
                setOpenAddEditModal({
                  isShown: false,
                  type: "add",
                  data: null,
                });
              }}
            />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Home;
