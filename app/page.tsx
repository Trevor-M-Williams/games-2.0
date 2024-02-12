import Link from "next/link";

import Container from "@/components/container";
import Heading from "@/components/heading";

export default function Home() {
  return (
    <div className="py-20">
      <Container>
        <Heading text="Home" headingNumber={1} />
        <Link href="/threes">Threes</Link>
      </Container>
    </div>
  );
}
