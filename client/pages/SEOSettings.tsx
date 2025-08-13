import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Save,
  Image,
  Link,
  Globe,
  Twitter,
  Facebook,
} from "lucide-react";
import { SEOConfig, SEOResponse, UploadResponse } from "@shared/seo";
import { toast } from "sonner";

export default function SEOSettings() {
  const [config, setConfig] = useState<SEOConfig>({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    ogUrl: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    twitterSite: "",
    favicon: "",
    appleTouchIcon: "",
    canonical: "",
    robots: "index, follow",
    language: "pt-BR",
    companyName: "",
    socialLinks: {},
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load SEO configuration on component mount
  useEffect(() => {
    loadSEOConfig();
  }, []);

  const loadSEOConfig = async () => {
    try {
      const response = await fetch("/api/seo");
      const data: SEOResponse = await response.json();

      if (data.success && data.data) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error("Error loading SEO config:", error);
      toast.error("Erro ao carregar configurações SEO");
    }
  };

  const saveSEOConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data: SEOResponse = await response.json();

      if (data.success) {
        toast.success("Configurações SEO salvas com sucesso!");
      } else {
        toast.error(data.message || "Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Error saving SEO config:", error);
      toast.error("Erro ao salvar configurações SEO");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, fieldName: keyof SEOConfig) => {
    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
            filename: file.name,
            type: file.type,
          }),
        });

        const data: UploadResponse = await response.json();

        if (data.success && data.url) {
          setConfig((prev) => ({
            ...prev,
            [fieldName]: data.url,
          }));
          toast.success("Imagem enviada com sucesso!");
        } else {
          toast.error(data.message || "Erro ao fazer upload da imagem");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload da imagem");
      setUploading(false);
    }
  };

  const updateField = (field: keyof SEOConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSocialLink = (platform: string, url: string) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url,
      },
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configurações SEO</h1>
            <p className="text-muted-foreground">
              Configure as meta tags e imagens para otimização nos mecanismos de
              busca
            </p>
          </div>
          <Button onClick={saveSEOConfig} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">SEO Básico</TabsTrigger>
            <TabsTrigger value="opengraph">Open Graph</TabsTrigger>
            <TabsTrigger value="twitter">Twitter Cards</TabsTrigger>
            <TabsTrigger value="images">Imagens & Favicon</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  SEO Básico
                </CardTitle>
                <CardDescription>
                  Configurações fundamentais para mecanismos de busca
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Página</Label>
                  <Input
                    id="title"
                    value={config.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Título principal do site"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {config.title.length}/60 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Descrição do site que aparece nos resultados de busca"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {config.description.length}/160 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Palavras-chave</Label>
                  <Input
                    id="keywords"
                    value={config.keywords}
                    onChange={(e) => updateField("keywords", e.target.value)}
                    placeholder="admin, gestão, plataforma, automação (separadas por vírgula)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={config.language}
                      onValueChange={(value) => updateField("language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          Português (Brasil)
                        </SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="robots">Robots</Label>
                    <Select
                      value={config.robots}
                      onValueChange={(value) => updateField("robots", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index, follow">
                          Index, Follow
                        </SelectItem>
                        <SelectItem value="noindex, nofollow">
                          No Index, No Follow
                        </SelectItem>
                        <SelectItem value="index, nofollow">
                          Index, No Follow
                        </SelectItem>
                        <SelectItem value="noindex, follow">
                          No Index, Follow
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical">URL Canônica</Label>
                  <Input
                    id="canonical"
                    value={config.canonical}
                    onChange={(e) => updateField("canonical", e.target.value)}
                    placeholder="https://seudominio.com"
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opengraph" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Facebook className="mr-2 h-5 w-5" />
                  Open Graph (Facebook)
                </CardTitle>
                <CardDescription>
                  Configurações para compartilhamento no Facebook e outras redes
                  sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ogTitle">Título OG</Label>
                  <Input
                    id="ogTitle"
                    value={config.ogTitle}
                    onChange={(e) => updateField("ogTitle", e.target.value)}
                    placeholder="Título para compartilhamento social"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogDescription">Descrição OG</Label>
                  <Textarea
                    id="ogDescription"
                    value={config.ogDescription}
                    onChange={(e) =>
                      updateField("ogDescription", e.target.value)
                    }
                    placeholder="Descrição para compartilhamento social"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogType">Tipo OG</Label>
                    <Select
                      value={config.ogType}
                      onValueChange={(value) => updateField("ogType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogUrl">URL OG</Label>
                    <Input
                      id="ogUrl"
                      value={config.ogUrl}
                      onChange={(e) => updateField("ogUrl", e.target.value)}
                      placeholder="https://seudominio.com"
                      type="url"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Twitter className="mr-2 h-5 w-5" />
                  Twitter Cards
                </CardTitle>
                <CardDescription>
                  Configurações para compartilhamento no Twitter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Tipo de Card</Label>
                  <Select
                    value={config.twitterCard}
                    onValueChange={(value: "summary" | "summary_large_image") =>
                      updateField("twitterCard", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">
                        Summary Large Image
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterSite">Site Twitter (@usuario)</Label>
                  <Input
                    id="twitterSite"
                    value={config.twitterSite}
                    onChange={(e) => updateField("twitterSite", e.target.value)}
                    placeholder="@seuusuario"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterTitle">Título Twitter</Label>
                  <Input
                    id="twitterTitle"
                    value={config.twitterTitle}
                    onChange={(e) =>
                      updateField("twitterTitle", e.target.value)
                    }
                    placeholder="Título para Twitter"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterDescription">Descrição Twitter</Label>
                  <Textarea
                    id="twitterDescription"
                    value={config.twitterDescription}
                    onChange={(e) =>
                      updateField("twitterDescription", e.target.value)
                    }
                    placeholder="Descrição para Twitter"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2 h-5 w-5" />
                  Imagens & Favicon
                </CardTitle>
                <CardDescription>
                  Upload de favicon e imagens para redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Favicon (32x32px)</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      {config.favicon && (
                        <img
                          src={config.favicon}
                          alt="Favicon"
                          className="w-8 h-8"
                        />
                      )}
                      <Button
                        variant="outline"
                        disabled={uploading}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) handleImageUpload(file, "favicon");
                          };
                          input.click();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Enviando..." : "Upload Favicon"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Apple Touch Icon (180x180px)</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      {config.appleTouchIcon && (
                        <img
                          src={config.appleTouchIcon}
                          alt="Apple Touch Icon"
                          className="w-12 h-12 rounded-lg"
                        />
                      )}
                      <Button
                        variant="outline"
                        disabled={uploading}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) handleImageUpload(file, "appleTouchIcon");
                          };
                          input.click();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Enviando..." : "Upload Apple Touch Icon"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Imagem Open Graph (1200x630px)</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      {config.ogImage && (
                        <img
                          src={config.ogImage}
                          alt="OG Image"
                          className="w-24 h-12 object-cover rounded"
                        />
                      )}
                      <Button
                        variant="outline"
                        disabled={uploading}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) {
                              handleImageUpload(file, "ogImage");
                              // Also set as Twitter image
                              setConfig((prev) => ({
                                ...prev,
                                twitterImage: prev.ogImage,
                              }));
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Enviando..." : "Upload Imagem Social"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="mr-2 h-5 w-5" />
                  Redes Sociais
                </CardTitle>
                <CardDescription>Links para suas redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={config.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="AdminFlow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={config.socialLinks.facebook || ""}
                      onChange={(e) =>
                        updateSocialLink("facebook", e.target.value)
                      }
                      placeholder="https://facebook.com/seupage"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={config.socialLinks.twitter || ""}
                      onChange={(e) =>
                        updateSocialLink("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/seuusuario"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={config.socialLinks.linkedin || ""}
                      onChange={(e) =>
                        updateSocialLink("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/company/suaempresa"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={config.socialLinks.instagram || ""}
                      onChange={(e) =>
                        updateSocialLink("instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/seuusuario"
                      type="url"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
