// ============================================================
//  Discover Karabakh — Home Module Types
// ============================================================

export interface NavLink {
    t: string;       // title
    d: string;       // description
    href: string;
}

export interface MegaSection {
    links: NavLink[];
}

export interface MegaMenu {
    explore: MegaSection;
    things: MegaSection;
    where: MegaSection;
    plan: MegaSection;
    corporate: MegaSection;
}

export interface NavItem {
    label: string;
    href: string;
    key: keyof MegaMenu;
}

export interface SeoMeta {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
}
