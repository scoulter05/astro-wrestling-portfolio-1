import path from 'path';
import type { GalleryImage } from './galleryData.ts';
import exifr from 'exifr';

export const createGalleryImage = async (
	galleryDir: string,
	file: string,
): Promise<GalleryImage> => {
	const relativePath = path.relative(galleryDir, file);
	const posixRelativePath = normalizeToPosix(relativePath);
	const exifData = await exifr.parse(file);
	const image = {
		path: posixRelativePath,
		meta: {
			title: toReadableCaption(path.basename(relativePath, path.extname(relativePath))),
			description: '',
			collections: collectionIdForImage(posixRelativePath),
		},
		exif: {},
	};
	if (exifData) {
		image.exif = {
			captureDate: exifData.DateTimeOriginal
				? new Date(`${exifData.DateTimeOriginal} UTC`)
				: undefined,
			fNumber: exifData.FNumber,
			focalLength: exifData.FocalLength,
			iso: exifData.ISO,
			model: exifData.Model,
			shutterSpeed: 1 / exifData.ExposureTime,
			lensModel: exifData.LensModel,
		};
	}
	return image;
};

function toReadableCaption(input: string): string {
	return input
		.replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumerics with space
		.split(' ') // Split by space
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
		.join(' ');
}

function collectionIdForImage(relativePath: string) {
	const normalizedPath = normalizeToPosix(relativePath);
	return path.posix.dirname(normalizedPath) === '.' ? [] : [path.posix.dirname(normalizedPath)];
}

function normalizeToPosix(input: string) {
	return input.split(path.sep).join('/');
}

export const createGalleryCollection = (dir: string) => {
	const normalizedDir = normalizeToPosix(dir);
	return {
		id: normalizedDir,
		name: toReadableCaption(normalizedDir),
	};
};
