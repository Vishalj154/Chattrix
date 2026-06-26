import { createContext, useContext, useEffect, useState } from "react";
import {onAuthStateChanged} from "firebase/auth";
import auth from "../firebase";

const authcontext=createContext();