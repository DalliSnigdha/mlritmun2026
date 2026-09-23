import { About } from "@/components/About";
import { Committees } from "@/components/Committees";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Registration } from "@/components/Registration";
import { WhyMlritmun } from "@/components/WhyMlritmun";

/**
 * The whole of V1 is a single page. Each section is a self-contained component
 * with its own anchor id, so adding, reordering or removing one is a one-line
 * change here.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhyMlritmun />
        <Committees />
        <Registration />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
