import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import LoginPage from "./modules/auth/pages/LoginPage";
import SignupPage from "./modules/auth/pages/SignupPage";
import OnboardingPage from "./modules/onboarding/pages/OnboardingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomeLayout from "./modules/home/layouts/HomeLayout";
import DashboardPage from "./modules/home/dashboard/pages/DashboardPage";
import DocumentsPage from "./modules/home/documents/pages/DocumentsPage";
import TestsPage from "./modules/home/tests/pages/TestsPage";
import FlashcardsPage from "./modules/home/flashcards/pages/FlashcardsPage";
import AnalyticsPage from "./modules/home/analytics/pages/AnalyticsPage";

function App() {
	const { checkAuth, isAuthenticated, user } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<Routes>
			{/* Public Routes */}
			<Route
				path='/login'
				element={
					isAuthenticated ? (
						<Navigate to='/' replace />
					) : (
						<LoginPage />
					)
				}
			/>
			<Route
				path='/signup'
				element={
					isAuthenticated ? (
						<Navigate to='/' replace />
					) : (
						<SignupPage />
					)
				}
			/>

			{/* Onboarding - Protected but accessible if !isOnboarded */}
			<Route
				path='/onboarding'
				element={
					<ProtectedRoute>
						{user?.isOnboarded ? (
							<Navigate to='/dashboard' replace />
						) : (
							<OnboardingPage />
						)}
					</ProtectedRoute>
				}
			/>

			{/* Protected Routes */}
			<Route
				path='/dashboard'
				element={
					<ProtectedRoute>
						<HomeLayout>
							<DashboardPage />
						</HomeLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/documents'
				element={
					<ProtectedRoute>
						<HomeLayout>
							<DocumentsPage />
						</HomeLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/tests'
				element={
					<ProtectedRoute>
						<HomeLayout>
							<TestsPage />
						</HomeLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/flashcards'
				element={
					<ProtectedRoute>
						<HomeLayout>
							<FlashcardsPage />
						</HomeLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path='/analytics'
				element={
					<ProtectedRoute>
						<HomeLayout>
							<AnalyticsPage />
						</HomeLayout>
					</ProtectedRoute>
				}
			/>

			{/* Root redirect logic */}
			<Route
				path='/'
				element={
					!isAuthenticated ? (
						<Navigate to='/login' replace />
					) : !user?.isOnboarded ? (
						<Navigate to='/onboarding' replace />
					) : (
						<Navigate to='/dashboard' replace />
					)
				}
			/>

			{/* 404 Redirect */}
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	);
}

export default App;
