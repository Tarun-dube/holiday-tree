import CombinedSearchForm from '@/components/feature/CombinedSearchForm';
import { Award, Clock, Globe } from 'lucide-react'; // Import icons

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/hero-background.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Plan Your Next Adventure
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Find the best deals on flights and hotels for your dream destination.
          </p>
        </div>
      </section>

      {/* The All-in-One Search Form */}
      <section className="-mt-24 relative z-20 px-4">
        <div className="container mx-auto">
          <CombinedSearchForm />
        </div>
      </section>

      {/* Features Section - NOW THEMED */}
      <section className="py-20 bg-background">
         <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
              {/* Use the theme's muted-foreground color */}
              <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
                We offer a seamless and comprehensive booking experience with unbeatable prices and a wide selection.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6">
                      <Award className="h-10 w-10 mx-auto text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
                      <p className="text-muted-foreground">
                        Find the lowest prices on flights and hotels, backed by our guarantee.
                      </p>
                  </div>
                  <div className="p-6">
                      <Clock className="h-10 w-10 mx-auto text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">24/7 Customer Support</h3>
                      <p className="text-muted-foreground">
                        Our team is here to help you around the clock with any questions.
                      </p>
                  </div>
                  <div className="p-6">
                      <Globe className="h-10 w-10 mx-auto text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                      <p className="text-muted-foreground">
                        Access thousands of destinations and properties worldwide.
                      </p>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}