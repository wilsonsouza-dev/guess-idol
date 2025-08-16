import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DailyMode from "./pages/DailyMode";
import InfiniteMode from "./pages/InfiniteMode";
import "./App.css"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/daily" />} />
                <Route path="/daily" element={<DailyMode />} />
                <Route path="/infinite" element={<InfiniteMode />} />
            </Routes>
        </Router>
    );
}
