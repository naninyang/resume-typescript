import Link from 'next/link';

const domainRegex = /http[s]*:\/\/[www.]*domain\.com[/]?/

interface LinkButtonProps {
  href: string;
  [key: string]: any;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, ...rest }) => {
  const sameDomain = domainRegex.test(href);

  if (sameDomain) {
    href = href.replace(domainRegex, '/');
  }

  if (href.startsWith('/')) {
    return (
      <Link
        href={href}
        {...rest}
      />
    );
  }

  if (!href.startsWith('http')) {
    return (
      <a
        href={href}
        {...rest}
      />
    );
  }

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer nofollow'
      {...rest}
    />
  );
}

export default LinkButton;
