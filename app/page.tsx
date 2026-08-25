import Header from "@/components/Header";
import GenerateForm from "@/components/GenerateForm";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center gap-16 px-4 pb-20">
      <Header />
      <GenerateForm />
      <PricingSection />
    </div>
  );
}
