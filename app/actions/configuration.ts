"use server";

import { createClient } from "@/lib/supabase/server";

export interface ConfigurationData {
  race: "human" | "goblin";
  helmet: string;
  chestplate: string;
  pants: string;
  shoes: string;
  weapon: string;
  facial_hair: string;
  mount: string;
}

export async function checkExistingConfiguration(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("warrior_configurations")
    .select(
      "id, race, helmet, chestplate, weapon, facial_hair, created_at, updated_at, pants, mount, shoes",
    )
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error - that's expected for new users
    console.error("[v0] Error checking configuration:", error);
    return { exists: false, configuration: null, error: error.message };
  }

  return {
    exists: !!data,
    configuration: data,
    error: null,
  };
}

export async function saveConfiguration(
  userId: string,
  configData: ConfigurationData,
) {
  const supabase = await createClient();

  console.log(
    "[v0] Saving configuration for user:",
    userId,
    "Race:",
    configData.race,
  );

  // First check if configuration exists
  const existingCheck = await checkExistingConfiguration(userId);

  if (existingCheck.error) {
    return {
      success: false,
      error: existingCheck.error,
      operation: null,
    };
  }

  const operation = existingCheck.exists ? "update" : "insert";
  console.log("[v0] Operation type:", operation);

  let data, error;

  if (existingCheck.exists) {
    // UPDATE existing configuration
    const updateResult = await supabase
      .from("warrior_configurations")
      .update({
        helmet: configData.helmet,
        chestplate: configData.chestplate,
        pants: configData.pants,
        shoes: configData.shoes,
        weapon: configData.weapon,
        facial_hair: configData.facial_hair,
        updated_at: new Date().toISOString(),
        mount: configData.mount,
      })
      .eq("user_id", userId)
      .select()
      .single();

    data = updateResult.data;
    error = updateResult.error;
  } else {
    // INSERT new configuration
    const insertResult = await supabase
      .from("warrior_configurations")
      .insert({
        user_id: userId,
        race: configData.race,
        helmet: configData.helmet,
        chestplate: configData.chestplate,
        pants: configData.pants,
        shoes: configData.shoes,
        weapon: configData.weapon,
        facial_hair: configData.facial_hair,
        mount: configData.mount,
      })
      .select()
      .single();

    data = insertResult.data;
    error = insertResult.error;
  }

  if (error) {
    console.error("[v0] Error saving configuration:", error);
    return {
      success: false,
      error: error.message,
      operation,
    };
  }

  console.log("[v0] Configuration saved successfully via", operation);

  return {
    success: true,
    error: null,
    operation,
    data,
  };
}

export async function loadConfiguration(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("warrior_configurations")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("[v0] Error loading configuration:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
