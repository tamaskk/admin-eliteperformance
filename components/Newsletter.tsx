import React, { useState } from "react";
import pic1 from "../assets/Képernyőfotó 2024-10-12 - 11.45.33 2.png";
import pic2 from "../assets/Képernyőfotó 2024-10-12 - 11.47.31 2.png";
import pic3 from "../assets/Képernyőfotó 2024-10-12 - 11.48.27 2.png";
import pic4 from "../assets/Képernyőfotó 2024-10-12 - 11.49.52 2.png";
import pic5 from "../assets/Képernyőfotó 2024-10-12 - 11.50.48 2.png";
import pic6 from "../assets/Képernyőfotó 2024-10-12 - 11.54.35 2.png";
import pic7 from "../assets/Képernyőfotó 2024-10-12 - 11.55.57 2.png";
import { useRouter } from "next/router";

const NewsletterComponent = () => {
  const router = useRouter();

  return (
    <div className="text-black bg-white h-screen min-h-screen p-10 w-full overflow-y-auto flex flex-col items-start justify-start gap-5">
      <h1 className="font-bold text-3xl">Hírlevél</h1>
      <p>
        Itt fogom bemutatni hogy lehet hírlevelet küldeni azoknak akik
        feliratkoztak!
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
        onClick={() => {
          window.open("https://resend.com/login", "_blank");
        }}
      >
        Kattints ide a Resend oldalára való navigáláshoz
      </button>
      <p>
        1. Első pontban be kell jelentkezni a Resend oldalára Google fiókkal
        (ennek a belépési adatait a dokumentációban találod)
      </p>
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.45.33%202.png?alt=media&token=15a2a859-92bc-41b7-87a0-4868524599f5'} alt="" className="w-[900px]" />
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.47.31%202.png?alt=media&token=efcd9d30-459d-4678-a3e5-f92fa551f07e'} alt="" className="w-[900px]" />
      <p className="text-xl">
        2. Kattints a Broadcasts gombra bal oldal a navigációs részen
      </p>
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.48.27%202.png?alt=media&token=4dd7ef6e-5f0f-41f9-b5e7-91a591a55b9d'} alt="" className="w-[900px]" />
      <p className="text-xl">
        3. Kattints a Create email gombra ahol egyedi email kampányt tudsz
        létrehozni de a listában lévő előző kampányokat is használhatod
      </p>
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.49.52%202.png?alt=media&token=20d88ba6-dcc3-4a8b-9d27-607b4949e23e'} alt="" className="w-[900px]" />
      <p className="text-xl">
        4. Az alábbi mezőket kell kitölteni kötelező jeleggel
      </p>
      <ul className="list-decimal ml-10">
        <li>
          "Saját" email cím ide ajánlatos az info@eliteperformance.hu vagy a
          no-reply@eliteperformance.hu-t használni
        </li>
        <li>
          To részre ha belekattintasz ott fel fog ugrani egy Generál nevű fül
          amire ha rákattintasz akkor hozzáadja az összes feliratkozott embert a
          listába
        </li>
        <li>Subject a levél tárgya főképp hogy miről szól a levél</li>
        <li>
          Ez az a rész ahol te magad szabod testre az emailed. Hozzáadhatod az
          alábbi elemenet a / jel beírásával: szöveget, fejlécet, képet, gombot,
          social media gombokat, listákat, idézetet itt igazából testre
          szabadhatod hogy mit szeretnél küldeni.
        </li>
      </ul>
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.50.48%202.png?alt=media&token=e0e46c43-74d3-4fe0-9e4a-a498be9bedc0'} alt="" className="w-[900px]" />
      <p className="text-xl">
        5. Itt látszodik hogy a / jel kell hogy feldobja az elemeket amiket az
        emailbe tudsz tenni.
      </p>
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.54.35%202.png?alt=media&token=cbab2f92-8ea4-455f-820f-34e737a4008b'} alt="" className="w-[900px]" />
      <p>
        6. Itt látszodik egy pár elem de amire viszont figyelned kell hogy a
        legvégére egy Unsubscribe nevezetű blokkot be kell tegyél hogy a
        jobszabályoknak megfelelj
      </p>

      <ul className="list-decimal ml-10">
        <li>
          Itt látszodik a leiratkozási blokk ezt is a / jel segítségével
          beteheted (alulról a 2. lesz)
        </li>
        <li>
          Ha mindennel megvagy és mindent helyesen csináltál akkor a Send gombra
          kattintasz a jobb felső sarokban és akkor látni fogsz a piros négyzet
          felett 2 pipát és ha tényleg meg vagy mindennel akkor jobbra elhuzod a
          nyílat és el is küldi az emailt!
        </li>
      </ul>
      <img src={'https://firebasestorage.googleapis.com/v0/b/eliteperformance-6fc5c.appspot.com/o/landing%2FKe%CC%81pernyo%CC%8Bfoto%CC%81%202024-10-12%20-%2011.55.57%202.png?alt=media&token=4a14cff1-5a5e-4ca2-9423-dd07758fafc1'} alt="" className="w-[900px]" />
      <p>
        8. Ha minden jól ment akkor a Broadcasts fülön látni fogod az elküldött és kész is vagy mindennel!
      </p>
    </div>
  );
};

export default NewsletterComponent;
