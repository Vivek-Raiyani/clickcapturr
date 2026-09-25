import { fetchApi } from "../api";
import { PageBuilderState } from "@/components/page-builder/types";

// Types matching the backend responses
export interface PageResponse {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  content_json: any; // The complex nested JSON structure
  total_visits: number;
  total_lead_captures: number;
  link: any; // LinkResponse
  created_at: string;
  updated_at: string;
}

export const getPages = async (): Promise<PageResponse[]> => {
  const response = await fetchApi("/pages/");
  return response.data;
};

export const getPage = async (id: string): Promise<PageResponse> => {
  const response = await fetchApi(`/pages/${id}`);
  return response.data;
};

export const getPublicPage = async (slug: string): Promise<PageResponse> => {
  const response = await fetchApi(`/pages/public/${slug}`);
  return response.data;
};

export const createPage = async (payload: any): Promise<PageResponse> => {
  const response = await fetchApi("/pages/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
};

export const updatePage = async (id: string, payload: any): Promise<PageResponse> => {
  const response = await fetchApi(`/pages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.data;
};

export const deletePage = async (id: string): Promise<void> => {
  await fetchApi(`/pages/${id}`, {
    method: "DELETE",
  });
};

/**
 * Maps the frontend PageBuilderState to the backend PageCreate/PageUpdate payload.
 * Extracts the top-level fields (name, slug, description) and nests everything else
 * inside `content_json` as expected by the backend schema.
 */
export const mapStateToPayload = (state: PageBuilderState) => {
  return {
    name: state.title,
    slug: state.slug,
    description: state.content.description || null, // Keep description at top level if needed, or both
    content_json: {
      // Overall design
      layout: state.theme.template,
      fonts: {
        headlineFont: state.theme.fonts?.headlineFont,
        subtitleFont: state.theme.fonts?.subtitleFont,
        formFont: state.theme.fonts?.formFont,
        buttonFont: state.theme.fonts?.buttonFont,
        headlineWeight: state.theme.fonts?.headlineWeight,
      },
      logo: state.theme.logoUrl,
      background: state.theme.background,
      theme: {
        primary: state.theme.primaryColor,
        secondary: state.theme.textColor,
        "tersory color": state.theme.accentColor, // Mapping to alias
      },
      // Page Sections
      eyebrow: state.content.eyebrow,
      headline: state.content.headline,
      headlineSize: state.content.headlineSize,
      headlineAlign: state.content.headlineAlign,
      description: state.content.description,
      descriptionSize: state.content.descriptionSize,
      hero: state.content.hero,
      buttonText: state.content.buttonText,
      offer: state.content.offer,
      additionalContentEnabled: state.content.additionalContentEnabled,
      testimonials: state.content.testimonials,
      detail_form: state.formFields,
      successEffect: state.content.successEffect,
      successTitle: state.content.successTitle,
      successSubtitle: state.content.successSubtitle,
      successButtonText: state.content.successButtonText,
    },
  };
};

/**
 * Maps the backend PageResponse payload back into a frontend PageBuilderState.
 */
export const mapPayloadToState = (page: PageResponse, defaultState: PageBuilderState): PageBuilderState => {
  const contentJson = page.content_json || {};
  
  return {
    title: page.name || defaultState.title,
    slug: page.slug || defaultState.slug,
    theme: {
      ...defaultState.theme,
      template: contentJson.layout || defaultState.theme.template,
      logoUrl: contentJson.logo || defaultState.theme.logoUrl,
      background: contentJson.background || defaultState.theme.background,
      primaryColor: contentJson.theme?.primary || defaultState.theme.primaryColor,
      textColor: contentJson.theme?.secondary || defaultState.theme.textColor,
      accentColor: contentJson.theme?.["tersory color"] || defaultState.theme.accentColor,
      fonts: contentJson.fonts
        ? {
            ...defaultState.theme.fonts,
            ...contentJson.fonts,
          }
        : contentJson.font
        ? {
            ...defaultState.theme.fonts,
            headlineFont: contentJson.font,
            subtitleFont: contentJson.font,
            formFont: contentJson.font,
            buttonFont: contentJson.font,
          }
        : defaultState.theme.fonts,
    },
    content: {
      ...defaultState.content,
      eyebrow: contentJson.eyebrow ?? defaultState.content.eyebrow,
      headline: contentJson.headline ?? defaultState.content.headline,
      headlineSize: contentJson.headlineSize ?? defaultState.content.headlineSize,
      headlineAlign: contentJson.headlineAlign ?? defaultState.content.headlineAlign,
      description: contentJson.description ?? defaultState.content.description,
      descriptionSize: contentJson.descriptionSize ?? defaultState.content.descriptionSize,
      hero: contentJson.hero ?? defaultState.content.hero,
      buttonText: contentJson.buttonText ?? defaultState.content.buttonText,
      offer: contentJson.offer ?? defaultState.content.offer,
      additionalContentEnabled: contentJson.additionalContentEnabled ?? defaultState.content.additionalContentEnabled,
      testimonials: contentJson.testimonials ?? defaultState.content.testimonials,
      successEffect: contentJson.successEffect ?? defaultState.content.successEffect,
      successTitle: contentJson.successTitle ?? defaultState.content.successTitle,
      successSubtitle: contentJson.successSubtitle ?? defaultState.content.successSubtitle,
      successButtonText: contentJson.successButtonText ?? defaultState.content.successButtonText,
    },
    formFields: contentJson.detail_form || defaultState.formFields,
    showSuccessPreview: false,
  };
};
