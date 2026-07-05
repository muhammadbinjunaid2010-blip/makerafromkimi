import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { Settings, Globe, Home, Link2, Search, Mail, Palette, Sliders, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const defaultForm = {
  siteName: "Makera",
  siteDescription: "Built by Makers, for Makers",
  logo: "",
  favicon: "",
  primaryColor: "#2563eb",
  heroTitle: "Built by Makers, for Makers",
  heroSubtitle: "A community where electronics, robotics, embedded systems, AI, 3D printing and makers come together.",
  heroCtaText: "Join Community",
  heroCtaLink: "/community",
  heroBackgroundImage: "",
  socialGithub: "",
  socialDiscord: "",
  socialLinkedin: "",
  socialYoutube: "",
  socialWhatsapp: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  emailFrom: "",
  emailFooter: "",
  emailLogo: "",
  showHero: true,
  showCategories: true,
  showFeaturedProducts: true,
  showFeaturedProjects: true,
  showLatestBlogs: true,
  showWhyChooseUs: true,
  showTrustedBy: true,
  showCTA: true,
};

export default function AdminSettings() {
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery(undefined, { retry: false });
  const updateSettings = trpc.admin.updateSettings.useMutation({
    onSuccess: () => toast.success("Settings saved successfully"),
    onError: (err) => toast.error(err.message),
  });

  const [form, setForm] = useState(defaultForm);
  const [initialized, setInitialized] = useState(false);

  // Initialize form from settings data
  if (settings && !initialized) {
    setForm({
      siteName: settings.siteName || defaultForm.siteName,
      siteDescription: settings.siteDescription || defaultForm.siteDescription,
      logo: settings.logo || "",
      favicon: settings.favicon || "",
      primaryColor: settings.primaryColor || defaultForm.primaryColor,
      heroTitle: settings.heroTitle || defaultForm.heroTitle,
      heroSubtitle: settings.heroSubtitle || defaultForm.heroSubtitle,
      heroCtaText: settings.heroCtaText || defaultForm.heroCtaText,
      heroCtaLink: settings.heroCtaLink || defaultForm.heroCtaLink,
      heroBackgroundImage: settings.heroBackgroundImage || "",
      socialGithub: settings.socialGithub || "",
      socialDiscord: settings.socialDiscord || "",
      socialLinkedin: settings.socialLinkedin || "",
      socialYoutube: settings.socialYoutube || "",
      socialWhatsapp: settings.socialWhatsapp || "",
      seoTitle: settings.seoTitle || "",
      seoDescription: settings.seoDescription || "",
      seoKeywords: Array.isArray(settings.seoKeywords) ? settings.seoKeywords.join(", ") : "",
      emailFrom: settings.emailFrom || "",
      emailFooter: settings.emailFooter || "",
      emailLogo: settings.emailLogo || "",
      showHero: settings.showHero ?? true,
      showCategories: settings.showCategories ?? true,
      showFeaturedProducts: settings.showFeaturedProducts ?? true,
      showFeaturedProjects: settings.showFeaturedProjects ?? true,
      showLatestBlogs: settings.showLatestBlogs ?? true,
      showWhyChooseUs: settings.showWhyChooseUs ?? true,
      showTrustedBy: settings.showTrustedBy ?? true,
      showCTA: settings.showCTA ?? true,
    });
    setInitialized(true);
  }

  const handleSave = () => {
    updateSettings.mutate({
      ...form,
      seoKeywords: form.seoKeywords.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader icon={Settings} title="Settings" description="Manage platform configuration" />
        <Card><CardContent className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start justify-between">
        <SectionHeader icon={Settings} title="Settings" description="Manage platform configuration" />
        <Button onClick={handleSave} disabled={updateSettings.isPending} size="lg">
          {updateSettings.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="general" className="text-xs"><Globe className="h-3.5 w-3.5 mr-1.5" /> General</TabsTrigger>
          <TabsTrigger value="hero" className="text-xs"><Home className="h-3.5 w-3.5 mr-1.5" /> Hero</TabsTrigger>
          <TabsTrigger value="sections" className="text-xs"><Sliders className="h-3.5 w-3.5 mr-1.5" /> Sections</TabsTrigger>
          <TabsTrigger value="social" className="text-xs"><Link2 className="h-3.5 w-3.5 mr-1.5" /> Social</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs"><Search className="h-3.5 w-3.5 mr-1.5" /> SEO</TabsTrigger>
          <TabsTrigger value="email" className="text-xs"><Mail className="h-3.5 w-3.5 mr-1.5" /> Email</TabsTrigger>
          <TabsTrigger value="branding" className="text-xs"><Palette className="h-3.5 w-3.5 mr-1.5" /> Branding</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>Site Configuration</CardTitle><CardDescription>Basic site-wide settings</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value={form.siteName} onChange={(e) => update("siteName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="flex-1" />
                    <div className="w-9 h-9 rounded-md border shrink-0" style={{ backgroundColor: form.primaryColor }} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Site Description</Label>
                <Textarea value={form.siteDescription} onChange={(e) => update("siteDescription", e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Banner */}
        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero Banner</CardTitle><CardDescription>Customize the homepage hero section</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Hero Title</Label><Input value={form.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} /></div>
                <div className="space-y-2"><Label>CTA Button Text</Label><Input value={form.heroCtaText} onChange={(e) => update("heroCtaText", e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Hero Subtitle</Label><Textarea value={form.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} rows={2} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>CTA Link</Label><Input value={form.heroCtaLink} onChange={(e) => update("heroCtaLink", e.target.value)} /></div>
                <div className="space-y-2"><Label>Background Image URL</Label><Input value={form.heroBackgroundImage} onChange={(e) => update("heroBackgroundImage", e.target.value)} placeholder="Optional 3D background image" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Visibility */}
        <TabsContent value="sections">
          <Card>
            <CardHeader><CardTitle>Homepage Sections</CardTitle><CardDescription>Toggle visibility of homepage sections</CardDescription></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { key: "showHero", label: "Hero Banner" },
                  { key: "showCategories", label: "Shop by Category" },
                  { key: "showFeaturedProducts", label: "Featured Products" },
                  { key: "showFeaturedProjects", label: "Featured Community Projects" },
                  { key: "showLatestBlogs", label: "Latest Blogs" },
                  { key: "showWhyChooseUs", label: "Why Makera?" },
                  { key: "showTrustedBy", label: "Trusted By" },
                  { key: "showCTA", label: "Call to Action" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border p-4">
                    <Label className="cursor-pointer">{label}</Label>
                    <Switch checked={(form as any)[key]} onCheckedChange={(v) => update(key, v)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader><CardTitle>Social Links</CardTitle><CardDescription>Configure social media links shown in the footer</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "socialGithub", label: "GitHub URL", placeholder: "https://github.com/makera" },
                { key: "socialDiscord", label: "Discord Invite", placeholder: "https://discord.gg/makera" },
                { key: "socialLinkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/makera" },
                { key: "socialYoutube", label: "YouTube URL", placeholder: "https://youtube.com/@makera" },
                { key: "socialWhatsapp", label: "WhatsApp Number", placeholder: "+94 77 123 4567" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input value={(form as any)[key] || ""} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>SEO Settings</CardTitle><CardDescription>Search engine optimization defaults</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Default SEO Title</Label><Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} /></div>
              <div className="space-y-2"><Label>Default SEO Description</Label><Textarea value={form.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} rows={2} /></div>
              <div className="space-y-2"><Label>SEO Keywords (comma-separated)</Label><Input value={form.seoKeywords} onChange={(e) => update("seoKeywords", e.target.value)} placeholder="electronics, robotics, makers" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader><CardTitle>Email Settings</CardTitle><CardDescription>Configure transactional email defaults</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>From Address</Label><Input type="email" value={form.emailFrom} onChange={(e) => update("emailFrom", e.target.value)} placeholder="noreply@makera.lk" /></div>
              <div className="space-y-2"><Label>Email Footer Text</Label><Textarea value={form.emailFooter} onChange={(e) => update("emailFooter", e.target.value)} rows={2} /></div>
              <div className="space-y-2"><Label>Email Logo URL</Label><Input value={form.emailLogo} onChange={(e) => update("emailLogo", e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Upload your logo and favicon</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input value={form.logo} onChange={(e) => update("logo", e.target.value)} placeholder="https://makera.lk/logo.png" />
                  {form.logo && <img src={form.logo} alt="Logo preview" className="h-12 mt-2 rounded border p-1" />}
                </div>
                <div className="space-y-2">
                  <Label>Favicon URL</Label>
                  <Input value={form.favicon} onChange={(e) => update("favicon", e.target.value)} placeholder="https://makera.lk/favicon.ico" />
                  {form.favicon && <img src={form.favicon} alt="Favicon preview" className="h-8 mt-2 rounded" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-4">
          <p className="text-sm text-muted-foreground">Changes are saved to the database</p>
          <Button onClick={handleSave} disabled={updateSettings.isPending} size="lg">
            {updateSettings.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
