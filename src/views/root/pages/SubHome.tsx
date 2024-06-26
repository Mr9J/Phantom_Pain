import Ad from "@/components/Ad";
import HomeCardField from "@/components/HomeCardField";
import { HomeCarousel } from "@/components/HomeCarousel";
import { Helmet } from "react-helmet-async";

function SubHome() {
  return (
    <>
      <Helmet>
        <title>Mumu</title>
      </Helmet>
      <Ad id="1"></Ad>
      <HomeCarousel />
      <HomeCardField></HomeCardField>
    </>
  );
}
export default SubHome;
