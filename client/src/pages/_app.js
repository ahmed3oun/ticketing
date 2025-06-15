import Footer from "@/components/footer";
import Header from "@/components/header";


const AppComponent = ({ Component }) => {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]"
        >
            <Header />
            <Component />
            <Footer />
        </div>

    );
}



export default AppComponent;
// This is the main entry point for the app, which renders the AppComponent.