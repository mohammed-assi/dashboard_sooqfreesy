const TableSkeleton = ({ rows, colSpan }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
        >
          <td colSpan={colSpan} className="px-6 py-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-full mx-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
