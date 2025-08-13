import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users, Sparkles } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";

export default function LandingPage() {
  const { seoConfig } = useSEO();

  // Default fallback values if SEO config is not loaded or empty
  const siteName = seoConfig?.companyName || "AdminFlow";
  const siteTitle = seoConfig?.title || "Simplifique sua Administração";
  const siteDescription = seoConfig?.description || "Uma plataforma moderna e intuitiva para gerenciar seus projetos, equipes e recursos com eficiência máxima.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Inject SEO meta tags */}
      {seoConfig && <SEOHead config={seoConfig} />}
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">{siteName}</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/admin">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/admin">
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              🚀 Nova versão disponível
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {siteTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {siteDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/admin">
                  Iniciar Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tudo que você precisa para administrar seus projetos de forma eficiente
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Segurança Avançada</h3>
                <p className="text-muted-foreground">
                  Proteja seus dados com criptografia de ponta e autenticação multi-fator
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Performance Rápida</h3>
                <p className="text-muted-foreground">
                  Interface otimizada para carregar rapidamente e responder instantaneamente
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Colaboração em Equipe</h3>
                <p className="text-muted-foreground">
                  Trabalhe em conjunto com sua equipe em tempo real e gerencie permissões
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de empresas que já transformaram sua administração
              </p>
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/admin">
                  Acessar Painel Admin
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">{siteName}</span>
              </div>
              <p className="text-muted-foreground">
                {siteDescription}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreira</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 {siteName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
