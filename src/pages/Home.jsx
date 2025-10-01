import bgImage from "../assets/Images/Backgrounds/Bgimage3.png";


export default function Home() {
    return (
        <div
        aria-hidden 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          width: "100%",
        }}
        className="min-h-screen flex items-start justify-center pt-80">
            <h1 className="text-4xl font-bold">RotomDexin</h1>
        </div>
    );
}