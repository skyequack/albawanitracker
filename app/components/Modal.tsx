"use client";

import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="p-6 rounded-lg shadow-xl max-w-md w-full"
      onClose={onClose}
    >
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
