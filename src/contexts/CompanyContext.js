import { createContext, useState, useEffect, useContext } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Company } from "../models";

const CompanyContext = createContext({});

const CompanyContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [company, setCompany] = useState();
  const sub = user?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setUser);
  }, []);

  useEffect(() => {
    if (!sub) {
      return;
    }
    // fetch Company and filter by adminSub
    DataStore.query(Company, (r) => r.adminSub("eq", sub)).then(
      (companies) => setCompany(companies[0])
    );
  }, [sub]);

  console.log(company?.id);

  return (
    <CompanyContext.Provider value={{ company, setCompany, sub }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;

export const useCompanyContext = () => useContext(CompanyContext);
