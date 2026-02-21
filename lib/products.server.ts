import { SupabaseClient } from "@supabase/supabase-js";
import { type Product } from "./products";

const BUCKET = "3d-models";

// ─── Server-only Storage Helpers ─────────────────────────────────────────────
//
// These helpers require a cookie-aware Supabase client from server.ts.
// Never import this file from 'use client' components.
//
// Usage (Server Component or Route Handler):
//
//   import { createClient } from '@/lib/supabase/server'
//   import { getModelUrl, getSignedModelUrl, uploadModelFile } from '@/lib/products.server'
//
//   const supabase = await createClient()
//   const url = getModelUrl(product, supabase)

/**
 * Returns the public URL for a product's GLB file via the server client.
 * Use getPublicModelUrl from products.ts instead if calling from a client component.
 */
export function getModelUrl(
  product: Product,
  supabase: SupabaseClient,
): string | null {
  if (!product.storagePath) return null;
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(product.storagePath);
  return data.publicUrl;
}

/**
 * Returns a signed (temporary) URL for a product's GLB file.
 * Use this when the bucket is private and you need time-limited access.
 * expiresIn is in seconds (default: 1 hour).
 */
export async function getSignedModelUrl(
  product: Product,
  supabase: SupabaseClient,
  expiresIn = 3600,
): Promise<string | null> {
  if (!product.storagePath) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(product.storagePath, expiresIn);
  if (error) {
    console.error(
      "Failed to create signed URL for",
      product.storagePath,
      error,
    );
    return null;
  }
  return data.signedUrl;
}

/**
 * Uploads a GLB file to Supabase Storage for the given product.
 * Returns the public URL on success, or null on failure.
 */
export async function uploadModelFile(
  product: Product,
  file: File,
  supabase: SupabaseClient,
): Promise<string | null> {
  if (!product.storagePath) {
    console.error("Product has no storagePath — cannot upload:", product.id);
    return null;
  }
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(product.storagePath, file, {
      contentType: "model/gltf-binary",
      upsert: true,
    });
  if (error) {
    console.error("Upload failed for", product.storagePath, error);
    return null;
  }
  return getModelUrl(product, supabase);
}
