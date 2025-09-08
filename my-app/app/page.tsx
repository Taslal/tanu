"use client";

import { useState } from "react";
import Image from "next/image";
import AppScreenContainer from "@/components/AppScreenContainer";

export default function Home() {
  const [appIconCurrentStep, setAppIconCurrentStep] = useState(2);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

 
  const addPhoneNumber = async () => {
    setMsg(null);

    if (phoneNumber.length !== 8 || !/^\d{8}$/.test(phoneNumber)) {
      setMsg({ type: "err", text: "8 оронтой дугаар оруулна уу." });
      return;
    }

    if (phoneNumbers.includes(phoneNumber)) {
      setMsg({ type: "err", text: "Энэхүү дугаар жагсаалтанд байна." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setMsg({ type: "err", text: "Энэхүү дугаар өмнө нь хадгалагдсан тул амжилтгүй." });
        } else {
          setMsg({ type: "err", text: data?.message || "Сервер алдаа гарлаа." });
        }
      } else {
        setPhoneNumbers([...phoneNumbers, phoneNumber]);
        setPhoneNumber("");
        setMsg({ type: "ok", text: data.message || "Амжилттай хадгалсан." });
      }
    } catch (e) {
      setMsg({ type: "err", text: "Сервертэй холбогдоход алдаа гарлаа." });
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async () => {
    setMsg(null);

    if (phoneNumber.length !== 8 || !/^\d{8}$/.test(phoneNumber)) {
      setMsg({ type: "err", text: "8 оронтой дугаар оруулна уу." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/phones");
      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "err", text: "Сервер алдаа гарлаа." });
        return;
      }

     
      if (data.phones.includes(phoneNumber)) {
        setMsg({ type: "ok", text: "Амжилттай нэвтэрлээ." });
        setPhoneNumber("");
      } else {
        setMsg({ type: "err", text: "Амжилтгүй нэвтрэх. Дугаар олдсонгүй." });
      }
    } catch (e) {
      setMsg({ type: "err", text: "Сервертэй холбогдоход алдаа гарлаа." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      {appIconCurrentStep === 2 && (
        <AppScreenContainer>
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <Image className="dark:invert" src="/tanulogo.svg" alt="" width={180} height={38} priority />
            <ol className="font-mono text-sm/6 text-center sm:text-left">
              <li className="mb-2 tracking-[-.01em]">Example landing page</li>
            </ol>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setAppIconCurrentStep(3)}
                className="bg-white text-black px-4 py-2 rounded-lg"
              >
                Нэвтрэх
              </button>
              <button
                onClick={() => setAppIconCurrentStep(4)}
                className="bg-white text-black px-4 py-2 rounded-lg"
              >
                Бүртгүүлэх
              </button>
            </div>
          </main>
        </AppScreenContainer>
      )}

     
     {appIconCurrentStep === 3 && (
  <AppScreenContainer>
    <h2 className="mb-2 text-lg font-bold text-center">Нэвтрэх</h2>
    <footer className=" flex flex-col gap-4 items-center justify-center w-full">
      <div className="relative w-full max-w-md">
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          type="text"
          placeholder="Утсаа оруулна уу"
          className="bg-white text-black shadow-lg rounded-lg pl-10 pr-4 py-3 w-full text-lg"
          maxLength={8}
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
          <Image src="/logophone.png" alt="Phone Icon" width={24} height={24} />
        </span>
      </div>

      <button
        onClick={async () => {
          setMsg(null);
          if (phoneNumber.length !== 8 || !/^\d{8}$/.test(phoneNumber)) {
            setMsg({ type: "err", text: "8 оронтой дугаар оруулна уу." });
            return;
          }

          try {
            setLoading(true);
            const res = await fetch("http://localhost:4000/api/phones");
            const data = await res.json();

            if (!res.ok) {
              setMsg({ type: "err", text: "Сервер алдаа гарлаа." });
              return;
            }

            if (data.phones.includes(phoneNumber)) {
              setMsg({ type: "ok", text: "Амжилттай нэвтэрлээ." });
              setPhoneNumber("");
              
              setTimeout(() => setAppIconCurrentStep(5), 1000); 
            } else {
              setMsg({ type: "err", text: "Амжилтгүй нэвтрэх. Дугаар олдсонгүй." });
            }
          } catch (e) {
            setMsg({ type: "err", text: "Сервертэй холбогдоход алдаа гарлаа." });
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
        className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg w-full max-w-md text-lg"
      >
        {loading ? "Шалгаж байна..." : "Нэвтрэх"}
      </button>

      {msg && (
        <div
          className={`mt-2 max-w-md text-center ${
            msg.type === "ok" ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg.text}
        </div>
      )}

      <button
        onClick={() => setAppIconCurrentStep(2)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full max-w-md"
      >
        Буцах
      </button>
    </footer>
  </AppScreenContainer>
)}


  
      {appIconCurrentStep === 4 && (
        <AppScreenContainer>
          <h2 className="mb-2 text-lg font-bold text-center">Бүртгүүлэх</h2>
          <footer className="row-start-2 flex flex-col gap-4 items-center justify-center w-full">
            <div className="relative w-full max-w-md">
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                type="text"
                placeholder="Утсаа оруулна уу"
                className="bg-white text-black shadow-lg rounded-lg pl-10 pr-4 py-3 w-full text-lg"
                maxLength={8}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Image src="/logophone.png" alt="Phone Icon" width={24} height={24} />
              </span>
            </div>

            <button
              onClick={addPhoneNumber}
              disabled={loading}
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg w-full max-w-md text-lg"
            >
              {loading ? "Хадгалж байна..." : "Нэмэх"}
            </button>

            {msg && (
              <div
                className={`mt-2 max-w-md text-center ${
                  msg.type === "ok" ? "text-green-600" : "text-red-600"
                }`}
              >
                {msg.text}
              </div>
            )}

            <button
              onClick={() => setAppIconCurrentStep(2)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full max-w-md"
            >
              Буцах
            </button>
          </footer>
        </AppScreenContainer>
      )}
      {appIconCurrentStep === 5 && (
        <AppScreenContainer>
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <Image className="dark:invert" src="/tanulogo.svg" alt="" width={180} height={38} priority />
            <ol className="font-mono text-sm/6 text-center sm:text-left">
              <li className="mb-2 tracking-[-.01em]">баяр хүргэе та амжилттай нэвтэрлээ😄😄😄</li>
            </ol>
            <button
              onClick={() => setAppIconCurrentStep(2)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full max-w-md"
            >
              Буцах
            </button>
          </main>
        </AppScreenContainer>
      )}
    </>
  );
}
