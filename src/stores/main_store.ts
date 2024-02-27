// This file is using zustand. Learn more about it here: https://github.com/pmndrs/zustand
// Import the Zustand library
import {create} from "zustand";

// Define the shape of the NameStore
type NameStore = {
    name: string;
    setTreeName: (name: string) => void;
    reset: () => void;
}

// Define the shape of the VisibleStore
type VisibleStore = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    reset: () => void;
}

// Define the shape of the IssueData and IssueStore
type IssueData = {id: string, issue: string[]}
type IssueStore = {issues: IssueData[], addIssues:(issue:IssueData) => void }

// Create and export the useNameStore hook
export const useNameStore = create<NameStore>()((set)=>({
    // Initialize state variables
    name: "",
    // Method to set the name in the store
    setTreeName:(name:string) => set(()=>({name:name})),
    // Method to reset the name to an empty string
    reset: () => set(() => ({name:""}))
    }));

// Create and export the useVisibleStore hook
export const useVisibleStore = create<VisibleStore>()((set)=>({
    // Initialize state variables
    visible: false,
    // Method to set the visibility in the store
    setVisible: (visible: boolean) => set(() => ({visible: visible})),
    // Method to reset visibility to false
    reset: () => set(() => ({visible: false}))
}))

// Create and export the useIssueStore hook
export const useIssueStore = create<IssueStore>()((set)=>({
    // Initialize state variables
    issues: [],
    // Method to add an issue to the issues array in the store
    addIssues: (issue: IssueData) => set((state) => ({issues: [...state.issues, issue]}))
}))