import {
  FiCircle,
  FiCheckCircle,
  FiClock,
  FiEye,
} from "react-icons/fi";

export default function ActivityTimeline() {

  // dummy activities
  const activities = [
    { id: 1, title: "Create Login UI", createdBy: "Het", status: "todo" },
    { id: 2, title: "Review Validation Rules", createdBy: "Admin", status: "review" },
    { id: 3, title: "Integrate API", createdBy: "Dev", status: "in_progress" },
    { id: 4, title: "Deploy to Server", createdBy: "Admin", status: "done" },
  ];

  const statusStyle = {
    todo: {
      color: "bg-gray-100 text-gray-600",
      icon: <FiCircle />,
      label: "Todo",
    },
    review: {
      color: "bg-yellow-100 text-yellow-700",
      icon: <FiEye />,
      label: "Review",
    },
    in_progress: {
      color: "bg-blue-100 text-blue-600",
      icon: <FiClock />,
      label: "In Progress",
    },
    done: {
      color: "bg-green-100 text-green-600",
      icon: <FiCheckCircle />,
      label: "Done",
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Activity Timeline
        </h1>
        <p className="text-gray-500 text-sm">
          Track activity workflow progress
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative">

        {/* vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-200 -translate-x-1/2"></div>

        <div className="space-y-12">

          {activities.map((activity, index) => {
  const isLeft = index % 2 === 0;
  const style = statusStyle[activity.status];

  return (
    <div key={activity.id} className="relative grid grid-cols-2 items-center">

      {/* LEFT COLUMN */}
      <div className={`pr-10 ${!isLeft && "invisible"}`}>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800">
            {activity.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Created by {activity.createdBy}
          </p>

          <span className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-medium ${style.color}`}>
            {style.icon}
            {style.label}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className={`pl-10 ${isLeft && "invisible"}`}>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800">
            {activity.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Created by {activity.createdBy}
          </p>

          <span className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-medium ${style.color}`}>
            {style.icon}
            {style.label}
          </span>
        </div>
      </div>

      {/* CENTER DOT */}
      <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
        {style.icon}
      </div>

    </div>
  );
})}

        </div>
      </div>

    </div>
  );
}