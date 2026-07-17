import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../../common/modal/Modal";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { CATEGORY, FORMSTRUCTURE, SUBCATEGORY } from "../../config/endPoints";

// Pulls a human message out of the API envelope. `error` may be a
// field -> message map (validation), otherwise fall back to `message`.
const envelopeError = (payload, fallback = "Something went wrong") => {
  if (!payload) return fallback;
  const { error, message } = payload;
  if (error && typeof error === "object") {
    const parts = Object.values(error).filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  return message || fallback;
};

const ReassignSubCategoryModal = ({
  isOpen,
  onClose,
  listingIds = [],
  onSuccess,
}) => {
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [loadingSubs, setLoadingSubs] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewCount, setPreviewCount] = useState(null);

  const resetState = () => {
    setSelectedCat("");
    setSelectedSub("");
    setSubCategoryList([]);
    setPreviewCount(null);
  };

  // Load parent categories once the modal opens.
  useEffect(() => {
    if (!isOpen || categoryList.length) return;

    (async () => {
      try {
        const res = await getRequest(CATEGORY.LIST);
        if (res.data?.success) {
          setCategoryList(res.data.data?.categories || []);
        } else {
          toast.error(envelopeError(res.data, "Failed to load categories"));
        }
      } catch (err) {
        toast.error(envelopeError(err.response?.data, "Failed to load categories"));
      }
    })();
  }, [isOpen, categoryList.length]);

  // Load subcategories whenever the selected category changes.
  useEffect(() => {
    if (!selectedCat) {
      setSubCategoryList([]);
      return;
    }

    let active = true;
    (async () => {
      setLoadingSubs(true);
      try {
        const res = await getRequest(`${FORMSTRUCTURE.SUBBYCATID}/${selectedCat}`);
        if (!active) return;
        if (res.data?.success) setSubCategoryList(res.data?.data || []);
        else toast.error(envelopeError(res.data, "Failed to load subcategories"));
      } catch (err) {
        if (active) {
          setSubCategoryList([]);
          toast.error(envelopeError(err.response?.data, "Failed to load subcategories"));
        }
      } finally {
        if (active) setLoadingSubs(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedCat]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const callReassign = async (preview) => {
    const payload = {
      listingIds,
      toSubCategoryId: Number(selectedSub),
      ...(preview ? { preview: true } : {}),
    };
    const res = await postRequest(SUBCATEGORY.REASSIGN_LISTINGS, payload);
    if (!res.data?.success) {
      throw { response: { data: res.data } };
    }
    return res.data.data || {};
  };

  const handlePreview = async () => {
    if (!selectedSub) {
      toast.error("Please select a target subcategory");
      return;
    }
    setPreviewing(true);
    try {
      const data = await callReassign(true);
      setPreviewCount(data.count ?? 0);
    } catch (err) {
      toast.error(envelopeError(err.response?.data, "Preview failed"));
    } finally {
      setPreviewing(false);
    }
  };

  const handleConfirm = async () => {
    setCommitting(true);
    try {
      const data = await callReassign(false);
      const moved = data.movedCount ?? 0;
      toast.success(`${moved} ad(s) moved to the new subcategory`);
      if (moved < listingIds.length) {
        toast.warn(
          `${listingIds.length - moved} selected ad(s) were not found and were skipped`
        );
      }
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(envelopeError(err.response?.data, "Reassign failed"));
    } finally {
      setCommitting(false);
    }
  };

  const busy = previewing || committing;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reassign subcategory"
      position="right"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">{listingIds.length}</span> ad(s)
          selected. Choose the subcategory to move them to. Their category is
          synced automatically.
        </p>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setSelectedSub("");
              setPreviewCount(null);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select category</option>
            {categoryList.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target subcategory
          </label>
          <select
            value={selectedSub}
            onChange={(e) => {
              setSelectedSub(e.target.value);
              setPreviewCount(null);
            }}
            disabled={!selectedCat || loadingSubs}
            className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:opacity-50"
          >
            <option value="">
              {loadingSubs ? "Loading..." : "Select subcategory"}
            </option>
            {subCategoryList.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preview result */}
        {previewCount !== null && (
          <div className="border rounded-lg p-3 bg-gray-50 text-sm">
            <span className="font-semibold">{previewCount}</span> of{" "}
            <span className="font-semibold">{listingIds.length}</span> selected
            ad(s) exist and will be moved. Confirm to apply.
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm"
          >
            Cancel
          </button>

          {previewCount === null ? (
            <button
              type="button"
              onClick={handlePreview}
              disabled={busy || !selectedSub}
              className="primary-button disabled:opacity-50"
            >
              {previewing ? "Checking..." : "Preview"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy}
              className="primary-button disabled:opacity-50"
            >
              {committing ? "Moving..." : "Confirm move"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReassignSubCategoryModal;
