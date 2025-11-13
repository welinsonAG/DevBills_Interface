import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../pages/Home";
import Login from '../pages/Login';
import  { AuthProvider}  from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import PrivateRoutes from './PrivateRoutes'
import AppLayout from '../layout/AppLayout';
import Transactions from '../pages/Transactions';
import TransactionsForm from '../pages/TransactionsForm';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />


                    <Route element={<PrivateRoutes />}>
                    <Route element={<AppLayout/>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/transacoes" element={<Transactions />} />
                                <Route path="/transacoes/nova" element={<TransactionsForm />} />
                     </Route>
                    </Route>


                    <Route path="*" element={<h2>Pagina não encontrada</h2>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRoutes;