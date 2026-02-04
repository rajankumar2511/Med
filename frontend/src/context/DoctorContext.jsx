import { createContext, useContext, useState } from "react";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [loaded, setLoaded] = useState(false);

  return (
    <DoctorContext.Provider
      value={{ doctors, setDoctors, loaded, setLoaded }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctors = () => useContext(DoctorContext);
