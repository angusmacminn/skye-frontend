import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Contact Hero Section */}
        <section className="contact-hero py-16 md:py-24">
          <div className="max-w-screen-2xl mx-auto px-[10px]">
            <div className="hero-content ">
              <h1 className="text-h1-mobile md:text-h1-desktop text-skye-primary-red mb-6">
                Let&apos;s build something amazing together
              </h1>
              <p className="text-p-mobile md:text-p-desktop text-skye-gray max-w-2xl">
                We&apos;re passionate about creating digital experiences that make a difference. 
                Whether you&apos;re a startup with big dreams or an established company looking to innovate, 
                we&apos;d love to hear about your project.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section bg-white">
          <div className="py-16 md:py-24 max-w-screen-2xl mx-auto">
            <div className="form-container px-[10px] max-w-4xl">
              <div className="form-header mb-12">
                <h2 className="text-h2-mobile md:text-h2-desktop text-skye-gray mb-4">
                  Tell us about your project
                </h2>
                <p className="text-p-mobile md:text-p-desktop text-skye-gray">
                  The more details you can share, the better we can understand your needs and provide an accurate proposal.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="contact-info-section py-16 md:py-24">
          <div className="max-w-screen-2xl mx-auto px-[10px]">
            <div className="info-flex flex flex-col md:flex-row gap-8 justify-center md:justify-between">
              
              {/* Email */}
              <div className="info-item flex-1 min-w-[280px] text-center md:text-left">
                <h3 className="text-h3-mobile md:text-h3-desktop text-skye-primary-red mb-4">
                  Email
                </h3>
                <p className="text-p-mobile md:text-p-desktop text-skye-gray mb-2">
                  For project inquiries
                </p>
                <a 
                  href="mailto:hello@skyeinteractive.com" 
                  className="text-submobile md:text-subdesktop text-skye-primary-red hover:text-skye-primary-red-light transition-colors"
                >
                  hello@skyeinteractive.com
                </a>
              </div>

              {/* Response Time */}
              <div className="info-item flex-1 min-w-[280px] text-center md:text-left">
                <h3 className="text-h3-mobile md:text-h3-desktop text-skye-primary-red mb-4">
                  Response Time
                </h3>
                <p className="text-p-mobile md:text-p-desktop text-skye-gray mb-2">
                  We typically respond within
                </p>
                <p className="text-submobile md:text-subdesktop text-skye-primary-red">
                  24 hours
                </p>
              </div>

              {/* Office Hours */}
              <div className="info-item flex-1 min-w-[280px] text-center md:text-left">
                <h3 className="text-h3-mobile md:text-h3-desktop text-skye-primary-red mb-4">
                  Office Hours
                </h3>
                <p className="text-p-mobile md:text-p-desktop text-skye-primary-red mb-2">
                  Monday - Friday
                </p>
                <p className="text-submobile md:text-subdesktop text-skye-primary-red">
                  9:00 AM - 6:00 PM EST
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section bg-white">
          <div className="py-16 md:py-24 max-w-screen-2xl mx-auto">
            <div className="faq-container px-[10px] max-w-4xl">
              <h2 className="text-h2-mobile md:text-h2-desktop text-skye-gray mb-12 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="faq-grid space-y-8">
                <div className="faq-item">
                  <h3 className="text-submobile md:text-subdesktop text-skye-primary-red mb-3">
                    What&apos;s your typical project timeline?
                  </h3>
                  <p className="text-p-mobile md:text-p-desktop text-skye-gray">
                    Project timelines vary based on scope and complexity. A typical website project takes 6-12 weeks, 
                    while larger applications can take 3-6 months. We&apos;ll provide a detailed timeline during our initial consultation.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 className="text-submobile md:text-subdesktop text-skye-primary-red mb-3">
                    Do you work with startups?
                  </h3>
                  <p className="text-p-mobile md:text-p-desktop text-skye-gray">
                    Absolutely! We love working with startups and understand the unique challenges they face. 
                    We offer flexible payment options and can work within various budget constraints.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 className="text-submobile md:text-subdesktop text-skye-primary-red mb-3">
                    What&apos;s included in your web development services?
                  </h3>
                  <p className="text-p-mobile md:text-p-desktop text-skye-gray">
                    Our services include strategy, UX/UI design, front-end and back-end development, testing, 
                    deployment, and ongoing support. We handle everything from concept to launch.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 className="text-submobile md:text-subdesktop text-skye-primary-red mb-3">
                    Do you provide ongoing support after launch?
                  </h3>
                  <p className="text-p-mobile md:text-p-desktop text-skye-gray">
                    Yes, we offer various support packages including maintenance, updates, hosting, 
                    and feature enhancements to ensure your digital presence continues to evolve with your business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}