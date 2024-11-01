import ButtonProfile from "../utilities/ButtonProfile";

const Header = ({ title, subtitle }) => {
  return (
    <div>
      <div className="bg-[#B12C30] text-white py-12 px-8 shadow-md mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-4xl ml-4">{title}</h1>
        </div>
        <ButtonProfile />
      </div>
      <div className="bg-white shadow-lg p-1 flex justify-center items-center mb-3">
        <h2 className="text-3xl font-bold text-black py-12 px-8 text-center">
          {subtitle}
        </h2>
      </div>
    </div>
  );
};

export default Header;
