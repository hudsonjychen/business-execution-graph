import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';

export default function AppRoutes() {
    <BrowserRouter>
        <Routes>
            <Route path='/landingpage' element={<LandingPage />} />
        </Routes>
    </BrowserRouter>
}