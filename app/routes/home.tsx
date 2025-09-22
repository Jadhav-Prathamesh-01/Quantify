import { useState, useEffect } from 'react';
import type { Route } from "./+types/home";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { GetStarted } from "../components/GetStarted";
import { About } from "../components/About";
import { Features } from "../components/Features";
import { TrustedBy } from "../components/TrustedBy";
import { ContactUs } from "../components/ContactUs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quantify_rating" },
    { name: "description", content: "Quantify Rating - Your trusted rating platform" },
  ];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <GetStarted />
      <About />
      <Features />
      <TrustedBy />
      <ContactUs />
    </div>
  );
}
