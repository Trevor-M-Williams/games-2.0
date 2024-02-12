import React from "react";

export default function Heading({
  text,
  headingNumber,
}: {
  text: string;
  headingNumber: number;
}) {
  let HeadingComponent;
  switch (headingNumber) {
    case 1:
      HeadingComponent = <h1 className="text-3xl font-bold">{text}</h1>;
      break;
    case 2:
      HeadingComponent = <h2 className="text-2xl font-bold">{text}</h2>;
      break;
    case 3:
      HeadingComponent = <h3 className="text-xl font-bold">{text}</h3>;
      break;
    case 4:
      HeadingComponent = <h4 className="text-lg font-bold">{text}</h4>;
      break;
    case 5:
      HeadingComponent = <h5 className="text-base font-bold">{text}</h5>;
      break;
    case 6:
      HeadingComponent = <h6 className="text-sm font-bold">{text}</h6>;
      break;
    default:
      HeadingComponent = <h1 className="text-3xl font-bold">{text}</h1>;
  }

  return HeadingComponent;
}
