import { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <div className=" inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center fixed">
      <div className="min-w-[24rem] bg-white p-8 rounded-lg">{children}</div>
    </div>
  );
}
