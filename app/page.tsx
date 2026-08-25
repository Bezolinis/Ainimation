import Header from "@/components/Header";
import GenerateForm from "@/components/GenerateForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center px-4 pb-20">
      <Header />
      <GenerateForm />
    </div>
  );
}
