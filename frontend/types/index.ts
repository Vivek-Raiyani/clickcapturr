/**
 * types/index.ts
 * --------------
 * Central barrel — all shared frontend types live here or are re-exported
 * from sub-modules.  Import from "@/types" in all component/action files.
 */

// Re-export page-specific types
export type {
  TemplateStyle,
  PageThemeFonts,
  PageBackground,
  PageTheme,
  HeroMedia,
  OfferConfig,
  TestimonialItem,
  SponsorItem,
  ContentBlockType,
  ContentBlockItem,
  FormSuccessAction,
  FormSuccessEffect,
  PageContent,
} from "./page";

// ---------------------------------------------------------------------------
// Form Fields
// ---------------------------------------------------------------------------

export type FormFieldType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "custom";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id:          string;
  pageId:      string;
  label:       string;
  fieldType:   FormFieldType;
  isRequired:  boolean;
  sortOrder:   number;
  optionsJson: FormFieldOption[] | null;
  createdAt:   string;
}

// ---------------------------------------------------------------------------
// Page (as returned by the API)
// ---------------------------------------------------------------------------

export interface Page {
  id:                   string;
  user_id:              string;
  name:                 string;
  slug:                 string;
  description:          string | null;
  content_json:         Record<string, unknown> | null;
  total_visits:         number;
  total_lead_captures:  number;
  link?:                Link | null;
  created_at:           string;
  updated_at:           string;

  // Convenience aliases the frontend uses
  /** Alias for `name` — used by PageBuilder and dashboard UI */
  title?:       string;
  /** Whether the page is publicly accessible */
  isActive?:    boolean;
  themeJson?:   Record<string, unknown>;
  contentJson?: Record<string, unknown> & {
    formFields?: FormField[];
  };
}

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

export interface Link {
  id:          string;
  shortCode:   string;
  shortcode?:  string;     // backend snake_case alias
  type?:       "qr" | "short_link";
  label?:      string;
  total_clicks: number;
  total_scans:  number;
  qr_config?:  Record<string, unknown> | null;
  page_id?:    string;
  campaign_id?: string;
  created_at:  string;
}

// ---------------------------------------------------------------------------
// Form Submission (one ContactLink event, flattened)
// ---------------------------------------------------------------------------

export interface FormSubmission {
  id:           string;
  page_id:      string;
  contact_id:   string;
  link_id:      string | null;
  campaign_id:  string | null;
  created_at:   string;
  /** Alias for created_at — some UI components use this name */
  submittedAt:  string;

  // --- page ---
  pageName?:    string;
  page_name?:   string;

  // --- campaign ---
  campaign_name?: string;
  campaignName?:  string;

  // Contact fields (flattened from the contacts table)
  email:        string | null;
  first_name:   string | null;
  last_name:    string | null;
  phone:        string | null;

  // Raw form payload
  dataJson:     Record<string, string> | null;
  data_json?:   Record<string, string> | null;

  // Location
  country:      string | null;
  country_name: string | null;
  state:        string | null;
  city:         string | null;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface AnalyticsSummary {
  totalViews:      number;
  totalClicks:     number;
  totalScans:      number;
  totalLeads:      number;
  /** Unique visitors — alias / superset of totalViews for some UI components */
  uniqueVisitors?: number;
  byCountry:       Record<string, number>;
  byDevice:        {
    desktop:  number;
    mobile:   number;
    tablet:   number;
    unknown:  number;
  };
}
