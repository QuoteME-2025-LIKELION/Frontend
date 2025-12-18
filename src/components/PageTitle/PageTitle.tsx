interface PageTitleProps {
  title: string;
}

/**
 * 페이지 타이틀 설정 컴포넌트
 * @param props.title 페이지 제목
 */
export default function PageTitle({ title }: PageTitleProps) {
  return <title>{`${title} - Quote Me`}</title>;
}
