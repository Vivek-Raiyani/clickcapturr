import { fetchApi } from "../api";

export interface LinkResponse {
  id: string;
  user_id: string;
  page_id: string | null;
  campaign_id: string | null;
  shortcode: string;
  label: string | null;
  total_clicks: number;
  total_scans: number;
  total_lead_captures: number;
  platform: string | null;
  platform_content_id: string | null;
  platform_views: number;
  platform_stats: Record<string, any> | null;
  qr_config: import("@/types/qr").QRConfig | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignResponse {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  page_id: string | null;
  created_at: string;
  updated_at: string;
  total_visits: number;
  total_lead_captures: number;
  links: LinkResponse[];
}

export const getCampaigns = async (): Promise<CampaignResponse[]> => {
  const response = await fetchApi("/campaigns/");
  return response.data;
};

export const getCampaign = async (id: string): Promise<CampaignResponse> => {
  const response = await fetchApi(`/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (payload: {
  title: string;
  description?: string;
  page_id?: string | null;
}): Promise<CampaignResponse> => {
  const response = await fetchApi("/campaigns/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
};

export const updateCampaign = async (
  id: string,
  payload: { title?: string; description?: string; page_id?: string | null }
): Promise<CampaignResponse> => {
  const response = await fetchApi(`/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await fetchApi(`/campaigns/${id}`, {
    method: "DELETE",
  });
};

// ── Link management for campaigns ──────────────────────────────────────────

export const createCampaignLink = async (payload: {
  campaign_id: string;
  label?: string;
  platform?: string;
  platform_content_id?: string;
}): Promise<LinkResponse> => {
  const response = await fetchApi("/links/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
};

export const deleteCampaignLink = async (linkId: string): Promise<void> => {
  await fetchApi(`/links/${linkId}`, {
    method: "DELETE",
  });
};

export const updateCampaignLink = async (
  linkId: string,
  payload: { label?: string; platform?: string; platform_content_id?: string; qr_config?: import("@/types/qr").QRConfig | null }
): Promise<LinkResponse> => {
  const response = await fetchApi(`/links/${linkId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.data;
};

export const syncLinkStats = async (linkId: string): Promise<LinkResponse> => {
  const response = await fetchApi(`/links/${linkId}/sync-stats`, {
    method: "POST",
  });
  return response.data;
};

