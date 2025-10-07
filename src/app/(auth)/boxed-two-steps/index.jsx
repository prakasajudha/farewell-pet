import AuthBg from '@/assets/images/auth-bg.jpg';
import Boxed from '@/assets/images/boxed.png';
import ArabianFlag from '@/assets/images/flags/arebian.svg';
import FrenchFlag from '@/assets/images/flags/french.jpg';
import GermanyFlag from '@/assets/images/flags/germany.jpg';
import ItalyFlag from '@/assets/images/flags/italy.jpg';
import JapaneseFlag from '@/assets/images/flags/japanese.svg';
import RussiaFlag from '@/assets/images/flags/russia.jpg';
import SpainFlag from '@/assets/images/flags/spain.jpg';
import UsFlag from '@/assets/images/flags/us.jpg';
import LogoDark from '@/assets/images/logo-dark.png';
import LogoLight from '@/assets/images/logo-light.png';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router';
const Index = () => {
  return <>
      <PageMeta title="Two Steps" />
      <div className="bg-cover bg-no-repeat min-h-screen flex justify-center items-center" style={{
      backgroundImage: `url(${AuthBg})`
    }}>
        {' '}
        <div className="relative">
          <div className="bg-card/70 rounded-lg w-2/3 mx-auto">
            <div className="grid lg:grid-cols-12 grid-cols-1 items-center gap-0">
              <div className="lg:col-span-5">
                <div className="text-center px-10 py-12">
                  <div className="mt-8">
                    <h4 className="mb-2 text-primary text-xl font-semibold">Verify Email</h4>
                    <p className="text-base mb-8 text-default-500">
                      Please enter the 4 digit code sent to tailwick@themesdesign.in
                    </p>
                  </div>

                  <form action="/index">
                    <div className="grid grid-cols-4 gap-2">
                      <input type="text" className="form-input text-center" placeholder="•" maxLength={1} />
                      <input type="text" className="form-input text-center" placeholder="•" maxLength={1} />
                      <input type="text" className="form-input text-center" placeholder="•" maxLength={1} />
                      <input type="text" className="form-input text-center" placeholder="•" maxLength={1} />
                    </div>

                    <div className="mt-10">
                      <button type="button" className="btn bg-primary text-white w-full">
                        Confirm
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-7 bg-card/60 mx-2 my-2 shadow-[0_14px_15px_-3px_#f1f5f9,0_4px_6px_-4px_#f1f5f9] dark:shadow-none rounded-lg">
                <div className="pt-10 px-10 h-full">
                  <div className="flex items-center justify-between gap-3">
                    <Link to="/index">
                      <img src={LogoDark} alt="logo dark" className="h-6 block dark:hidden" width={111} />
                      <img src={LogoLight} alt="logo light" className="h-6 hidden dark:block" width={111} />
                    </Link>

                    <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                      <button type="button" className="hs-dropdown-toggle py-2 px-4 bg-transparent border border-default-200 text-default-600 hover:border-primary rounded-md hover:text-primary font-medium text-sm gap-2 flex items-center">
                        <img src={UsFlag} alt="US Flag" className="size-5 rounded-full" />
                        English
                      </button>

                      <div className="hs-dropdown-menu">
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={UsFlag} alt="US Flag" className="size-4 rounded-full" />
                          English
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={SpainFlag} alt="Spain" className="size-4 rounded-full" />
                          Spanish
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={GermanyFlag} alt="Germany" className="size-4 rounded-full" />
                          German
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={FrenchFlag} alt="France" className="size-4 rounded-full" />
                          French
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={JapaneseFlag} alt="Japan" className="size-4 rounded-full" />
                          Japanese
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={ItalyFlag} alt="Italy" className="size-4 rounded-full" />
                          Italian
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={RussiaFlag} alt="Russia" className="size-4 rounded-full" />
                          Russian
                        </a>
                        <a className="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded">
                          <img src={ArabianFlag} alt="Arabic" className="size-4 rounded-full" />
                          Arabic
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <img src={Boxed} alt="Illustration" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
};
export default Index;