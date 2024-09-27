// src/components/Modal.js
import React from 'react';

const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "Doing this could have consequences.",
    confirmButtonText = "Yes, I'm sure",
    cancelButtonText = "No, go back",
    confirmButtonColor = "bg-red-500",
    cancelButtonColor = "bg-gray-50",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="rounded-lg bg-white p-8 shadow-2xl">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm text-gray-500">{message}</p>
                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded px-4 py-2 text-sm font-medium text-white hover:opacity-80 ${confirmButtonColor}`}
                    >
                        {confirmButtonText}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`rounded px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 ${cancelButtonColor}`}
                    >
                        {cancelButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
