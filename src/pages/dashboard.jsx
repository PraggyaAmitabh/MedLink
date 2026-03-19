import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsOverview from "../components/StatsOverview";
import BedCards from "../components/BedCards";
import StaffList from "../components/StaffList";
import AmbulancePanel from "../components/AmbulancePanel";
import InventoryPanel from "../components/InventoryPanel";
import AnalyticsPanel from "../components/AnalyticsPanel";
import AmbulanceMap from "../components/AmbulanceMap";
import StaffAssignment from "../components/StaffAssignment";

export default function Dashboard(){

  const [darkMode,setDarkMode] = useState(false);

  return(

    <div>

      <Sidebar />

      <div
        style={{
          marginLeft:"240px",
          minHeight:"100vh",
          background: darkMode
            ? "#0f172a"
            : "linear-gradient(180deg,#f8fafc,#eef2f7)"
        }}
      >

        <div
          style={{
            maxWidth:"1400px",
            margin:"0 auto",
            padding:"30px"
          }}
        >

          <Header darkMode={darkMode} setDarkMode={setDarkMode}/>

          <StatsOverview/>

          {/* BED MANAGEMENT */}

          <h3 style={{marginTop:"20px",marginBottom:"15px"}}>
            🏥 Bed Management
          </h3>

          <BedCards/>

          {/* STAFF */}

          <h3 style={{marginTop:"30px",marginBottom:"15px"}}>
            👨‍⚕️ Hospital Staff
          </h3>

          <StaffList/>

          <h3>👨‍⚕️ Doctor Assignments</h3>
<StaffAssignment />

          {/* AMBULANCE */}

          <h3 style={{marginTop:"30px",marginBottom:"15px"}}>
            🚑 Ambulance Operations
          </h3>

          <AmbulancePanel/>
          <div style={{marginTop:"25px"}}>
            <AmbulanceMap/>
          </div>

          {/* INVENTORY */}

          <h3 style={{marginTop:"30px",marginBottom:"15px"}}>
            📦 Medical Inventory
          </h3>

          <InventoryPanel/>

          {/* ANALYTICS */}

          <h3 style={{marginTop:"30px",marginBottom:"15px"}}>
            📊 Hospital Analytics
          </h3>

          <AnalyticsPanel/>

        </div>

      </div>

    </div>

  );

}