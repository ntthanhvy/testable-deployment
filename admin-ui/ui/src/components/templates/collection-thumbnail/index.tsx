import clsx from "clsx";
import { useRef } from "react";
import { FormImage } from "../../../types/shared";
import Button from "../../fundamentals/button";

export default function CollectionThumbnail({
	value,
	onChange,
}: {
	value: FormImage | undefined;
	onChange: (value: FormImage) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	const onFileChosen = (files: File[]) => {
		const file = files[0];
		onChange({
			url: URL.createObjectURL(file),
			name: file.name,
			size: file.size,
			nativeFile: file,
		});
	};

	const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
		// setFileUploadError(false);

		e.preventDefault();

		const files: File[] = [];

		if (e.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				// If dropped items aren't files, reject them
				if (e.dataTransfer.items[i].kind === "file") {
					const file = e.dataTransfer.items[i].getAsFile();
					if (file && filetypes.indexOf(file.type) > -1) {
						files.push(file);
					}
				}
			}
		} else {
			// Use DataTransfer interface to access the file(s)
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
				if (filetypes.indexOf(e.dataTransfer.files[i].type) > -1) {
					files.push(e.dataTransfer.files[i]);
				}
			}
		}
		if (files.length === 1) {
			onFileChosen(files);
		} else {
			// setFileUploadError(true);
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			onFileChosen(Array.from(files));
		}
	};

	const filetypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];

	return (
		<>
			{value && value.url ? (
				<div className="flex  items-center gap-x-4">
					<img
						src={value.url}
						alt="thumbnail"
						className="rounded-rounded max-h-full max-w-full object-contain w-32 h-32 "
					/>

					<span>{value.name}</span>

					<Button
						variant="secondary"
						size="small"
						onClick={() => inputRef?.current?.click()}
						className="ml-auto"
						type="button"
					>
						Change
					</Button>
				</div>
			) : (
				<div
					onClick={() => inputRef?.current?.click()}
					onDrop={handleFileDrop}
					onDragOver={(e) => e.preventDefault()}
					className={clsx(
						"inter-base-regular text-grey-50 rounded-rounded border-grey-20 hover:border-violet-60 hover:text-grey-40 flex h-full w-full cursor-pointer select-none flex-col items-center justify-center border-2 border-dashed transition-colors"
					)}
				>
					<div className="flex flex-col items-center py-8">
						<span>
							Drop your images here, or{" "}
							<span className="text-violet-60">click to browse</span>
						</span>
					</div>
				</div>
			)}
			<input
				ref={inputRef}
				accept={filetypes.join(", ")}
				type="file"
				onChange={handleFileUpload}
				className="hidden"
			/>
		</>
	);
}
