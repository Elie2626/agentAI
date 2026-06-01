"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, Mail, Shield, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast.success("Profil mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Paramètres</h1>
        <p className="mt-1 text-muted-foreground">Gérez votre compte et vos préférences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
          <CardDescription>Informations de votre compte.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">Nom affiché</label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Spinner className="h-4 w-4" /> : <><Save className="h-4 w-4" /> Enregistrer</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Méthode de connexion</p>
              <p className="text-sm text-muted-foreground">
                {user?.providerData[0]?.providerId === "google.com"
                  ? "Connecté via Google"
                  : "Connecté par email / mot de passe"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
