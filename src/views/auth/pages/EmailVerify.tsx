import { Link, useParams } from "react-router-dom";
import { CircleCheckBig, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "@/utils/motion";
import { TypingText } from "@/components/shared/CustomText";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/services/auth.service";

const EmailVerify = () => {
  const { username, Eid } = useParams();
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const emailVerify = async () => {
    if (username && Eid) {
      const res = await verifyEmail(username, Eid);
      setIsVerified(res);
    }
  };

  useEffect(() => {
    emailVerify();
  }, []);

  return (
    <>
      {isVerified && (
        <motion.div
          variants={staggerContainer(0, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="w-full h-screen flex flex-col justify-center items-center overflow-hidden"
        >
          <motion.div variants={zoomIn(0.4, 1)}>
            <CircleCheckBig
              width={128}
              height={128}
              className="text-green-400"
            />
          </motion.div>
          <TypingText
            title="驗證成功"
            textStyles="text-5xl font-bold mt-5 text-green-400 text-center"
          />

          <motion.div variants={fadeIn("up", "tween", 0.2, 1)}>
            <Link to="/">
              <Button variant="outline" className="mt-5 text-xl font-bold">
                回首頁
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
      {!isVerified && (
        <motion.div
          variants={staggerContainer(0, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          className="w-full h-screen flex flex-col justify-center items-center overflow-hidden"
        >
          <motion.div variants={zoomIn(0.4, 1)}>
            <CircleX width={128} height={128} className="text-red" />
          </motion.div>
          <TypingText
            title="驗證失敗"
            textStyles="text-5xl font-bold mt-5 text-red text-center"
          />

          <motion.div
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="flex flex-col justify-center items-center gap-3"
          >
            <Button
              variant="outline"
              className="mt-5 text-xl font-bold"
              onClick={emailVerify}
            >
              重新驗證
            </Button>
            <Link to="/">
              <Button variant="outline" className="mt-5 text-xl font-bold">
                回首頁
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default EmailVerify;
