import { type FC, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../store/auth.store";

// Views
import { WelcomeScreen } from "../views/WelcomeScreen";
import { ProfileScreen } from "../views/ProfileScreen";
import { UploadScreen } from "../views/UploadScreen";

// Utils
import { uploadToCloudinary } from "../../../lib/cloudinary";

const OnboardingPage: FC = () => {
	const { user, updateProfile, isLoading } = useAuthStore();
	const [step, setStep] = useState(1); // 1=welcome, 2=profile, 3=upload
	const [form, setForm] = useState({
		displayName: user?.displayName || "",
		field: "",
		avatarFile: null as File | null,
	});

	const handleChange = (k: string, v: any) =>
		setForm((f) => ({ ...f, [k]: v }));

	const handleFinish = async () => {
		try {
			let profileImageUrl = user?.profileImageUrl;

			if (form.avatarFile) {
				const uploadRes = await uploadToCloudinary(form.avatarFile);
				profileImageUrl = uploadRes.secure_url;
			}

			await updateProfile({
				displayName: form.displayName,
				isOnboarded: true,
				studyField: form.field,
				profileImageUrl,
			});
		} catch (err) {
			console.error(err);
		}
	};

	const handleSkip = async () => {
		if (step === 2) {
			setStep(3);
			return;
		}
		try {
			await updateProfile({ isOnboarded: true });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className='relative font-grotesk'>
			<AnimatePresence mode='wait'>
				{step === 1 && (
					<WelcomeScreen
						key='welcome'
						onNext={() => setStep(2)}
						onSkip={handleSkip}
					/>
				)}
				{step === 2 && (
					<ProfileScreen
						key='profile'
						user={user}
						form={form}
						onChange={handleChange}
						onNext={() => setStep(3)}
						onSkip={handleSkip}
						onBack={() => setStep(1)}
					/>
				)}
				{step === 3 && (
					<UploadScreen
						key='upload'
						onFinish={handleFinish}
						onSkip={handleSkip}
						onBack={() => setStep(2)}
						isLoading={isLoading}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default OnboardingPage;
