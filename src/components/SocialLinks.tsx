import { socialIcons } from "../assets/SocialIcons";

export const DASHBOARD_GITHUB = "https://github.com/jellyfish-dev/jellyfish-dashboard";
export const MEMBRANE_WEBPAGE = "https://membrane.stream/";
export const SWM_WEBPAGE = "https://swmansion.com/?p=1";
export const TWITTER_MEMBRANE = "https://twitter.com/ElixirMembrane";
export const MEMBRANE_DISCORD = "https://discord.gg/nwnfVSY";

export const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a
    className="w-10 h-10 flex items-center text-brand-white hover:text-brand-sea-blue-300"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {icon}
  </a>
);

const SocialLinks = ({ orientation }: { orientation: string }) => {
  return (
    <div className={`flex flex-${orientation} gap-2 p-4 w-full justify-evenly`}>
      <SocialIcon icon={socialIcons.github} href={DASHBOARD_GITHUB} />
      <SocialIcon icon={socialIcons.memebrane} href={MEMBRANE_WEBPAGE} />
      <SocialIcon icon={socialIcons.twitter} href={TWITTER_MEMBRANE} />
      <SocialIcon icon={socialIcons.discord} href={MEMBRANE_DISCORD} />
    </div>
  );
};
export default SocialLinks;
