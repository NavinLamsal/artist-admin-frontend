import { ConfirmContext, type ConfirmOptions } from "@/context/ConfirmContext";
import React, { useState } from "react";

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
  };

  const handleConfirm = async () => {
    if (!options) return;

    try {
      setLoading(true);
      await options.onConfirm();
      setOptions(null); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {options && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-3">
              {options.title || "Confirm Action"}
            </h2>

            <p className="text-gray-600 mb-6">{options.message}</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
              >
                {options.cancelText || "Cancel"}
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Processing..." : options.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};