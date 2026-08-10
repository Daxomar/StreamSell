'use client'

const DevModeBadge = () => {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "relative",
        padding: "6px 10px",
        backgroundColor: "green",
        color: "#fff",
      
        fontWeight: "bold",
        borderRadius: "6px",
        zIndex: 9999,
      }}

      className="text-[8px] sm:text-[12px]"
    >
      DEV MODE
    </div>
  );
};

export default DevModeBadge;
