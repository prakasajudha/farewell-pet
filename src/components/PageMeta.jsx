const PageMeta = ({
  title
}) => {
  return <title>
    {title ? `${title} | ABHIVARDHANA ANVAYA` : 'ABHIVARDHANA ANVAYA'}
  </title>;
};
export default PageMeta;