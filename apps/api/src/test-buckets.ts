import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string, 
  process.env.SUPABASE_SERVICE_ROLE_KEY as string, 
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function check() {
  const { data, error } = await supabaseAdmin.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Buckets:", data.map(b => b.name));
  }
}

check();
