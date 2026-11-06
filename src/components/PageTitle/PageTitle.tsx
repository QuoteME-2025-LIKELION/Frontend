import VisuallyHidden from "@/components/VisuallyHidden/VisuallyHidden";

interface PageTitleProps {
  title: string;
  heading?: boolean;
}

/** 문서 제목과, 화면에 제목이 없는 경우에만 숨김 h1을 제공한다. */
export default function PageTitle({ title, heading = false }: PageTitleProps) {
  return (
    <>
      <title>{`${title} - Quote Me`}</title>
      {heading && <VisuallyHidden as="h1">{title}</VisuallyHidden>}
    </>
  );
}
