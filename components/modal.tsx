import { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 px-2">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 sm:w-auto sm:min-w-[24rem]">
        {children}
      </div>
    </div>
  );
}
