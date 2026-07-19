// Single source of truth for post `status` values coming from
// GET /admin/post/get-all. Labels are i18n keys resolved via `t()`.
export const POST_STATUS = {
  UNAPPROVED: 0,
  APPROVED: 1,
  REJECTED: 2,
  SOLD: 3,
};

export const POST_STATUS_OPTIONS = [
  {
    value: POST_STATUS.UNAPPROVED,
    labelKey: "postStatus.pending",
    className: "border-gray-300 text-gray-600 bg-gray-50",
  },
  {
    value: POST_STATUS.APPROVED,
    labelKey: "postStatus.approved",
    className: "border-green-400 text-green-600 bg-green-50",
  },
  {
    value: POST_STATUS.REJECTED,
    labelKey: "postStatus.rejected",
    className: "border-red-400 text-red-600 bg-red-50",
  },
  {
    value: POST_STATUS.SOLD,
    labelKey: "postStatus.sold",
    className: "border-gray-300 text-gray-600 bg-gray-100",
  },
];

// Options for the status filter above the posts list. `value: null` = All (the
// `status` key is omitted from `filters` entirely, never sent as null/"").
// Sold is deliberately not filterable — it still renders as a badge in the table.
export const POST_STATUS_FILTER_OPTIONS = [
  { value: null, labelKey: "postStatus.all" },
  ...POST_STATUS_OPTIONS.filter(({ value }) => value !== POST_STATUS.SOLD).map(
    ({ value, labelKey }) => ({ value, labelKey })
  ),
];

export const isFilterableStatus = (status) =>
  POST_STATUS_FILTER_OPTIONS.some(
    (option) => option.value !== null && option.value === status
  );

export const getPostStatusOption = (status) =>
  POST_STATUS_OPTIONS.find((option) => option.value === status);
