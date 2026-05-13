import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { useAuthStore } from "./store/auth.store";

// Lazy load the imports to improve performance
const LoginPage = lazy(() => import("./modules/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("./modules/auth/pages/SignupPage"));
const OnboardingPage = lazy(
	() => import("./modules/onboarding/pages/OnboardingPage"),
);
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));
const HomeLayout = lazy(() => import("./modules/home/layouts/HomeLayout"));
const DashboardPage = lazy(
	() => import("./modules/home/dashboard/pages/DashboardPage"),
);
const DocumentsPage = lazy(
	() => import("./modules/home/documents/pages/DocumentsPage"),
);
const DocumentDetailPage = lazy(
	() => import("./modules/home/documents/pages/DocumentDetailPage"),
);
const TestsPage = lazy(() => import("./modules/home/tests/pages/TestsPage"));
const TestRunnerPage = lazy(
	() => import("./modules/home/tests/pages/TestRunnerPage"),
);
const FlashcardsPage = lazy(
	() => import("./modules/home/flashcards/pages/FlashcardsPage"),
);
const FlashcardSessionPage = lazy(
	() => import("./modules/home/flashcards/pages/FlashcardSessionPage"),
);
const AnalyticsPage = lazy(
	() => import("./modules/home/analytics/pages/AnalyticsPage"),
);
const SettingsPage = lazy(
	() => import("./modules/home/settings/pages/SettingsPage"),
);

const AppLoader = () => (
	<div className='flex h-screen w-full items-center justify-center bg-background'>
		<div className='h-12 w-12 animate-spin rounded-full border-4 border-brand-orange border-t-transparent' />
	</div>
);

function App() {
	const { checkAuth, isAuthenticated, user, isLoading } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isLoading) {
		return <AppLoader />;
	}

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<Toaster position='top-right' richColors expand={false} />
			<Suspense fallback={<AppLoader />}>
				<Routes>
					{/* ... existing routes ... */}
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
						path='/documents/:id'
						element={
							<ProtectedRoute>
								<HomeLayout>
									<DocumentDetailPage />
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
						path='/tests/:id'
						element={
							<ProtectedRoute>
								<TestRunnerPage />
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
						path='/flashcards/:id'
						element={
							<ProtectedRoute>
								<FlashcardSessionPage />
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
					<Route
						path='/settings'
						element={
							<ProtectedRoute>
								<HomeLayout>
									<SettingsPage />
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
			</Suspense>
		</GoogleOAuthProvider>
	);
}

export default App;
