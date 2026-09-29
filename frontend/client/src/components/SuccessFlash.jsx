import { useEffect, useState } from "react";

const FLASH_DURATION_MS = 900;

const SuccessFlash = ({ trigger, gesture = null }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, FLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [trigger]);

  return <div>SuccessFlash</div>;
};

export default SuccessFlash;
