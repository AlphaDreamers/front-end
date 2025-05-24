"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield,
  Lock,
  Key,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SecurityTab() {
  const [password, setPassword] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Mock private key
  const privateKey = "5Kg1gnAjaLfKiwhhPpGS3QfRg2m6awQvaj98JCZBZQ5SuS2Fd5p";

  const handleViewPrivateKey = () => {
    if (!password) {
      setError("Password is required to view your private key");
      return;
    }

    // In a real app, you would verify the password
    if (password !== "password") {
      // Demo password
      setError("Incorrect password");
      return;
    }

    setError("");
    setShowKeyModal(true);
    setPassword("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast.success(
      JSON.stringify({
        title: "Private Key Copied",
        description: "Your private key has been copied to clipboard",
      })
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your wallet security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                View Private Key
              </h3>
              <div className="space-y-2">
                <Label htmlFor="password">Enter Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password to view private key"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="bg-[#1A1A1A] border-primary/20"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <Button
                onClick={handleViewPrivateKey}
                className="bg-primary hover:bg-primary/90 transition-all"
              >
                View Private Key
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Tips
              </h3>
              <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                <li>Never share your private key or seed phrase with anyone</li>
                <li>Store your seed phrase in a secure, offline location</li>
                <li>
                  Consider using a hardware wallet for additional security
                </li>
                <li>Be cautious of phishing attempts and fake websites</li>
                <li>Always verify transaction details before confirming</li>
                <li>Enable two-factor authentication where available</li>
                <li>Use a strong, unique password for your wallet</li>
                <li>Regularly update your devices and software</li>
              </ul>
            </div>

            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-500">
                  Critical Security Warning
                </p>
                <p className="text-muted-foreground mt-1">
                  Your private key provides full access to your wallet. Never
                  share it with anyone, enter it on untrusted websites, or store
                  it in plain text on your devices.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Additional Security Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start border-primary/20 hover:bg-primary/20 hover:text-primary"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
                <Button
                  variant="outline"
                  className="justify-start border-primary/20 hover:bg-primary/20 hover:text-primary"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Private Key Modal */}
      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent className="sm:max-w-md bg-[#121212] border-primary/20">
          <DialogHeader>
            <DialogTitle>Your Private Key</DialogTitle>
            <DialogDescription>
              This is your private key. Keep it secure and never share it with
              anyone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-500">Extreme Caution</p>
                <p className="text-muted-foreground mt-1">
                  Anyone with your private key has complete control over your
                  wallet and funds. Never share this key with anyone.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="p-4 bg-[#1A1A1A] border border-primary/20 rounded-lg font-mono text-sm break-all">
                {showPrivateKey
                  ? privateKey
                  : "••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              We recommend storing your private key in a password manager or a
              secure, offline location.
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowKeyModal(false)}
              className="w-full bg-primary hover:bg-primary/90 transition-all"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
