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
import { Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DepositTabProps {
  address: string;
}

export default function DepositTab({ address }: DepositTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast.success(
      JSON.stringify({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit SOL</CardTitle>
        <CardDescription>
          Send SOL to your wallet from an external source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your Wallet Address</h3>
              <div className="flex items-center gap-2">
                <div className="bg-[#1A1A1A] p-3 rounded-md border border-primary/20 font-mono text-sm break-all flex-1">
                  {address}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 px-2 border-primary hover:bg-primary/20 hover:text-primary"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">How to Deposit</h3>
              <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                <li>Copy your wallet address shown above</li>
                <li>
                  Open your external Solana wallet (e.g., Phantom, Solflare)
                </li>
                <li>Select the option to send SOL</li>
                <li>Paste your wallet address as the destination</li>
                <li>Enter the amount of SOL you want to deposit</li>
                <li>Confirm the transaction in your external wallet</li>
                <li>
                  Wait for the transaction to be confirmed on the Solana network
                </li>
                <li>Your balance will update automatically once confirmed</li>
              </ol>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500">Important</p>
                <p className="text-muted-foreground mt-1">
                  Only send SOL to this address. Sending other tokens may result
                  in permanent loss.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              {/* QR code for the wallet address */}
              <svg
                className="h-48 w-48"
                viewBox="0 0 100 100"
                style={{ shapeRendering: "crispEdges" }}
              >
                {/* This is a placeholder for a QR code - in a real app, you would generate this dynamically */}
                <path fill="#ffffff" d="M0,0 h100v100h-100z" />
                <path fill="#000000" d="M30,30 h40v40h-40z" />
                <path fill="#ffffff" d="M40,40 h20v20h-20z" />
                <path fill="#000000" d="M45,45 h10v10h-10z" />
                {/* Additional QR code patterns would be here */}
              </svg>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Scan this QR code with your Solana wallet app to deposit SOL
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
