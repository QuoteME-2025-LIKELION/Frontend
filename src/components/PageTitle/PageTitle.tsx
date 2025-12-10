interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <title>{`${title} - Quote Me`}</title>;
}
