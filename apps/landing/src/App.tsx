import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import HowItWorks from "./components/home/HowItWorks";
import Features from "./components/home/Features";
import Testimonials from "./components/home/Testimonials";
import Pricing from "./components/home/Pricing";
import CTA from "./components/home/CTA";
import Footer from "./components/layout/Footer";
import WaitlistPage from "./pages/WaitlistPage";

function Home() {
	return (
		<main className='min-h-screen bg-background text-foreground transition-colors duration-300'>
			<Navbar />
			<Hero />
			<HowItWorks />
			<Features />
			<Testimonials />
			<Pricing />
			<CTA />
			<Footer />
		</main>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Toaster position='top-center' />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/waitlist' element={<WaitlistPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
