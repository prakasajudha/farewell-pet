import { Link } from 'react-router';
import { LuChevronRight } from 'react-icons/lu';
const PageBreadcrumb = ({
  title,
  subtitle
}) => {
  return <div className="flex items-center md:justify-between flex-wrap gap-2 mb-4 print:hidden">
      <h4 className="text-default-900 text-lg font-semibold">{title}</h4>

      <div className="md:flex hidden items-center gap-2 text-sm font-semibold">
        <Link to="#" className="text-sm font-medium text-default-700">
          BisikBerbisik
        </Link>

        <LuChevronRight className="text-sm flex-shrink-0 text-default-500 rtl:rotate-180" size={14} />

        {subtitle && <>
            <Link to="#" className="text-sm font-medium text-default-700">
              {subtitle}
            </Link>

            <LuChevronRight className="text-sm flex-shrink-0 text-default-500 rtl:rotate-180" size={14} />
          </>}

        <Link to="#" className="text-sm font-medium text-default-700" aria-current="page">
          {title}
        </Link>
      </div>
    </div>;
};
export default PageBreadcrumb;