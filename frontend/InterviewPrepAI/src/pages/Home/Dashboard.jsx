import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import DashboardLayout from "../../components/Layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Loader/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";

import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CARD_BG } from "../../utils/data";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const deleteSession = async (session) => {
    if (!session?._id) return;
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(session._id));
      toast.success("Session deleted successfully!");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  useEffect(() => {
    fetchAllSessions();
    // eslint-disable-next-line
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white md:px-10 relative overflow-hidden">
        <div className="container mx-auto pt-8 pb-16 relative z-10">
          <h1 className="md:text-2xl text-lg mb-5 font-semibold text-white md:mb-10">
            Your <span className="text-white">Interview Sessions</span>
          </h1>

          {/* Sessions Grid */}
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessions.map((data, index) => (
                <SummaryCard
                  key={data._id}
                  colors={CARD_BG[index % CARD_BG.length]}
                  role={data.role || ""}
                  topicsToFocus={data.topicsToFocus || ""}
                  experience={data.experience || "-"}
                  questions={data.questions?.length || "-"}
                  description={data.description || ""}
                  lastupdated={data.updatedAt ? moment(data.updatedAt).format("Do MMM YYYY") : ""}
                  onSelect={() => navigate(`/interview-prep/${data._id}`)}
                  onDelete={() => setOpenDeleteAlert({ open: true, data })}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-200">
              <p className="mb-2 font-semibold">No sessions found</p>
              <p>
                Click <span className="font-semibold text-purple-500">Add New</span> to create
                your first interview session!
              </p>
            </div>
          )}

          {/* Add New Floating Button */}
          <button
            className="fixed bottom-10 right-10 md:bottom-16 md:right-16 h-12 flex items-center gap-2 px-6 bg-purple-500 text-white rounded-full shadow-lg hover:shadow-2xl transition"
            onClick={() => setOpenCreateModal(true)}
          >
            <LuPlus className="text-xl" /> Add New
          </button>
        </div>
      </div>

      {/* Create Session Modal */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <CreateSessionForm />
      </Modal>

      {/* Delete Alert Modal */}
      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Session"
      >
        <DeleteAlertContent
          content="Are you sure you want to delete this session?"
          onDelete={() => deleteSession(openDeleteAlert.data)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
