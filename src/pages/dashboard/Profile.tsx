import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, User, Github, GraduationCap, Link2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading, refetch } = trpc.user.getProfile.useQuery(undefined, {
    retry: false,
  });
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [university, setUniversity] = useState("");
  const [github, setGithub] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState("");
  const [newSocialKey, setNewSocialKey] = useState("");
  const [newSocialValue, setNewSocialValue] = useState("");

  useEffect(() => {
    if (profileData?.profile) {
      const p = profileData.profile;
      setDisplayName(p.displayName || user?.name || "");
      setBio(p.bio || "");
      setSkills(p.skills || []);
      setUniversity(p.university || "");
      setGithub(p.github || "");
      setSocialLinks(p.socialLinks || {});
    }
  }, [profileData, user]);

  const handleSave = () => {
    updateProfileMutation.mutate({
      displayName,
      bio,
      skills,
      university,
      github,
      socialLinks,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addSocialLink = () => {
    if (newSocialKey.trim() && newSocialValue.trim()) {
      setSocialLinks({ ...socialLinks, [newSocialKey.trim()]: newSocialValue.trim() });
      setNewSocialKey("");
      setNewSocialValue("");
    }
  };

  const removeSocialLink = (key: string) => {
    const newLinks = { ...socialLinks };
    delete newLinks[key];
    setSocialLinks(newLinks);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your public profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            This information will be displayed publicly on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="text-2xl font-medium">
                {displayName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                Avatar is managed via your account provider
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about yourself..."
              rows={4}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="university" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                University
              </Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Your university or school"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub Username
              </Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="your-github-username"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Social Links
            </Label>
            {Object.entries(socialLinks).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Input value={key} disabled className="w-32 bg-muted" />
                <Input value={value} disabled className="flex-1 bg-muted" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(key)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newSocialKey}
                onChange={(e) => setNewSocialKey(e.target.value)}
                placeholder="Platform (e.g., twitter)"
                className="w-32"
              />
              <Input
                value={newSocialValue}
                onChange={(e) => setNewSocialValue(e.target.value)}
                placeholder="URL or username"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addSocialLink}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              size="lg"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
