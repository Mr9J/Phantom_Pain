import React from "react";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modalText: string;
}

const ConfirmModal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  modalText,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              <p>{modalText}</p>
            </h3>
            <button
              type="button"
              onClick={onConfirm}
              className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              確認
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 ms-3 text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm inline-flex items-center text-center"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
