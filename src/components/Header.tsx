import { useState, Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LightbulbIcon,
  MenuIcon,
  ChevronDownIcon,
  XIcon,
  LogOutIcon,
  LaughIcon,
  ShoppingCart,
  LucideBookHeart,
  CircleDollarSign,
  HomeIcon,
  MailIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/dark-theme/mode-toggle";
import { ModeSwitch } from "./dark-theme/mode-switch";
import headerLogo from "@/assets/_shared_img/logo.png";
import { signOut } from "firebase/auth";
import { signOutNative } from "@/services/auth.service";
import { auth } from "@/config/firebase";
import { useUserContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";

const exploreItems = [
  {
    name: "首頁",
    description: "",
    to: "/Home",
    icon: HomeIcon,
  },
  {
    name: "喜好清單",
    description: "",
    to: "/like",
    icon: LucideBookHeart,
  },
  {
    name: "購買清單",
    description: "",
    to: "/PurchasHistory",
    icon: CircleDollarSign,
  },
  // {
  //   name: "m",
  //   description: "Just An Item",
  //   to: "/",
  //   icon: LightbulbIcon,
  // },
  {
    name: "管理頁面",
    description: "mygo",
    to: "/manu",
    icon: LaughIcon,
  },
];
const exploreBottomItems = [
  { name: "重設Email", to: "/resend-email", icon: MailIcon },
  { name: "好運推薦", to: "/", icon: LightbulbIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Header = ({
  input,
  setInput,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useUserContext();
  const { cartQuantity, fetchCartQuantity } = useCartContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartQuantity();
  });

  const signOutHandler = () => {
    signOutNative();
    signOut(auth);
    window.location.reload();
  };

  return (
    <header
      className={`shadow-lg dark:shadow-slate-800 shadow-black w-full bg-[hsl(0,0%,100%)] dark:bg-[hsl(222.2,84%,4.9%)] z-50`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className=" -m-1.5 p-1.5">
            <span className="sr-only">Mumu</span>
            <img src={headerLogo} alt="headerLogo" className="h-8 w-auto" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">啟動</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className={`hidden lg:flex lg:gap-x-12`}>
          <Popover className={`relative`}>
            <Popover.Button
              className={`flex items-center gap-x-1 text-sm font-semibold leading-6`}
            >
              探索
              <ChevronDownIcon
                className="h-5 w-5 flex-none"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={`absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl shadow-lg ring-1 bg-white dark:bg-slate-900 dark:ring-gray-500 ring-gray-900/5`}
              >
                <div className="p-4">
                  {exploreItems.map((item) => (
                    <div
                      key={item.name}
                      className={`group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-slate-800`}
                    >
                      <div
                        className={`flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-900`}
                      >
                        <item.icon
                          className="h-6 w-6 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <Link to={item.to} className="block font-semibold">
                          {item.name}
                          <span className="absolute inset-0"></span>
                        </Link>
                        <p className="mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className={`grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-gray-50/5 bg-gray-50 dark:bg-slate-800`}
                >
                  {exploreBottomItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={`flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 hover:bg-gray-100 dark:hover:bg-slate-700`}
                    >
                      <item.icon
                        className="h-5 w-5 flex-none"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <Link
            to="/createproject"
            className={`text-sm font-semibold leading-6`}
          >
            提案
          </Link>
          <Link to="/social" className={`text-sm font-semibold leading-6`}>
            社群
          </Link>
          {/* <Link to="/service" className={`text-sm font-semibold leading-6`}>
            Service
          </Link> */}
        </Popover.Group>
        <div className="ml-8 hidden lg:flex lg:flex-1 lg:justify-end w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Searching..."
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <Button type="submit" onClick={() => navigate("/SearchProject")}>
            Search
          </Button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ModeToggle />
        </div>
        <Button
          onClick={() => navigate("/CartPage")}
          className="hidden lg:flex lg:flex-2 ml-10 bg-slate-100 text-slate-800 dark:hover:bg-slate-500 dark:bg-slate-800 dark:text-slate-200 hover:bg-transparent hover:text-gray-500 w-14"
        >
          <ShoppingCart className="h-24 w-24" />
          <div className="h-2 w-3">
            <span className="bg-rose-700 text-white text-[12px] text-center m-0 font-black">
              {cartQuantity == 0 ? "" : cartQuantity}
            </span>
          </div>
        </Button>
        {user.id ? (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-gray-400 !important"
                onClick={signOutHandler}
              >
                <LogOutIcon />
              </Button>
              <Link
                to={`/users/${user.id}`}
                className="flex justify-center items-center gap-3"
              >
                <img
                  src={user.thumbnail}
                  alt="thumbnail"
                  className="h-10 w-10 rounded-full"
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/sign-in" className="text-sm font-semibold leading-6">
              Sign in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>
      <Dialog
        className={`lg:hidden`}
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-[60]">
          <Dialog.Panel
            className={`fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 dark:bg-slate-900 bg-white ring-gray-900/10`}
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Mumu</span>
                <img src={headerLogo} alt="headerLogo" className="h-8 w-auto" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className={`-my-6 divide-y divide-gray-500/10`}>
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className={`-mx-3`}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-slate-800`}
                        >
                          探索
                          <ChevronDownIcon
                            className={classNames(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none"
                            )}
                            aria-hidden="true"
                          ></ChevronDownIcon>
                        </Disclosure.Button>

                        <Disclosure.Panel className={`mt-2 space-y-2`}>
                          {[...exploreItems, ...exploreBottomItems].map(
                            (item) => (
                              <Disclosure.Button
                                key={item.name}
                                as={Link}
                                to={item.to}
                                className={`block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-slate-800`}
                              >
                                {item.name}
                              </Disclosure.Button>
                            )
                          )}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Link
                    to="/createproject"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-slate-800`}
                  >
                    提案
                  </Link>
                  <Link
                    to="/social"
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-slate-800`}
                  >
                    社群
                  </Link>
                </div>
                <div className="py-6 w-full items-center space-y-2">
                  <Input
                    type="text"
                    placeholder="Searching..."
                    onChange={(e) => setInput(e.currentTarget.value)}
                  />
                  <Button
                    type="submit"
                    onClick={() => {
                      navigate("/SearchProject");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Search
                  </Button>
                </div>

                {user.id ? (
                  <div className="py-6 flex gap-4">
                    <Button
                      variant="ghost"
                      className="flex gap-4 items-center justify-start hover:bg-transparent hover:text-gray-400 !important"
                      onClick={signOutHandler}
                    >
                      <LogOutIcon />
                    </Button>
                    <Link
                      to={`/users/${user.id}`}
                      className="flex justify-center items-center gap-3"
                    >
                      <img
                        src={user.thumbnail}
                        alt="thumbnail"
                        className="h-10 w-10 rounded-full"
                      />
                    </Link>
                  </div>
                ) : (
                  <div className="py-6">
                    <Link
                      to="/sign-in"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      Sign in
                    </Link>
                  </div>
                )}

                <div className="py-6">
                  <ModeSwitch />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </header>
  );
};

export default Header;
