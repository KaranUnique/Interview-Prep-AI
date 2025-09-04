import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import SummaryCard from "../../components/Cards/SummaryCard";

import { FaMonument } from "react-icons/fa6";
import Modal from "../../components/Loader/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };
  // Delete session via backend API
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
      <div className="container mx-auto pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
          {sessions && sessions.length > 0 ? (
            sessions.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || "-"}
                description={data?.description || ""}
                lastupdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("Do MM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-16">
              <div className="text-lg font-semibold text-gray-500 mb-2">
                No sessions found
              </div>
              <div className="text-gray-400 mb-4 text-center">
                Click{" "}
                <span className="font-semibold text-orange-500">Add New</span>{" "}
                to create your first interview session!
              </div>
            </div>
          )}
        </div>
        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xs hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>
      <Modal
      isOpen={openDeleteAlert?.open}
      onClose={()=>{
        setOpenDeleteAlert({open : false , data:null});
      }}
      title="Delete Alert"
      >
        <div className="flex justify-center items-center w-full">
          <div className="bg-white rounded-lg p-2 h-30 md:h-23 max-w-md w-full">
            <DeleteAlertContent
              content="Are you sure want to delete this session detail?"
              onDelete={() => deleteSession(openDeleteAlert.data)}
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
