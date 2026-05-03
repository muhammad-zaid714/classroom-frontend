import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants';
import { UploadWidgetProps, UploadWidgetValue } from '@/types';
import { UploadCloud, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const UploadWidget = ({ value = null, onChange, disabled = false }: UploadWidgetProps) => {
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onchangeRef = useRef(onChange);

    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if (!value) setDeleteToken(null);
    }, [value]);

    useEffect(() => {
        onchangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeWidget = () => {
            if (!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: CLOUDINARY_CLOUD_NAME,
                    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                    multiple: false,
                    folder: 'uploads',
                    maxFileSize: 5000000,
                    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                    maxImageWidth: 2000,
                },
                (error, result) => {
                    if (!error && result.event === 'success') {
                        const payload: UploadWidgetValue = {
                            url: result.info.secure_url,
                            publicId: result.info.public_id,
                        };
                        setPreview(payload);
                        setDeleteToken(result.info.delete_token ?? null);
                        onchangeRef.current?.(payload);
                    }
                }
            );

            return true;
        };

        if (initializeWidget()) return;

        const intervalId = window.setInterval(() => {
            if (initializeWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500);

        return () => window.clearInterval(intervalId);
    }, []);

    const openWidget = () => {
        if (!disabled && widgetRef.current) {
            widgetRef.current.open();
        }
    };

    const clearSelection = () => {
        setPreview(null);
        setDeleteToken(null);
        onchangeRef.current?.(null);
    };

    const removeImage = () => {
        if (!deleteToken) {
            clearSelection();
            return;
        }

        const removeFromCloudinary = async () => {
            setIsRemoving(true);

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({ token: deleteToken }).toString(),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to remove image: ${response.status}`);
                }

                clearSelection();
            } catch (error) {
                console.error('Error removing uploaded image', error);
            } finally {
                setIsRemoving(false);
            }
        };

        void removeFromCloudinary();
    };

    return (
        <div className='space-y-2'>
            {preview ? (
                <div className='upload-preview'>
                    <img src={preview.url} alt='Uploaded' className='uploaded-image' />
                    <button
                        type='button'
                        onClick={removeImage}
                        disabled={isRemoving}
                        className='absolute top-2 right-3 z-10 inline-flex items-center gap-1 rounded-md border bg-white/95 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-white disabled:opacity-70'
                    >
                        <X className='h-4 w-4 text-black' />
                        Remove image
                    </button>
                </div>
            ) : (
                <div
                    className='upload-dropzone'
                    role='button'
                    tabIndex={0}
                    onClick={openWidget}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === '') {
                            event.preventDefault();
                            openWidget();
                        }
                    }}
                >
                    <div className='upload-prompt'>
                        <UploadCloud className='icon' />
                        <div>
                            <p>Click to upload photo</p>
                            <p>PNG JPG upto 5MB</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadWidget;