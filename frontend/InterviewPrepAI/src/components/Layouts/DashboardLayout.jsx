import Navbar from "./Navbar";
import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext';

const DashboardLayout = ({children}) => {
    const {user} = useContext(UserContext);
  return (
    <div className="bg-purple-50">
      <Navbar />
  {user && <div>{children}</div>}
    </div>
  )
}

export default DashboardLayout
