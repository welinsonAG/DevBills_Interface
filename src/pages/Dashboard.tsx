import { useEffect } from "react";
import { api } from "../services/api";

const Dashboard = () => {

    useEffect(() => {
        async function getTransactions() {
            const response = await api.get("/transactions");
            console.log(response); 
        }

        getTransactions(); 
    }, []);


    return (
        <div>
            <h1>Olá Dashboard</h1>
        </div>
    )
}

export default Dashboard;