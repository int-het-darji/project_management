import { STATUS_STYLES } from "../../utils/statusStyles";

const StatusPill = ({ status }) => {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.todo;

  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-1
        rounded-full
        text-xs font-medium
        border
        ${styles.bg}
        ${styles.text}
        ${styles.border}
        capitalize
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusPill;
