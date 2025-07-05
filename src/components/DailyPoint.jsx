import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./DailyPoint.css";

function DailyPoint({ user, discountActive, setDiscountActive }) {
  const [claimedToday, setClaimedToday] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!user) return;

    const today = new Date().toLocaleDateString("id-ID");
    const lastClaimData = JSON.parse(localStorage.getItem(`dailyPoint-${user.username}`));

    if (lastClaimData && lastClaimData.date === today) {
      setClaimedToday(true);
      setDiscountActive(true);
    }
  }, [user, setDiscountActive]);

  useEffect(() => {
    if (!claimedToday) return;

    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diffMs = midnight - now;

      if (diffMs <= 0) {
        // sudah lewat tengah malam, auto reset
        setClaimedToday(false);
        setDiscountActive(false);
        localStorage.removeItem(`dailyPoint-${user.username}`);
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [claimedToday, user, setDiscountActive]);

  const handleClaim = () => {
    if (!user) {
      toast.error("Kamu harus login untuk klaim diskon harian!");
      return;
    }

    const today = new Date().toLocaleDateString("id-ID");
    localStorage.setItem(`dailyPoint-${user.username}`, JSON.stringify({ date: today }));
    setClaimedToday(true);
    setDiscountActive(true);
    toast.success("Diskon harian berhasil diklaim. Berlaku hari ini!");
  };

  return (
    <div className="daily-point-container">
      {!user ? (
        <p>🔒 Login dulu untuk klaim diskon harian kamu!</p>
      ) : claimedToday ? (
        <>
          <p>🎉 Diskon hari ini sudah kamu klaim.</p>
          <p>⏳ Kamu bisa klaim lagi dalam <strong>{timeLeft}</strong></p>
        </>
      ) : (
        <button onClick={handleClaim}>🎁 Klaim Diskon Harian (Rp 5.000/item)</button>
      )}
    </div>
  );
}

export default DailyPoint;
