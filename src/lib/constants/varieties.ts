export interface SugarcaneVariety {
  code: string;
  name: string;
  maturity: "अगेती (Early)" | "मध्यम (Mid-late)" | "सामान्य (General)";
  yieldQuintalPerAcre: string;
  sugarRecovery: string;
  recommendedFor: string;
}

export const SUGARCANE_VARIETIES: SugarcaneVariety[] = [
  {
    code: "Co 0238",
    name: "Co 0238 (करन 4)",
    maturity: "अगेती (Early)",
    yieldQuintalPerAcre: "350 - 450",
    sugarRecovery: "12.0 - 13.5%",
    recommendedFor: "चीनी मिलों व कोल्हू गुड़ के लिए सर्वाधिक लोकप्रिय",
  },
  {
    code: "Co 0118",
    name: "Co 0118 (करन 2)",
    maturity: "अगेती (Early)",
    yieldQuintalPerAcre: "320 - 400",
    sugarRecovery: "12.2 - 13.0%",
    recommendedFor: "रोगरोधी (Red rot resistant), उच्च मिठास",
  },
  {
    code: "Co 15023",
    name: "Co 15023 (अग्रणी)",
    maturity: "अगेती (Early)",
    yieldQuintalPerAcre: "380 - 480",
    sugarRecovery: "13.0 - 14.0%",
    recommendedFor: "नया उन्नत किस्म, रिकॉर्ड रिकवरी",
  },
  {
    code: "CoLk 14201",
    name: "CoLk 14201 (इक्षु)",
    maturity: "अगेती (Early)",
    yieldQuintalPerAcre: "350 - 420",
    sugarRecovery: "11.8 - 12.8%",
    recommendedFor: "जलभराव सहने योग्य, मजबूत तना",
  },
  {
    code: "Co 98014",
    name: "Co 98014 (करन 1)",
    maturity: "मध्यम (Mid-late)",
    yieldQuintalPerAcre: "300 - 360",
    sugarRecovery: "11.5 - 12.2%",
    recommendedFor: "स्थानीय कोल्हू व गुड़ निर्माण",
  },
  {
    code: "Co 05011",
    name: "Co 05011",
    maturity: "मध्यम (Mid-late)",
    yieldQuintalPerAcre: "320 - 380",
    sugarRecovery: "11.2 - 12.0%",
    recommendedFor: "देरी से कटाई के लिए उपयुक्त",
  },
  {
    code: "OTHER",
    name: "देसी / अन्य किस्म",
    maturity: "सामान्य (General)",
    yieldQuintalPerAcre: "250 - 320",
    sugarRecovery: "10.5 - 11.5%",
    recommendedFor: "सामान्य स्थानीय गुड़ व चारा",
  },
];
