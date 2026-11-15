import type { SECTIONS } from '../../sections';

type SectionLinkProps = {
  section: (typeof SECTIONS)[number];
  className: string;
  /** the section on screen */
  current?: boolean;
  onClick?: () => void;
};

// a link to one of the landing's sections
const SectionLink = ({
  section,
  className,
  current = false,
  onClick,
}: SectionLinkProps) => (
  <a
    className={className}
    href={`/#${section.hash}`}
    aria-current={current ? 'true' : undefined}
    onClick={onClick}
  >
    {section.label()}
  </a>
);

export default SectionLink;
