import { Link } from "react-router";

function Card({ slug, icon, title, color }) {
  return (
    <Link to={slug}>
      <div
        className="group text-center h-40 py-10 text-white shadow-md flex flex-col justify-center items-center rounded-md bg-opacity-90 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-opacity-100"
        style={{ backgroundColor: color }}
      >
        <div className="pb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <i className={`${icon} text-3xl`} />
        </div>
        <p className="text-lg font-medium tracking-wide transition-opacity duration-300 group-hover:opacity-90">
          {title}
        </p>
      </div>
    </Link>
  );
}

export default Card;
