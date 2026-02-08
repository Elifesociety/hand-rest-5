import { motion } from "framer-motion";
import { Sparkles, Home, Building2, Briefcase, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/handrest-logo.jpeg";

const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-16"
        >
          <img src={logo} alt="HandRest Cleaning Solutions" className="h-16 md:h-20 object-contain" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-foreground/80 hover:text-brand-teal transition-colors font-medium">Services</a>
            <a href="#why-us" className="text-foreground/80 hover:text-brand-teal transition-colors font-medium">Why Us</a>
            <a href="#contact" className="text-foreground/80 hover:text-brand-teal transition-colors font-medium">Contact</a>
            <a href="/staff" className="text-foreground/80 hover:text-brand-teal transition-colors font-medium">Staff</a>
            <a href="/admin" className="text-foreground/80 hover:text-brand-teal transition-colors font-medium">Admin</a>
          </div>
          <Button variant="hero" size="lg" asChild>
            <a href="/app">Get Quote</a>
          </Button>
        </motion.nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-light-blue px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-brand-teal" />
              <span className="text-sm font-medium text-brand-navy">Professional Cleaning Services</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight mb-6">
              Spotless Spaces,{" "}
              <span className="text-gradient">Stress-Free</span> Living
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience the difference with HandRest Cleaning Solutions. We bring expertise, 
              reliability, and a sparkling finish to every space we touch.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="/app">Book a Cleaning</a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#services">View Services</a>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center gap-8 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-navy">500+</p>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-navy">5★</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-navy">10+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-brand-teal/20 rounded-full animate-pulse" />
              <div className="absolute inset-8 border-2 border-brand-green/20 rounded-full animate-pulse delay-75" />
              <div className="absolute inset-16 border-2 border-brand-teal/30 rounded-full animate-pulse delay-150" />
              
              {/* Center icon */}
              <div className="absolute inset-24 gradient-brand rounded-full flex items-center justify-center shadow-elevated animate-float">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
              
              {/* Floating cards */}
              <motion.div 
                className="absolute top-0 right-0 bg-card p-4 rounded-xl shadow-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Home className="w-8 h-8 text-brand-teal mb-2" />
                <p className="text-sm font-medium">Residential</p>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-20 left-0 bg-card p-4 rounded-xl shadow-card"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <Building2 className="w-8 h-8 text-brand-green mb-2" />
                <p className="text-sm font-medium">Commercial</p>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-0 right-20 bg-card p-4 rounded-xl shadow-card"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                <Briefcase className="w-8 h-8 text-brand-navy mb-2" />
                <p className="text-sm font-medium">Office</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Cleaning",
      description: "Comprehensive home cleaning tailored to your family's needs. From deep cleaning to regular maintenance.",
    },
    {
      icon: Building2,
      title: "Commercial Cleaning",
      description: "Professional cleaning solutions for offices, retail spaces, and commercial properties.",
    },
    {
      icon: Briefcase,
      title: "Office Cleaning",
      description: "Keep your workspace pristine and professional with our specialized office cleaning services.",
    },
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From homes to offices, we deliver exceptional cleaning services customized to your unique requirements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group gradient-card p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 gradient-brand rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Trusted & Insured",
      description: "Fully insured services with background-checked professionals.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book at your convenience with our easy scheduling system.",
    },
    {
      icon: Award,
      title: "Satisfaction Guaranteed",
      description: "Not happy? We'll re-clean for free. That's our promise.",
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-brand-light-blue">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Why Choose <span className="text-gradient">HandRest?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering excellence in every clean.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 shadow-card">
                <feature.icon className="w-10 h-10 text-brand-teal" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="gradient-brand rounded-3xl p-12 md:p-16 text-center shadow-elevated"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for a Sparkling Clean Space?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Get a free quote today and experience the HandRest difference. 
            No hidden fees, just exceptional cleaning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="xl" 
              className="bg-white text-brand-navy font-semibold hover:bg-white/90 rounded-full shadow-card hover:shadow-elevated hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/app">Get Free Quote</a>
            </Button>
            <Button 
              size="xl" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-navy rounded-full transition-all duration-300"
              asChild
            >
              <a href="tel:+919876543210">Call Us Now</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 bg-brand-navy text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={logo} alt="HandRest Cleaning Solutions" className="h-12 object-contain brightness-0 invert" />
          <p className="text-white/70 text-sm">
            © 2024 HandRest Cleaning Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/app" className="text-white/70 hover:text-white transition-colors">Book Now</a>
            <a href="/staff" className="text-white/70 hover:text-white transition-colors">Staff Portal</a>
            <a href="/admin" className="text-white/70 hover:text-white transition-colors">Admin</a>
            <a href="#contact" className="text-white/70 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <WhyUs />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
