import React from "react";

export default () => {
  return (
    <div>
      <div className="push" />
      <footer className="bd-footer text-white mt-5 p-2 text-center footer">
        Copyright &copy; {new Date().getFullYear()} Project
      </footer>
    </div>
  );
};
