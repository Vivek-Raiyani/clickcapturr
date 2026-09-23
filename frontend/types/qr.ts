export interface QRConfig {
  type?: "solid" | "gradient";
  color_palette?: {
    solid?: { primary: string; secondary?: string };
    gradient?: { primary: string; secondary: string };
  };
  pattern?: "squares" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
  shape?: "square" | "rounded" | "extra-rounded" | "dot";
  logo_url?: string;
  background_image?: string;
  gradient_direction?: "to_top" | "to_bottom" | "to_left" | "to_right" | "radial";
  background_image_opacity?: number;
}
