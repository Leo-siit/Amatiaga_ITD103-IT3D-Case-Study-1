import React from 'react';
import * as AiIcons from 'react-icons/ai';
import { ImProfile } from "react-icons/im";
import { IoIosLogOut } from "react-icons/io";

export const SidebarData = [
  {
    title: 'Request',
    path: '/pdashboard/request',
    icon: <AiIcons.AiFillHome/>,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/reports',
    icon: <ImProfile />,
    cName: 'nav-text'
  },
  {
    title: 'Log Out',
    path: '/authentication/sign-in',
    icon: <IoIosLogOut />,
    cName: 'nav-text'
  }
];