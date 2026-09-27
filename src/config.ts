// One file to edit when you start a new app. The rebrand script rewrites this.
export const Config = {
  appName: "Kit",
  tagline: "A premium iOS foundation, already accessible and already fast.",

  // the two headline stats on Home
  statA: "Requests",
  statB: "Errors",

  // the first section heading below the stats
  sectionTitle: "First section",

  // EAS / Apple identity — the rebrand script fills these
  bundleId: "ca.motionmenu.kit",
  easOwner: "dafnimos",
} as const;

export type KitConfig = typeof Config;
