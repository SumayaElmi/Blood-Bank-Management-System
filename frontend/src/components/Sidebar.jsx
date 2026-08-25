import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  RiDashboardLine,
  RiUserHeartLine,
  RiDropLine,
  RiHospitalLine,
  RiFileList3Line,
  RiCalendarEventLine,
  RiHeartPulseLine,
  RiUserSettingsLine,
  RiBarChartBoxLine,
  RiAdminLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

import { useAuth } from "../context/AuthContext";
import { useLayout } from "../context/LayoutContext";



const reportLinks = [
  {
    to: "/reports/donations",
    label: "Donation Report"
  },
  {
    to: "/reports/inventory",
    label: "Inventory Report"
  },
  {
    to: "/reports/requests",
    label: "Request Report"
  },
  {
    to: "/reports/hospitals",
    label: "Hospital Report"
  }
];



const Sidebar = () => {


  const { user } = useAuth();

  const {
    sidebarCollapsed,
    closeMobileSidebar
  } = useLayout();


  const location = useLocation();



  // =========================
  // ADMIN PERMISSION
  // =========================

  const isAdmin =
    user?.roles?.some(role =>
      role === "ROLE_Administrator" ||
      role === "Administrator" ||
      role === "System Administrator"
    );



  const reportsActive =
    location.pathname.startsWith("/reports");



  const [reportsOpen,setReportsOpen] =
    useState(reportsActive);



  useEffect(()=>{

    if(reportsActive){
      setReportsOpen(true);
    }

  },[reportsActive]);





  const mainLinks = [


    {
      to:"/dashboard",
      icon:RiDashboardLine,
      label:"Dashboard",
      section:"MAIN"
    },


    {
      to:"/donors",
      icon:RiUserHeartLine,
      label:"Donors",
      section:"OPERATIONS"
    },


    {
      to:"/inventory",
      icon:RiDropLine,
      label:"Blood Inventory",
      section:"OPERATIONS"
    },


    {
      to:"/donations",
      icon:RiHeartPulseLine,
      label:"Donation History",
      section:"OPERATIONS"
    },


    {
      to:"/hospitals",
      icon:RiHospitalLine,
      label:"Hospitals",
      section:"MANAGEMENT"
    },


    {
      to:"/requests",
      icon:RiFileList3Line,
      label:"Blood Requests",
      section:"MANAGEMENT"
    },


    {
      to:"/appointments",
      icon:RiCalendarEventLine,
      label:"Appointments",
      section:"MANAGEMENT"
    }

  ];






  const bottomLinks = [


    ...(isAdmin
      ?
      [
        {
          to:"/users",
          icon:RiAdminLine,
          label:"User Management",
          section:"ADMINISTRATION"
        }
      ]
      :
      []
    ),



    {
      to:"/profile",
      icon:RiUserSettingsLine,
      label:"User Profile",
      section:"ACCOUNT"
    }

  ];






  const allItems = [

    ...mainLinks,

    {
      type:"reports"
    },

    ...bottomLinks

  ];




  let lastSection = "";





  const handleNavClick = () => {

    if(window.innerWidth <= 768){

      closeMobileSidebar();

    }

  };






  const renderLink = (item)=>{


    const Icon = item.icon;


    return (

      <NavLink

        key={item.to}

        to={item.to}

        onClick={handleNavClick}

        className={({isActive}) =>
          `nav-item ${isActive ? "active" : ""}`
        }

      >

        <span className="nav-item-icon">

          <Icon size={18}/>

        </span>


        {!sidebarCollapsed && (

          <span className="nav-item-text">

            {item.label}

          </span>

        )}


      </NavLink>

    );

  };








  const renderReports = ()=>{


    return (

      <React.Fragment key="reports">


        {!sidebarCollapsed && (

          <div className="nav-section-title">

            ANALYTICS

          </div>

        )}



        <div className="nav-item-group">


          <button

            type="button"

            className="nav-item-dropdown-toggle"

            onClick={() =>
              setReportsOpen(!reportsOpen)
            }

          >


            <span className="nav-item-icon">

              <RiBarChartBoxLine size={18}/>

            </span>



            {!sidebarCollapsed && (

              <span className="nav-item-text">

                Reports

              </span>

            )}



            {!sidebarCollapsed && (

              reportsOpen

              ?

              <RiArrowDownSLine size={14}/>

              :

              <RiArrowRightSLine size={14}/>

            )}


          </button>





          {reportsOpen && !sidebarCollapsed && (

            <div className="nav-sub-items">


              {
                reportLinks.map(link=>(

                  <NavLink

                    key={link.to}

                    to={link.to}

                    onClick={handleNavClick}

                    className={({isActive}) =>
                      `nav-sub-item ${
                        isActive ? "active" : ""
                      }`
                    }

                  >

                    {link.label}

                  </NavLink>

                ))
              }


            </div>

          )}


        </div>


      </React.Fragment>

    );

  };









  return (

    <aside className="nowa-sidebar">


      <div className="sidebar-brand">

        <span className="brand-text">

          BloodBank

        </span>

      </div>





      <nav className="sidebar-nav">


        {
          allItems.map(item=>{


            if(item.type==="reports"){

              return renderReports();

            }



            const showSection =
              item.section !== lastSection;


            lastSection=item.section;



            return (

              <React.Fragment key={item.to}>


                {
                  showSection && !sidebarCollapsed && (

                    <div className="nav-section-title">

                      {item.section}

                    </div>

                  )
                }



                {renderLink(item)}


              </React.Fragment>

            );


          })
        }



      </nav>


    </aside>

  );

};



export default Sidebar;