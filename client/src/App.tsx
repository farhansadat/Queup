import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./components/LanguageProvider";
import NotFound from "@/pages/not-found";
import CustomerQueuePage from "@/pages/store/[slug]";
import KioskDisplayPage from "@/pages/store/[slug]/display";
import DashboardPage from "@/pages/dashboard";
import LoginPage from "@/pages/login";
import LandingPage from "@/pages/landing";
import FeaturesPage from "@/pages/features";
import PricingPage from "@/pages/pricing";
import AboutPage from "@/pages/about";
import HelpPage from "@/pages/help";
import StatusPage from "@/pages/status";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />

      <Route path="/help" component={HelpPage} />
      <Route path="/status" component={StatusPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/store/:slug/display" component={KioskDisplayPage} />
      <Route path="/store/:slug" component={CustomerQueuePage} />
      <Route path="/" component={LandingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
