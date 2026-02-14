const ProjectsCard = ({ projects }) => (
  <div className="bg-white rounded-xl p-5 shadow">
    <h2 className="text-sm font-medium mb-4">Projects</h2>
    <div className="grid grid-cols-3 gap-3">
      {projects.map((p) => (
        <div
          key={p.id}
          className="h-24 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs"
        >
          {p.name}
        </div>
      ))}
    </div>
  </div>
);

export default ProjectsCard;
