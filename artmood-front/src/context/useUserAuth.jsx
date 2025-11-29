import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useUserAuth() {
    return useContext(AuthContext);
}
