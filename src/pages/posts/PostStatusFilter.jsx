import { useTranslation } from "react-i18next";
import { POST_STATUS_FILTER_OPTIONS } from "../../app/constants/PostStatus";

const ALL_VALUE = "all";

const PostStatusFilter = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 py-2">
      <label
        htmlFor="post-status-filter"
        className="text-sm text-gray-600 whitespace-nowrap"
      >
        {t("postStatus.label")}
      </label>
      <select
        id="post-status-filter"
        value={value === null ? ALL_VALUE : String(value)}
        onChange={(e) =>
          onChange(
            e.target.value === ALL_VALUE ? null : Number(e.target.value)
          )
        }
        className="px-3 py-2 text-sm border rounded-md cursor-pointer focus:outline-none focus:border-(--green-color)"
      >
        {POST_STATUS_FILTER_OPTIONS.map((option) => (
          <option
            key={option.value ?? ALL_VALUE}
            value={option.value === null ? ALL_VALUE : String(option.value)}
          >
            {t(option.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PostStatusFilter;
