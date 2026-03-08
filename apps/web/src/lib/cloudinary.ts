export const CLOUDINARY_CONFIG = {
	cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
	uploadPreset: "dupi_profile_images", // The preset you just created
	folder: "dupi/profile_images",
};

// Helper to build Cloudinary URLs
export const getCloudinaryUrl = (
	publicId: string,
	transformations?: string,
) => {
	const { cloudName } = CLOUDINARY_CONFIG;
	const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

	if (transformations) {
		return `${baseUrl}/${transformations}/${publicId}`;
	}

	return `${baseUrl}/${publicId}`;
};

// Common transformations
export const CLOUDINARY_TRANSFORMS = {
	profileAvatar: "w_400,h_400,c_fill,g_face,q_auto,f_auto", // 400x400, auto quality/format
	profileThumbnail: "w_100,h_100,c_fill,g_face,q_auto,f_auto", // 100x100
};

// Upload function
export const uploadToCloudinary = async (
	file: File,
): Promise<{ secure_url: string; public_id: string }> => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
	formData.append("folder", CLOUDINARY_CONFIG.folder);

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
		{
			method: "POST",
			body: formData,
		},
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(
			errorData.error?.message || "Failed to upload image to Cloudinary",
		);
	}

	return await response.json();
};
