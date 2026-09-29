const TYPES = ["All", "Tops", "Dresses", "Shorts", "Jeans"];

const HomeCollectionFilter = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (type: string) => void;
}) => {
  return (
    <div className="max-w-screen-2xl flex items-center justify-between mx-auto mt-24 max-lg:flex-col max-lg:gap-y-5 px-5 max-[400px]:px-3">
      <ul className="flex gap-8 items-center text-black text-2xl tracking-[0.72px] max-sm:text-xl max-[450px]:text-lg max-[450px]:gap-2 max-[350px]:text-base">
        {TYPES.map((type) => (
          <li
            key={type}
            onClick={() => onChange(type)}
            className={`cursor-pointer transition-colors ${
              active === type ? "text-brand" : "text-black hover:text-brand"
            }`}
          >
            {type}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default HomeCollectionFilter;
