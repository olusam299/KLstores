const CollectionTypeFrame = ({
  label,
  image,
  active,
  onClick,
}: {
  label: string;
  image: string | null;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-shrink-0 w-[220px] h-[220px] max-sm:w-[140px] max-sm:h-[140px] outline-none ${
        active ? "ring-2 ring-brand" : ""
      }`}
    >
      {image ? (
        <img
          src={`/assets/${image}`}
          alt={label}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gray-100" />
      )}
      <div
        className={`absolute bottom-0 w-full h-10 max-sm:h-8 flex justify-center items-center text-sm max-sm:text-xs transition-colors ${
          active ? "bg-brand text-white" : "bg-black/60 text-white"
        }`}
      >
        {label}
      </div>
    </button>
  );
};

export default CollectionTypeFrame;
